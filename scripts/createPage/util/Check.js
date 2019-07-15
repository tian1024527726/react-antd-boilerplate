const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { pagesPath, ReservedFileName } = require('../config');

class Check {
	nameIsValid(fileName) {
		const templateNameIsPermit = this._nameIsPermit(fileName);
		const fileIsExist = this._nameIsExist(fileName);
		const fileIsReserved = this._nameIsReserved(fileName);

		if (!templateNameIsPermit) {
			console.log(`${chalk.yellow('模块名称只能是字母，建议是驼峰命名法')}`);
			console.log(`${chalk.yellow('请重新输入')}`);
			return false;
		}
		if (fileIsExist) {
			console.log(`${chalk.yellow('该名称文件已经存在，请选择其他名字\n')}`);
			console.log(`${chalk.yellow('请重新输入\n')}`);
			return false;
		}
		if (fileIsReserved) {
			const reservedFileNames = ReservedFileName.join('、');
			console.log(`${chalk.yellow('\n该文件名是保留字段，请选择其他名字')}`);
			console.log(`${chalk.yellow(`保留文件名有${reservedFileNames}`)}`);
			console.log(`${chalk.yellow('请重新输入\n')}`);
			return false;
		}
		return true;
	}

	// 检查文件名是否合规
	_nameIsPermit(fileName) {
		let reg = /^[a-z\/]{1,}$/i;
		return reg.test(fileName) && fileName;
	}
	// 检查文件是否已经存在
	_nameIsExist(fileName) {
		const filesList = [];
		const file = fileName.split('/')[fileName.split('/').length - 1]

		function readFileList(dir) {
			const files = fs.readdirSync(dir);
			files.forEach((item, index) => {
				var fullPath = path.join(dir, item);
				const stat = fs.statSync(fullPath);
				if (stat.isDirectory()) {
					readFileList(path.join(dir, item), filesList);  //递归读取文件
					filesList.push(item);
				}
			});
		}
		readFileList(path.resolve(__dirname, `../${pagesPath}`));

		return filesList.some(item => item === file);
	}
	// 检查文件名是否是保留字段
	_nameIsReserved(fileName) {
		return ReservedFileName.indexOf(fileName) > -1;
	}
}

module.exports = Check;
