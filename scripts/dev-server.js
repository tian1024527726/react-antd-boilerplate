require('./tools/check-versions')();
require('babel-polyfill');
require('babel-core/register')();

// 导入模块
const Koa = require('koa');
const ip = require('ip');
const c2k = require('koa2-connect'); //使express的插件，能再koa中使用
const chalk = require('chalk');
const { join, resolve } = require('path');
const webpack = require('webpack');
const koaStatic = require('koa-static');
const koaMount = require('koa-mount');
const opn = require('opn');
const KWM = require('koa-webpack-middleware'); //开启本地服务，并用webpack实时编译，实现热加载的核心模块
const proxyMiddleware = require('http-proxy-middleware'); //代理模块
const chokidar = require('chokidar');
const chafMiddleware = require('connect-history-api-fallback'); //api重定向模块，在使用history路由使用时，一直定向到index.html
const webpackConfig = require('./webpack/webpack.dev.conf');
const config = require('../config');
const createRouter = require('./createRouter');

const staticroot = resolve('src');
// route.config.js文件位置
const routePath = join(process.cwd(), 'buildConfig/route.config.js');
// 设置端口
const port = process.env.PORT || config.dev.port;
const proxyTable = config.dev.proxyTable;

const app = new Koa();


// 根据route.config.js,生成路由文件
createRouter(routePath);

const compiler = webpack(webpackConfig);
const devMiddleware = KWM.devMiddleware(compiler, {
	noInfo: config.dev.noInfo,
	watchOptions: {
		aggregateTimeout: 300,
		poll: false,
	},
	publicPath: config.paths.public,
	stats: {
		colors: true,
	},
});

// 热编译中间件中只传入client的webpack编译器对象，server不需要
const hotMiddleware = KWM.hotMiddleware(compiler);

// 代理api设置
Object.keys(proxyTable).forEach(context => {
	let options = proxyTable[context];
	if (typeof options === 'string') {
		options = { target: options };
	}
	app.use(c2k(proxyMiddleware(options.filter || context, options)));
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
app.use(c2k(chafMiddleware()));
app.use(devMiddleware);
app.use(hotMiddleware);



app.use(koaMount('/', koaStatic(staticroot)));

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

module.exports = app.listen(port, err => {
	if (err) {
		console.log(chalk.red(err));
		return;
	}
});
