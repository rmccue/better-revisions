export interface Revision {
	id: number,
	title: {
		raw: string,
		rendered: string,
	},
	content: {
		raw: string,
		rendered: string,
	},
	excerpt: {
		raw: string,
		rendered: string,
	},
	author: number,
	date: string,
	date_gmt: string,
	modified: string,
	modified_gmt: string,
	br_version: {
		autosave: boolean,
		number: number,
	},
}
