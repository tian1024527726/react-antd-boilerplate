const fs = require('fs');
const path = require('path');

const pathRes = (fileName, tempType = 'template') => {
	return path.resolve(__dirname, `../templates/${tempType}`, fileName);
};

const types = {
	'action.js': pathRes('action.js'),
	'constant.js': pathRes('constant.js'),
	'index.js': pathRes('index.js'),
	'reducer.js': pathRes('reducer.js'),
	'style.module.scss': pathRes('style.module.scss'),
	'mock.js': pathRes('mock.js'),
};

class ReadFile {
	readTemplate(type = 'action.js', tempType) {
		let templateFilePath;
		if (tempType) {
			templateFilePath = pathRes(type, tempType)
		} else {
			templateFilePath = types[type];
		}

		if (!templateFilePath) {
			return 'no such template';
		}
		const fileData = fs.readFileSync(templateFilePath, "utf-8");
		return fileData;
	}
	readFile(path) {
		return fs.readFileSync(path, "utf-8");
	}
	readDir(path) {
		return fs.readdirSync(path, 'utf8');
	}
}

module.exports = ReadFile;
