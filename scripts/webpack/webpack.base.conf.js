const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack'); // 提升构建速度
const WebpackBar = require('webpackbar');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const config = require('../../config');
const dllConfig = config.dlls.dllPlugin.defaults;

// 编译client代码的基础配置
const clientWebpackConfig = {
	// 调试工具,开发环境开启eval-source-map,生产构建时不开启
	devtool: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') ? false : '#eval-source-map',
	plugins: [
		// webpack编译过程中设置全局变量process.env
		new webpack.DefinePlugin({
			'process.env': config.env[process.env.NODE_ENV],
			'MOCK': !(process.env.MOCK === 'none'),
		}),
		// 优化require
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|zh/),
		// 用于提升构建速度
		new HappyPack({
			id: 'babel',
			threads: 1,
			loaders: [{
				loader: 'babel-loader',
				cacheDirectory: true,
			}],
		}),
	],
	resolve: {
		// 设置模块导入规则，import/require时会直接在这些目录找文件
		modules: [
			path.resolve('src/components'),
			path.resolve('common/components'),
			'node_modules',
		],
		// import导入时省略后缀
		extensions: ['.js', '.jsx', '.react.js', '.scss', '.less', '.css', '.json'],
		// import导入时别名
		alias: {
			'@': path.resolve(`src`),
			// target business
			'@site': path.resolve('buildConfig'),
			// common
			'@common': path.resolve('common'),
			'@history': path.resolve('common/utils/history'),
			'@inject': path.resolve('src/redux/inject.js'),
			'@dllAliasMap': path.resolve(`${dllConfig.buildPath}/dllAliasMap`),
		},
	},
	module: {
		exprContextCritical: false,
		// 设置所以编译文件的loader
		rules: [
			{
				test: /\.(js|jsx)$/,
				loader: 'eslint-loader',
				include: config.paths.client,
				exclude: /node_modules/,
				enforce: 'pre',
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.(js|jsx)$/,
				use: ['happypack/loader?id=babel'],
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'images/[name].[ext]',
							limit: 2048,
							fallback: 'file-loader'
						}
					}
				],
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: 'url-loader',
			},
			{
				test: /\.pdf$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'doc/[name].[ext]'
						}
					}
				]
			},
			{
				test: /\.(mp3)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'docs/[name].[ext]',
							fallback: 'file-loader'
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			}
		],
	},
	performance: {
		// 性能设置,文件打包过大时，不报错和警告，只做提示
		hints: false
	},
}

// progress
if (process.platform === 'win32') {
	clientWebpackConfig.plugins.push(new ProgressBarPlugin());
} else {
	clientWebpackConfig.plugins.push(new WebpackBar({
		color: 'green',
		reporters: ['fancy']
	}))
}

module.exports = clientWebpackConfig
