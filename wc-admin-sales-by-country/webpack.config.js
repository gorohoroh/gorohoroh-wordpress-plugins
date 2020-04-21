const defaultConfig = require( "@wordpress/scripts/config/webpack.config" );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const exec = require('child_process').exec;

const requestToExternal = request => {
	const wcDepMap = {
		'@woocommerce/components': [ 'window', 'wc', 'components' ],
		'@woocommerce/csv-export': [ 'window', 'wc', 'csvExport' ],
		'@woocommerce/currency': [ 'window', 'wc', 'currency' ],
		'@woocommerce/date': [ 'window', 'wc', 'date' ],
		'@woocommerce/navigation': [ 'window', 'wc', 'navigation' ],
		'@woocommerce/number': [ 'window', 'wc', 'number' ],
		'@woocommerce/settings': [ 'window', 'wc', 'wcSettings' ],
	};

	if ( wcDepMap[ request ] ) {
		return wcDepMap[ request ];
	}
};

const requestToHandle = request => {
	const wcHandleMap = {
		'@woocommerce/components': 'wc-components',
		'@woocommerce/csv-export': 'wc-csv',
		'@woocommerce/currency': 'wc-currency',
		'@woocommerce/date': 'wc-date',
		'@woocommerce/navigation': 'wc-navigation',
		'@woocommerce/number': 'wc-number',
		'@woocommerce/settings': 'wc-settings',
	};

	if ( wcHandleMap[ request ] ) {
		return wcHandleMap[ request ];
	}
};

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins.filter(
			plugin => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin',
		),
		new DependencyExtractionWebpackPlugin( {
			injectPolyfill: true,
			requestToExternal,
			requestToHandle,
		} ),
		new MiniCssExtractPlugin( {
			filename: 'style.css',
		} ),
		{
			apply: (compiler) => {
				compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
					exec('wp i18n make-pot src languages/wc-admin-sales-by-country.pot --domain=wc-admin-sales-by-country', (err, stdout, stderr) => {
						if (stdout) process.stdout.write(stdout);
						if (stderr) process.stderr.write(stderr);
					});
				});
			}
		}
	],
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'sass-loader',
				],
			},
		],
	},
};
