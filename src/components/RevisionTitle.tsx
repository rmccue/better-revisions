import { Revision } from '../types/data';

interface Props {
	revision: Revision,
}

export default function RevisionTitle( props: Props ) {
	const title = props.revision.br_version.autosave ?
		`Autosave ${ props.revision.br_version.number }` :
		`Revision ${ props.revision.br_version.number }`;

	return (
		<>{ title }</>
	)
}