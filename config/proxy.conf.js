// 代理的配置参数
module.exports = {
	'/api': {
		target: 'http://localhost:8080', // 开发机
		changeOrigin: true,
	},
};
