/* eslint-disable */
const fs = require('fs');
const path = require('path');
const ReadFile = require('./ReadFile');
const Replace = require('./Replace');
const { dealFileList, pagesPath } = require('../config');

const dirPathRes = (...arg) => path.join(__dirname, '..', pagesPath, ...arg);
const filePathRes = (dirPath, filePath) => path.resolve(__dirname, `../${pagesPath}`, `${dirPath}/${filePath}`);

class Create {
  constructor(fileName, tmplType) {
    this.filePath = fileName;
    this.fileFullName = fileName.replace(/\/([a-zA-z])/g, (...arg) => arg[1].toUpperCase());
    this.fileName = fileName.split('/').filter((item, index) => { if (fileName.split('/').length - 1 === index) { return item; } })[0];
    if (tmplType) {
      this.tmplType = tmplType;
    }
  }
  createFiles() {
    const pageFileDataList = this.createPageDataByTemp();

    const pageFileDatas = pageFileDataList.map(item => ({
      path: filePathRes(this.filePath, item.fileName),
      data: item.fileData,
    }));
    this.createPageDir();
    this.createPageFiles(pageFileDatas);
  }
  // 根据模版数据创建用户需要的页面数据
  createPageDataByTemp() {
    const pageFileDataList = dealFileList.map(item => {
      const templateFileData = new ReadFile().readTemplate(item, this.tmplType);

      const newPageActionsFileData = new Replace().replaceTemplateData(templateFileData, this.fileName, this.filePath, this.fileFullName);
      return {
        fileName: item,
        fileData: newPageActionsFileData,
      };
    });
    return pageFileDataList;
  }
  createPageDir() {
    const filePathNodes = this.filePath.split('/');
    filePathNodes.forEach((pathNode, index) => {
      const pageDirPath = dirPathRes(...filePathNodes.slice(0, index + 1));
      const isExist = fs.existsSync(pageDirPath);
      if (!isExist) {
        fs.mkdirSync(pageDirPath);
      }
    })
  }
  // 创建一个文件
  createPageFile(path, data) {
    fs.writeFileSync(path, data);
  }
	/**
	 * 创建一组文件
	 * @param pageFilesData {
	 *  path: 文件路径
	 *  data: 文件数据
	 * }
	 */
  createPageFiles(pageFilesData) {
    pageFilesData.forEach(item => fs.writeFileSync(item.path, item.data))
  }
}

module.exports = Create;
