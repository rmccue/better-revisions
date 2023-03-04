import memoize from 'lodash/memoize';

import Content from './Content';
import Header from './Header';
import { compare as unmemoizedCompare, fakeCompareCreation } from '../../compare';
import { Revision } from '../../types/data';

import './index.css';
import Title from './Title';

const compare = memoize<typeof unmemoizedCompare>(
	( from, to ) => unmemoizedCompare( from, to ),
	( from, to ) => `${ from.id }:${ to.id }`,
);

interface Props {
	from: Revision | null,
	to: Revision,
}

export default function Compare( props: Props ) {
	const compared = props.from ? compare( props.from, props.to ) : fakeCompareCreation( props.to );

	return (
		<div className="Compare">
			{ props.from ? (
				<Header
					canRestore
					className="CompareHeader--from"
					revision={ props.from }
				/>
			) : (
				<div>
					<p>First revision.</p>
				</div>
			) }
			<Header
				className="CompareHeader--to"
				revision={ props.to }
			/>

			<Title
				from={ props.from }
				to={ props.to }
			/>

			<Content
				compared={ compared }
			/>
		</div>
	)
}
