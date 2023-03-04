import classnames from 'classnames';
import React from 'react';

import { CompareResult } from '../../compare';

import './Content.css';

interface Props {
	compared: CompareResult,
}

export default function Content( props: Props ) {
	return (
		<>
			{ props.compared.combined.blocks.map( block => (
				<React.Fragment key={ block.id }>
					<div
						className={ classnames( {
							'Compare-Content__block': true,
							'Compare-Content__block--from': true,
							'Compare-Content__block--removed': block.diff === 'removed',
							'Compare-Content__block--inserted': block.diff === 'inserted',
							'Compare-Content__block--changed': block.diff === 'changed',
							'Compare-Content__block--unchanged': block.diff === 'unchanged',
							'Compare-Content__block--spacer': block.diff === 'spacer',
						} ) }
					>
						<div
							className="Compare-Content__inner"
							dangerouslySetInnerHTML={ {
								__html: block.from?.innerHTML || '',
							} }
						/>
					</div>
					<div
						className={ classnames( {
							'Compare-Content__block': true,
							'Compare-Content__block--to': true,
							'Compare-Content__block--removed': block.diff === 'removed',
							'Compare-Content__block--inserted': block.diff === 'inserted',
							'Compare-Content__block--changed': block.diff === 'changed',
							'Compare-Content__block--unchanged': block.diff === 'unchanged',
							'Compare-Content__block--spacer': block.diff === 'spacer',
						} ) }
					>
						<div
							className="Compare-Content__inner"
							dangerouslySetInnerHTML={ {
								__html: block.to?.innerHTML || '',
							} }
						/>
					</div>
				</React.Fragment>
			)) }
		</>
	)
}
