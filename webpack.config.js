const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: [
			// {
			// 	test: /\.tsx?$/,
			// 	loader: 'ts-loader',
			// 	options: {
			// 		context: __dirname,
			// 		configFile: __dirname + '/tsconfig.json',
			// 	},
			// },
			...defaultConfig.module.rules,
		],
	},
};

// Force all CSS into one file.
delete module.exports.optimization.splitChunks.cacheGroups.style.test;
module.exports.optimization.splitChunks.cacheGroups.style.name = 'style';
