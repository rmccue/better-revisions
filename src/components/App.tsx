import { useState } from '@wordpress/element';
import { InterfaceSkeleton } from '@wordpress/interface';
import { Revision } from '../types/data';

import Compare from './Compare';
import Header from './Header';
import Sidebar from './Sidebar';

interface Props {
	initialData: typeof window.BRData,
}

export default function App( props: Props ) {
	const revisions = props.initialData.revisions;
	const latest = revisions[ revisions.length - 1 ];

	const [ selected, setSelected ] = useState<number>( latest.id );

	const selectedIdx = revisions.findIndex( p => p.id === selected );
	const fromIdx = selectedIdx > 0 ? selectedIdx - 1 : null;

	const onSelect = ( revision: Revision ) => {
		setSelected( revision.id );
	};

	return (
		<InterfaceSkeleton
			header={ (
				<Header
					backUrl={ props.initialData.back }
				/>
			) }
			content={ (
				<Compare
					from={ fromIdx !== null ? revisions[ fromIdx ] : null }
					to={ revisions[ selectedIdx ] }
				/>
			) }
			sidebar={ (
				<Sidebar
					revisions={ revisions }
					selected={ selected }
					onSelect={ onSelect }
				/>
			) }
		/>
	)
}
