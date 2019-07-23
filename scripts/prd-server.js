const config = require('../config')
const express = require('express')
const portfinder = require('portfinder')
const chalk = require('chalk')
const app = express();
const opn = require('opn') // open模块,打开文件和url等
const ip = require('ip') // 获取本地ip模块

const webroot = config.paths.output;

app.use(express.static(webroot))
const port = process.env.PORT || 3002

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
			// 开启服务
			const localUri = `http://localhost:${newPort}`;
			const networkUri = `http://${ip.address()}:${newPort}`;

			console.log(`
App running at:
  - Local:   ${chalk.cyan(localUri)} (copied to clipboard)
  - Network: ${chalk.cyan(networkUri)}
	`);

			opn(networkUri)
			var server = app.listen(newPort)
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
