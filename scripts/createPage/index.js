const chalk = require('chalk');
const Check = require('./util/Check');
const Interactive = require('./util/Interactive');
const Create = require('./util/Create');
const { createFileNameQuestion } = require('./config');

// fileName == pageName
const start = async () => {
	const interactive = new Interactive();
	const check = new Check();
	const fileName = await interactive.getUserInput(createFileNameQuestion);

	console.log('开始检查文件名...\n');
	const fileNameIsValid = check.nameIsValid(fileName);

	if (!fileNameIsValid) {
		start();
		return false;
	}

	const templateType = await interactive.getTemplate();

	const create = new Create(fileName, templateType);

	console.log(`${chalk.cyan('开始创建文件...\n')}`);
	create.createFiles();
	console.log(`${chalk.green('模板创建成功！！！\n')}`);
};

start();
