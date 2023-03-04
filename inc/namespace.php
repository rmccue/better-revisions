<?php

namespace BetterRevisions;

use WP_Post;

function bootstrap() {
	add_action( 'load-revision.php', __NAMESPACE__ . '\\load_revision_page' );
}

/**
 * Load the revision page.
 */
function load_revision_page() : void {
	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );
	add_action( 'should_load_block_editor_scripts_and_styles', '__return_true' );
	add_action( 'in_admin_header', __NAMESPACE__ . '\\remove_screen_help' );
}

/**
 * Remove the screen help for the revisions page.
 */
function remove_screen_help() : void {
	$screen = get_current_screen();
	$screen->remove_help_tabs();
}

/**
 * Enqueue assets for our revisions.
 */
function enqueue_assets() : void {
	// Remove the built-in revisions UI.
	wp_dequeue_script( 'revisions' );

	wp_enqueue_script( 'wp-blocks' );

	// Add our revision UI instead.
	$config = require PLUGIN_DIR . '/build/index.asset.php';
	wp_enqueue_script(
		'better-revisions',
		plugins_url( 'build/index.js', PLUGIN_FILE ),
		$config['dependencies'],
		$config['version'],
		true
	);
	wp_enqueue_style(
		'better-revisions',
		plugins_url( 'build/style.css', PLUGIN_FILE ),
		[],
		// $config['version']
		time()
	);

	// Pull the data from the globals, helpfully prepared for us by core.
	/** @var \WP_Post */
	$post = $GLOBALS['post'];
	/** @var int */
	$revision = $GLOBALS['revision_id'];
	/** @var int|null */
	$from = $GLOBALS['from'];
	$data = prepare_revision_data( $post, $revision, $from );
	wp_localize_script( 'better-revisions', 'BRData', $data );

	// Preload server-registered block schemas.
	// wp_add_inline_script(
	// 	'wp-blocks',
	// 	'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
	// );
}

function prepare_revision_data( WP_Post $post, int $revision_id, ?int $from ) : array {
	$data = prepare_revisions_for_js( $post, $revision_id, $from );

	return [
		'site' => [
			'api' => rest_url(),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		],
		'post' => $post->ID,
		'back' => get_edit_post_link(),
		'revisions' => $data,
	];
}

/**
 * Prepare revisions for JavaScript.
 *
 * @since 3.6.0
 *
 * @param WP_Post $post The post object or post ID.
 * @param int $selected_revision_id The selected revision ID.
 * @param int $from Optional. The revision ID to compare from.
 * @return array An associative array of revision data and related settings.
 */
function prepare_revisions_for_js( WP_Post $post, $selected_revision_id, $from = null ) {
	$revisions = array_values( wp_get_post_revisions(
		$post->ID,
		[
			'order' => 'ASC',
			'check_enabled' => false,
		]
	) );

	$current_id = false;

	$revision_data = [];
	foreach ( $revisions as $idx => $revision ) {
		$autosave = (bool) wp_is_post_autosave( $revision );
		$current  = ! $autosave && $revision->post_modified_gmt === $post->post_modified_gmt;
		if ( $current && ! empty( $current_id ) ) {
			// If multiple revisions have the same post_modified_gmt, highest ID is current.
			if ( $current_id < $revision->ID ) {
				$revisions[ $current_id ]['current'] = false;
				$current_id  = $revision->ID;
			} else {
				$current = false;
			}
		} elseif ( $current ) {
			$current_id = $revision->ID;
		}

		$revision_data[ $revision->ID ] = [
			'id' => $revision->ID,
			'title' => [
				'raw' => $revision->post_title,
				'rendered' => get_the_title( $revision->ID ),
			],
			'content' => [
				'raw' => $revision->post_content,
			],
			'excerpt' => [
				'raw' => $revision->post_excerpt,
			],
			'author' => $revision->post_author,
			'date' => mysql2date( 'c', $revision->post_date ),
			'date_gmt' => mysql2date( 'c', $revision->post_date_gmt ),
			'modified' => mysql2date( 'c', $revision->post_modified ),
			'modified_gmt' => mysql2date( 'c', $revision->post_modified_gmt ),
			'br_version' => [
				'autosave' => $autosave,
				'current' => $current,
				'number' => $idx + 1,
			],
		];
	}

	/**
	 * If we only have one revision, the initial revision is missing; This happens
	 * when we have an autsosave and the user has clicked 'View the Autosave'
	 */
	if ( 1 === count( $revisions ) ) {
		$revisions[ $post->ID ] = array(
			'id' => $post->ID,
			'title' => [
				'raw' => $post->post_title,
				'rendered' => get_the_title( $post->ID ),
			],
			'content' => [
				'raw' => $post->post_content,
			],
			'excerpt' => [
				'raw' => $post->post_excerpt,
			],
			'author' => $revision->post_author,
			'date' => mysql2date( 'c', $post->post_date ),
			'date_gmt' => mysql2date( 'c', $post->post_date_gmt ),
			'modified' => mysql2date( 'c', $post->post_modified ),
			'modified_gmt' => mysql2date( 'c', $post->post_modified_gmt ),
			'br_version' => [
				'autosave' => false,
				'current' => true,
				'number' => 0,
			],
		);
		$current_id = $post->ID;
	}

	/*
	 * If a post has been saved since the last revision (no revisioned fields
	 * were changed), we may not have a "current" revision. Mark the latest
	 * revision as "current".
	 */
	if ( empty( $current_id ) ) {
		if ( $revision_data[ $revision->ID ]['autosave'] ) {
			$revision = end( $revision_data );
			while ( $revision['autosave'] ) {
				$revision = prev( $revision_data );
			}
			$current_id = $revision['id'];
		} else {
			$current_id = $revision->ID;
		}
		$revision_data[ $current_id ]['current'] = true;
	}

	return array_values( $revision_data );
}
