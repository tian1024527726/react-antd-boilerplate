const pagesPath = `../../src/pages/`;
const ReservedFileName = ['user'];
const createFileNameQuestion = '请输入需要新建的模块名称\n';
// 需要创建的几种文件
const dealFileList = ['action.js', 'constant.js', 'index.js', 'reducer.js', 'style.module.scss'];


module.exports = {
  pagesPath,
  dealFileList,
  ReservedFileName,
  createFileNameQuestion
};
