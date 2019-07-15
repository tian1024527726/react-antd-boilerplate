// 加载mock文件夹下所有的js文件
if (MOCK) { // eslint-disable-line
	const mockContext = require.context('../mock', true, /\.js$/);
	mockContext.keys().forEach(item => {
		mockContext(item);
	})
}
