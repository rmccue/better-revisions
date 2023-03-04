import { parse, Block } from '@wordpress/block-serialization-default-parser';
import { parse as topParse } from '@wordpress/blocks';
import diff, { Callbacks as DiffCallbacks } from 'diff-sequences';

import { Revision } from './types/data';

interface CombinedDiffedBlock {
	id: number,
	diff: 'removed' | 'inserted' | 'unchanged' | 'changed' | 'spacer',
	from: Block | null,
	to: Block | null,
}

interface DiffedBlock {
	id: number,
	block: Block,
	diff: 'removed' | 'inserted' | 'unchanged' | 'changed' | 'spacer',
}

export type DiffResult = {
	blocks: DiffedBlock[],
};

export type CompareResult = {
	from: DiffResult,
	to: DiffResult,
	combined: {
		blocks: CombinedDiffedBlock[],
	},
}

export function compareBlocks( from: readonly Block[], to: readonly Block[] ): CompareResult {
	const isCommon: DiffCallbacks['isCommon'] = ( fromIndex, toIndex ) => {
		const fromBlock = from[ fromIndex ];
		const toBlock = to[ toIndex ];
		if ( fromBlock.blockName !== toBlock.blockName ) {
			return false
		}

		return fromBlock.innerHTML === toBlock.innerHTML;
	};

	let commonIndex = 0;
	let fromIndex = 0;
	let toIndex = 0;
	const fromDiffed: DiffedBlock[] = [];
	const toDiffed: DiffedBlock[] = [];
	const combined: CombinedDiffedBlock[] = [];
	const foundSubsequence: DiffCallbacks['foundSubsequence'] = ( nCommon, aCommon, bCommon ) => {
		// Handle changes first.
		for (; fromIndex !== aCommon && toIndex !== bCommon; fromIndex += 1, toIndex += 1) {
			fromDiffed.push( {
				id: commonIndex,
				block: from[ fromIndex ],
				diff: 'removed',
			} );
			toDiffed.push( {
				id: commonIndex,
				block: to[ toIndex ],
				diff: 'inserted',
			} );
			combined.push( {
				id: commonIndex,
				diff: 'changed',
				from: from[ fromIndex ],
				to: to[ toIndex ],
			} );
			commonIndex++;
		}

		// Handle deletes, inserting spacers.
		for (; fromIndex !== aCommon; fromIndex += 1) {
			console.log( `- ${ from[ fromIndex ].blockName }` );
			fromDiffed.push( {
				id: commonIndex,
				block: from[ fromIndex ],
				diff: 'removed',
			} );
			toDiffed.push( {
				id: commonIndex,
				block: from[ fromIndex ],
				diff: 'spacer',
			} );
			combined.push( {
				id: commonIndex,
				diff: 'removed',
				from: from[ fromIndex ],
				to: null,
			} );
			commonIndex++;
		}

		// Handle inserts, inserting spacers.
		for (; toIndex !== bCommon; toIndex += 1) {
			// New block.
			fromDiffed.push( {
				id: commonIndex,
				block: to[ toIndex ],
				diff: 'spacer',
			})
			toDiffed.push( {
				id: commonIndex,
				block: to[ toIndex ],
				diff: 'inserted',
			} );
			combined.push( {
				id: commonIndex,
				diff: 'inserted',
				from: null,
				to: to[ toIndex ],
			} );
			commonIndex++;
		}

		// Handle remaining unchanged.
		for (; nCommon !== 0; nCommon -= 1, fromIndex += 1, toIndex += 1) {
			fromDiffed.push( {
				id: commonIndex,
				block: from[ fromIndex ],
				diff: 'unchanged',
			} );
			toDiffed.push( {
				id: commonIndex,
				block: to[ toIndex ],
				diff: 'unchanged',
			} );
			combined.push( {
				id: commonIndex,
				diff: 'unchanged',
				from: from[ fromIndex ],
				to: to[ toIndex ],
			} );
			commonIndex++;
		}
	};

	// Run the diff algorithm
	diff(
		from.length,
		to.length,
		isCommon,
		foundSubsequence
	);

	// After the last common subsequence, push remaining change lines.
	foundSubsequence( 0, from.length, to.length );

	return {
		from: {
			blocks: fromDiffed,
		},
		to: {
			blocks: toDiffed,
		},
		combined: {
			blocks: combined,
		}
	};
}

export function compare( from: Revision, to: Revision ) {
	const parsedFrom = parse( from.content.raw );
	const parsedTo = parse( to.content.raw );
	console.log( topParse( from.content.raw ) );
	const content = compareBlocks( parsedFrom, parsedTo );
	return content;
}

export function fakeCompareCreation( to: Revision ) {
	const parsedTo = parse( to.content.raw );
	const content = compareBlocks( [], parsedTo );
	return content;
}
