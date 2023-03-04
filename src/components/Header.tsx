// import { Button, ToolbarItem } from '@wordpress/components';
import { Button, NavigableMenu, Toolbar, ToolbarButton } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';
import { ComplementaryArea, PinnedItems } from '@wordpress/interface';

import './Header.css';

interface Props {
	backUrl: string,
}

export default function Header( props: Props ) {
	return (
		<div className="Header">
			<div className="Header__toolbar-wrap">
				<Toolbar
					className="Header__toolbar"
					label="Header"
				>
					<ToolbarButton
						href={ props.backUrl }
						icon={ arrowLeft }
					>
						Back to post
					</ToolbarButton>
				</Toolbar>
			</div>
			<div className="Header__settings">
				{/* <ComplementaryAreaToggle
					// @ts-ignore
					as={ Button }
					icon={ backup }
					identifier="revisions/timeline"
				/> */}
				<PinnedItems.Slot
					scope="better-revisions"
				/>
			</div>
		</div>
	)
}
