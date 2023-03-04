import { Revision } from '../../types/data';

interface Props {
	from: Revision | null,
	to: Revision,
}

export default function Title( props: Props ) {
	return (
		<>
			<div className="Compare-Title">
				<h1>{ props.from?.title.raw }</h1>
			</div>
			<div className="Compare-Title">
				<h1>{ props.to.title.raw }</h1>
			</div>
		</>
	);
}
