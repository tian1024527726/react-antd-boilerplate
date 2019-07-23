require('./tools/check-versions')();
require('babel-polyfill');
require('babel-core/register')();

// 导入模块
const express = require('express');
const ip = require('ip');
const chalk = require('chalk');
const { join, resolve } = require('path');
const webpack = require('webpack');
const opn = require('opn');
const proxyMiddleware = require('http-proxy-middleware'); //代理模块
const chokidar = require('chokidar');
const portfinder = require('portfinder')
const chafMiddleware = require('connect-history-api-fallback')(); //api重定向模块，在使用history路由使用时，一直定向到index.html
const webpackConfig = require('./webpack/webpack.dev.conf');
const config = require('../config');
const createRouter = require('./createRouter');

// route.config.js文件位置
const routePath = join(process.cwd(), 'buildConfig/route.config.js');
// 设置端口
const port = process.env.PORT || config.dev.port;
const proxyTable = config.dev.proxyTable;

const app = express();


// 根据route.config.js,生成路由文件
createRouter(routePath);

const compiler = webpack(webpackConfig);
const devMiddleware = require('webpack-dev-middleware')(compiler, {
	noInfo: config.dev.noInfo,
	watchOptions: {
		aggregateTimeout: 300,
		poll: false,
	},
	publicPath: config.paths.public,
	stats: {
		colors: true,
		chunks: false,
	},
});

// 热编译中间件中只传入client的webpack编译器对象，server不需要
const hotMiddleware = require('webpack-hot-middleware')(compiler);

// 代理api设置
Object.keys(proxyTable).forEach(context => {
	let options = proxyTable[context];
	if (typeof options === 'string') {
		options = { target: options };
	}
	app.use(proxyMiddleware(options.filter || context, options));
});

// 监听route.config.js
const watcher = chokidar.watch(routePath, {
	ignoreInitial: true,
	cwd: process.cwd(),
})
watcher
	.on('change', path => {
		Object.keys(require.cache).forEach(file => {
			if (file.indexOf(join(process.cwd(), path)) === 0) {
				delete require.cache[file];
			}
		});

		try {
			createRouter(join(process.cwd(), path));
		} catch (e) {
			console.log('出错了！！')
		}
	})

//设置开发环境
app.env = 'development';
app.use(chafMiddleware);
app.use(devMiddleware);
app.use(hotMiddleware);



// var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// app.use(express.static('./src'))

// 开启服务
const localUri = `http://localhost:${port}`;
const networkUri = `http://${ip.address()}:${port}`;

devMiddleware.waitUntilValid(() => {
	console.log(`
App running at:
  - Local:   ${chalk.cyan(localUri)} (copied to clipboard)
  - Network: ${chalk.cyan(networkUri)}
	`);
	// 自动打开浏览器
	if (config.dev.autoOpenBrowser) {
		opn(localUri);
	}
});

let _resolve
const readyPromise = new Promise(resolve => {
	_resolve = resolve
})


module.exports = new Promise((resolve, reject) => {
	portfinder.basePort = port
	portfinder.getPortPromise()
		.then(newPort => {
			if (port !== newPort) {
				console.log(`${port}端口被占用，开启新端口${newPort}`)
			}
			var server = app.listen(newPort)
			// for 小程序的文件保存机制
			// require('webpack-dev-middleware-hard-disk')(compiler, {
			//   publicPath: webpackConfig.output.publicPath,
			//   quiet: true
			// })
			resolve({
				ready: readyPromise,
				close: () => {
					server.close()
				}
			})
		}).catch(error => {
			console.log('没有找到空闲端口，请打开任务管理器杀死进程端口再试', error)
		})
})
