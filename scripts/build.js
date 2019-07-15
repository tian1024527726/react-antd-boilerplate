// https://github.com/shelljs/shelljs
'use strict'

require('./tools/check-versions')()
require('shelljs/global')
require('babel-polyfill');
require('babel-core/register')();

const chalk = require('chalk')  //用于在终端中显示彩色文字
const webpack = require('webpack')
const { join } = require('path');
const rimraf = require('rimraf') //用于删除文件和文件夹
const config = require('../config')
const copyDlls = require('./tools/copy-dlls')
const webpackConfig = require('./webpack/webpack.build.conf')
const createPwaConfigFile = require('./tools/createPwaConfigFile');
const createRouter = require('./createRouter');

// route.config.js文件位置
const routePath = join(process.cwd(), 'buildConfig/route.config.js');
/**
 * 创建编译器函数
 * @param {*} _site
 */
const creactCompiler = async () => {
	rimraf.sync('dist');

	const compiler = webpack(webpackConfig);

	return await new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) throw err
			process.stdout.write(stats.toString({
				colors: true,
				modules: false,
				children: false,
				chunks: false,
				chunkModules: false,
				warnings: false
			}) + '\n\n')
			resolve();
		})
	})
}

/**
 * 打包编译函数
 */
async function Run() {
	// 生成route.js
	createRouter(routePath);
	await creactCompiler();
	copyDlls(config);
	createPwaConfigFile();
	console.log(chalk.cyan(`  Build complete.\n`))
	console.log(chalk.yellow(
		'  Tip: built files under [client] are\n' +
		'       meant to be served over an HTTP server.\n' +
		'       Opening index.html over file:// won\'t work.\n'
	))
}


Run();
