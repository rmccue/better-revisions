import { dateI18n, __experimentalGetSettings as getDateSettings } from '@wordpress/date';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { backup } from '@wordpress/icons';
import { ComplementaryArea, PinnedItems, store as interfaceStore } from '@wordpress/interface';
import classnames from 'classnames';
import sortBy from 'lodash/sortBy';

import { Revision } from '../types/data';
import RevisionTitle from './RevisionTitle';

import './Sidebar.css';

console.log( interfaceStore )

function ComplementaryAreaTab( { identifier, label, isActive }: { identifier: string, label: string, isActive: boolean } ) {
	const { enableComplementaryArea } = useDispatch( interfaceStore );
	return (
		<Button
			onClick={ () => (
				enableComplementaryArea( 'revisions', identifier )
			) }
			className={ classnames( 'edit-widgets-sidebar__panel-tab', {
				'is-active': isActive,
			} ) }
			aria-label={ isActive ? `${ label } (selected)` : label }
			data-label={ label }
		>
			{ label }
		</Button>
	);
}

type RevisionListItemProps = {
	current?: boolean,
	revision: Revision,
	selected?: boolean,
	onSelect(): void,
}
function RevisionListItem( props: RevisionListItemProps ) {
	return (
		<li
			className={ classnames( [
				'RevisionList__item',
				{
					'RevisionList__item--current': props.current,
					'RevisionList__item--selected': props.selected,
				}
			] ) }
			onClick={ props.onSelect }
		>
			<svg
				className="RevisionList__item-indicator-container"
				viewBox="0 0 22 22"
			>
				<ellipse
					className="RevisionList__item-indicator"
					cx="11"
					cy="11"
					rx="9"
					ry="9"
					strokeWidth="3"
				/>
			</svg>
			<div className="RevisionList__item-main">
				<p className="RevisionList__item-title">
					{ props.current && (
						<>Current </>
					) }
					<RevisionTitle
						revision={ props.revision }
					/>
				</p>
				<p className="RevisionList__item-byline">
					{ dateI18n( getDateSettings().formats.datetimeAbbreviated, props.revision.date_gmt, undefined ) }
				</p>
			</div>
		</li>
	)
}

type RevisionListProps = {
	revisions: Revision[],
	selected: number,
	onSelect( revision: Revision ): void,
}

function RevisionList( props: RevisionListProps ) {
	return (
		<ol className="RevisionList">
			{ props.revisions.map( revision => (
				<RevisionListItem
					key={ revision.id }
					revision={ revision }
					selected={ revision.id === props.selected }
					onSelect={ () => props.onSelect( revision ) }
				/>
			) ) }
		</ol>
	)
}

interface Props {
	revisions: Revision[],
	selected: number,
	onSelect( revision: Revision ): void,
}

export default function Sidebar( props: Props ) {
	const {
		currentArea,
		isGeneralSidebarOpen,
	} = useSelect( ( select ) => {
		const { getActiveComplementaryArea } = select( interfaceStore );
		const activeArea = getActiveComplementaryArea( 'better-revisions' );

		return {
			currentArea: activeArea,
			isGeneralSidebarOpen: !! activeArea,
		};
	}, [] );
	const { enableComplementaryArea } = useDispatch( interfaceStore );

	useEffect( () => {
		console.log( currentArea, isGeneralSidebarOpen );
	}, [ currentArea, isGeneralSidebarOpen ] );

	const sorted = sortBy( props.revisions, 'id' ).reverse();
	return (
		<>
			{ isGeneralSidebarOpen && (
				<div className="Sidebar">
					<ComplementaryArea.Slot
						scope="better-revisions"
					/>
				</div>
			) }

			{ /* Default sidebar */}
			<ComplementaryArea
				closeLabel="Close timeline"
				header={ (
					<ul>
						<li>
							<ComplementaryAreaTab
								identifier="timeline"
								label="Timeline"
								isActive={ true }
								// isActive={ currentArea === WIDGET_AREAS_IDENTIFIER }
							/>
						</li>
					</ul>
				) }
				identifier="timeline"
				icon={ backup }
				scope="better-revisions"
				title="Timeline"
				isActiveByDefault={ true }
			>
				<RevisionList
					revisions={ sorted }
					selected={ props.selected }
					onSelect={ props.onSelect }
				/>
			</ComplementaryArea>
		</>
	);
}
