const path = require('path');
const glob = require('glob'); //match文件路径模块
const webpack = require('webpack');
const chalk = require('chalk');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html模块插件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'); //html模板中嵌入资源的插件，配合html-webpack-plugin插件一起使用
const baseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'); //友好的错误提示，会显示具体的错误位置
const StyleLintPlugin = require('stylelint-webpack-plugin');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const MergeLessPlugin = require('antd-merge-less');
const config = require('../../config');
const utils = require('../tools/utils');
const {
	postCssLoader,
	styleLoader,
	sassLoader,
	lessLoader,
	cssLoader,
} = utils.loadersConfig;
const dllConfig = config.dlls.dllPlugin.defaults;

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

const outFile = path.join(__dirname, '../../.temp/react-antd-template.less');
const stylesDir = path.join(__dirname, '../../src/');
const projectName = 'react-antd-template';
const options = {
	antDir: path.join(__dirname, '../../node_modules/antd'),
	stylesDir,
	varFile: path.join(__dirname, '../../node_modules/antd/lib/style/themes/default.less'),
	mainLessFile: outFile, //
	indexFileName: 'index.html',
	generateOne: true,
	lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
}

const plugin = [
	new MergeLessPlugin({
		stylesDir,
		outFile,
		projectName
	}),
	new AntDesignThemePlugin(options),
	new StyleLintPlugin({
		files: ['src/**/*.s?(a|c)ss', 'src/**/*.less'],
		failOnError: false,
		quiet: true,
		syntax: 'scss',
		cache: true,
	}),
	//热模块替换插件
	new webpack.HotModuleReplacementPlugin(),
	//webpack的id本来是1,2,3...数字，将其替换成模块名路径，方便开发时调试
	new webpack.NamedModulesPlugin(),
	new HtmlWebpackPlugin({
		filename: 'index.html',
		inject: true,
		template: 'src/pages/document.ejs',
		NODE_ENV: config.env[process.env.NODE_ENV].NODE_ENV,
		favicon: 'favicon.ico',
	}),
	new FriendlyErrorsPlugin()
];
if (dllConfig) {
	glob.sync(`${dllConfig.devPath}/paReactDll*.dll.js`).forEach((dllPath) => {
		plugin.push(
			new AddAssetHtmlPlugin({
				filepath: dllPath,
				includeSourcemap: false,
				typeOfAsset: 'js'
			})
		);
	});
}

function dependencyHandlers() {

	const dllPath = path.resolve(dllConfig.devPath);

	/**
	 *
	 *
	 */
	if (!dllConfig.dlls) {
		const plugins = [];
		const manifests = glob.sync(path.resolve(`${dllPath}/pa*Dll.json`))

		if (!manifests.length) {
			console.log(`${chalk.red('The DLL manifest is missing.')} Please run ${chalk.green('yarn dll')}`);
			process.exit(0);
		}
		manifests.forEach(item => {
			plugins.push(new webpack.DllReferencePlugin({
				context: process.cwd(),
				manifest: item,
			}))
		})
		//dll插件，配合DllPlugin使用
		return plugins;
	}
}

const clientWebpackConfig = merge(baseWebpackConfig, {
	mode: 'development',
	entry: {
		index: ['./scripts/tools/dev-client', './src/index.js']
	},
	output: {
		publicPath: config.dev.publicPath,
		pathinfo: true,
		filename: '[name].js',
		chunkFilename: '[name].async.js',
		devtoolModuleFilenameTemplate: info => {
			// chrome开发工具中source中文件名显示具体文件路径
			return path.relative(process.cwd(), info.absoluteResourcePath).replace(/\\/g, '/');
		}
	},
	optimization: {
		namedModules: true,
		namedChunks: true,
		runtimeChunk: false,
		noEmitOnErrors: true,
		splitChunks: {
			cacheGroups: {
				commons: {  // 抽离自己写的公共代码
					chunks: "async",  // async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk。
					name: "vendors", // 打包后的文件名，任意命名
					minChunks: 2, // 最小引用2次
				},
			},
		}
	},
	module: {
		rules: [
			{
				test: cssRegex,
				exclude: cssModuleRegex,
				use: [styleLoader, cssLoader()]
			},
			{
				test: cssModuleRegex,
				use: [styleLoader, cssLoader(true)]
			},
			{
				test: sassRegex,
				exclude: [/node_module/, sassModuleRegex],
				use: [styleLoader, cssLoader(), postCssLoader, sassLoader]
			},
			{
				test: sassModuleRegex,
				exclude: /node_module/,
				use: [styleLoader, cssLoader(true), postCssLoader, sassLoader]
			},
			{
				test: lessRegex,
				exclude: [lessModuleRegex], // antd的less样式编译需要，不排除node_module
				use: [styleLoader, cssLoader(), postCssLoader, lessLoader]
			},
			{
				test: lessModuleRegex,
				exclude: /node_module/,
				use: [styleLoader, cssLoader(true), postCssLoader, lessLoader]
			}
		]
	},
	plugins: dependencyHandlers().concat(plugin)
})

module.exports = clientWebpackConfig
