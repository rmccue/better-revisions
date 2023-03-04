import classnames from 'classnames';

import { DiffResult } from '../../compare';

type DiffResultProps = {
	result: DiffResult,
}

export function DiffResultComponent( props: DiffResultProps ) {
	return (
		<div>
			{ props.result.blocks.map( ( block, idx ) => (
				<div
					key={ idx }
					className={ classnames( {
						'DiffResult': true,
						'DiffResult--removed': block.diff === 'removed',
						'DiffResult--inserted': block.diff === 'inserted',
						'DiffResult--changed': block.diff === 'changed',
						'DiffResult--unchanged': block.diff === 'unchanged',
						'DiffResult--spacer': block.diff === 'spacer',
					} ) }
					dangerouslySetInnerHTML={ {
						__html: block.block.innerHTML,
					} } />
			) ) }
		</div>
	);
}
