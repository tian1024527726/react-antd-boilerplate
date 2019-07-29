module.exports = {
	parser: 'babel-eslint',
	extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
	env: {
		browser: true,
		node: true,
		es6: true,
		mocha: true,
		jest: true,
		jasmine: true,
	},
	globals: {
		APP_TYPE: true,
		page: true,
	},
	rules: {
		'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
		'react/jsx-wrap-multilines': 0,
		'react/prop-types': 0,
		'react/forbid-prop-types': 0,
		'react/jsx-one-expression-per-line': 0,
		'react/jsx-indent': [
			0,
			'tab'
		],
		'react/jsx-indent-props': [
			0,
			'tab'
		],
		'import/no-unresolved': 0,
		'import/no-extraneous-dependencies': [
			2,
			{
				optionalDependencies: true,
				devDependencies: ['**/tests/**.js', '/mock/**/**.js', '**/**.test.js'],
			},
		],
		'jsx-a11y/no-noninteractive-element-interactions': 0,
		'jsx-a11y/label-has-associated-control': 0,
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/no-static-element-interactions': 0,
		'jsx-a11y/heading-has-content': 0,
		'jsx-a11y/anchor-is-valid': 0,
		'jsx-a11y/anchor-has-content': 0,
		'linebreak-style': 0,
		'no-underscore-dangle': 0,
		'no-console': 0,
		'import/extensions': 0,
		'import/prefer-default-export': 0,
		'consistent-return': 0,
		'global-require': 0
	},
	settings: {
		polyfills: ['fetch', 'Promise', 'url', 'object-assign'],
	},
};
