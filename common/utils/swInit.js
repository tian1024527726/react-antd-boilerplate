// 初始化service-worker
const { pwa } = require('../../config');
const env = process.env.NODE_ENV;

// 实时获取pwa配置
const getPWAConfigRealtime = async () => {
	const res = await fetch(`pwaConfig.json?d=${Date.now()}`);
	const text = await res.text();
	const jsonText = JSON.parse(text);
	return jsonText.pwa;
};

// 注册service-worker
const registerSW = () => {
	const swFilePath = `/service-worker.js?v=${Date.now()}`;
	navigator.serviceWorker.register(swFilePath);
};

// 注销所有service-worker
const unregisterSW = () => {
	// 注销所有service-worker
	navigator.serviceWorker.getRegistrations()
		.then(registrations => {
			for (let registration of registrations) {
				registration.unregister();
			}
		});
};

/**
 * 初始化service-worker
 * 根据条件选择是否注册或注销service-worker
 * @param env 环境
 * @param needPWA 是否需要pwa
 */
const initSW = async (env, needPWA) => {
	if (env === 'development' || !needPWA) return;
	const realTimePWAConfig = await getPWAConfigRealtime();
	if (navigator.serviceWorker && realTimePWAConfig) {
		registerSW();
	} else {
		unregisterSW();
	}
};

window.addEventListener('load', () => {
	initSW(env, pwa);
});
