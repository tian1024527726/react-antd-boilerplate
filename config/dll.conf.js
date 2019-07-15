const pullAll = require('lodash/pullAll');//数组除值
const uniq = require('lodash/uniq');//数组去重

const reactDll = {
	version: '1.0.0',
	dllPlugin: {
		defaults: {
			exclude: [],
			include: [
				'eventsource-polyfill',
				'babel-polyfill',
				'isomorphic-fetch',
				'react',
				'react-dom',
				'react-redux',
				'react-router-dom',
				'classnames',
			],
			//针对开发本地调试用devPath，针对各种环境打包时用buildPath
			devPath: 'common/dlls/dev_dll',
			buildPath: process.env.NODE_ENV === 'development' ? 'common/dlls/dev_dll' : 'common/dlls/prd_dll',
		},

		entry(pgk) {
			let dependencyNames = [];
			if (pgk) dependencyNames = Object.keys(pkg.dependencies);
			const exclude = reactDll.dllPlugin.defaults.exclude;
			const include = reactDll.dllPlugin.defaults.include;
			const includeDependencies = uniq([...include, ...dependencyNames]);
			return {
				paReactDll: pullAll(includeDependencies, exclude),
			};
		},
	},
};
module.exports = reactDll;
