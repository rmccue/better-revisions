import { registerCoreBlocks } from '@wordpress/block-library';
import { SlotFillProvider } from '@wordpress/components';
import { render } from '@wordpress/element';

import App from './components/App';

// import '@wordpress/interface/build-style/style.css';
import './index.css';

// Empty the existing root for reuse.
const root = document.querySelector( '#wpbody-content .wrap' );
root?.childNodes.forEach( child => {
	root.removeChild( child )
} );

function setup() {
	registerCoreBlocks();
}

setup();
render(
	<SlotFillProvider>
		<App
			initialData={ window.BRData }
		/>
	</SlotFillProvider>,
	root
);



// c2();
