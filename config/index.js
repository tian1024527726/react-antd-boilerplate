const path = require('path');
const proxyTable = require('./proxy.conf');
const swPrecacheConfig = require('./sw-precache');
const distPath = path.resolve('dist');

module.exports = {
	build: {
		index: path.resolve(distPath, 'index.html'),
		publicPath: './',
		includeModules: true,
		productionSourceMap: false,
		productionGzip: false,
		productionGzipExtensions: ['js', 'css']
	},
	dev: {
		port: 3001,
		noInfo: true,
		publicPath: '/',
		autoOpenBrowser: true,
		proxyTable: proxyTable,
		cssSourceMap: false
	},
	paths: {
		publicPath: '/',
		output: path.resolve(distPath),
		client: path.resolve('src'),
	},
	env: {
		development: require('./env/dev.env'),
		testing: require('./env/test.env'),
		production: require('./env/prod.env')
	},
	dlls: require('./dll.conf'),
	swPrecacheConfig
};
