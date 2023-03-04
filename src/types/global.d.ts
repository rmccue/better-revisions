export {};

declare global {
  	interface Window {
		BRData: {
			core?: {
				from?: number,
				postId: number,
				revisionIds: number[],
			},
			back: string,
			revisions: import( './data' ).Revision[],
			site: {
				api: string,
				nonce: string,
			},
		}
	}
}
