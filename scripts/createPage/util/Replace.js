// 替换工具类
class Replace {

  replaceTemplateData(tempData, str1, str2, str3) {
    return tempData
      .replace(/\$template\$/g, str1)
      .replace(/\$TEMPLATE\$/g, str1.toUpperCase())
      .replace(/\$Template\$/g, str1.charAt(0).toUpperCase() + str1.substr(1))
      .replace(/\$templatePathName\$/g, str2)
      .replace(/\$templateFullName\$/g, str3)
  }
}

module.exports = Replace;
