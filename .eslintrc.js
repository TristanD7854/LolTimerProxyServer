module.exports = {
	'env': {
		'node': true,
		'browser': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended', 
		'prettier'
	],
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'linebreak-style': [
			'error',
			'linux'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
