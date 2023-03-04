import { dateI18n, __experimentalGetSettings as getDateSettings } from '@wordpress/date';
import classnames, { Argument as ClassName } from 'classnames';

import RevisionTitle from '../RevisionTitle';
import { Revision } from '../../types/data';

import './Header.css';
import { Button } from '@wordpress/components';

interface Props {
	canRestore?: boolean,
	className?: ClassName,
	revision: Revision,
}

export default function CompareHeader( props: Props ) {
	return (
		<header
			className={ classnames( [
				'Compare-Header',
				props.className,
			] ) }
		>
			<div>
				<h2 className="Compare-Header__title">
					<RevisionTitle
						revision={ props.revision }
					/>
				</h2>
				<p className="Compare-Header__byline">
					{ dateI18n( getDateSettings().formats.datetimeAbbreviated, props.revision.date_gmt, undefined ) }
				</p>
			</div>
			<div>
				{ props.canRestore && (
					<Button
						variant="primary"
					>
						Restore revision
					</Button>
				) }
			</div>
		</header>
	);
}
