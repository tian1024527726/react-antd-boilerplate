import { message } from 'antd'
import defaultSettings from '@/defaultSettings';

const GET_SETTING = 'setting/GET_SETTING';
const CHANGE_SETTING = 'setting/CHANGE_SETTING';

const initialState = defaultSettings;
let lessNodesAppended;

const updateTheme = primaryColor => {
	// Determine if the component is remounted
	if (!primaryColor) {
		return;
	}
	const hideMessage = message.loading('正在编译主题！', 0);
	function buildIt() {
		if (!window.less) {
			return;
		}
		setTimeout(() => {
			window.less
				.modifyVars({
					'@primary-color': primaryColor,
				})
				.then(() => {
					hideMessage();
				})
				.catch(() => {
					message.error('Failed to update theme');
					hideMessage();
				});
		}, 200);
	}
	if (!lessNodesAppended) {
		// insert less.js and color.less
		const lessStyleNode = document.createElement('link');
		const lessConfigNode = document.createElement('script');
		const lessScriptNode = document.createElement('script');
		lessStyleNode.setAttribute('rel', 'stylesheet/less');
		lessStyleNode.setAttribute('href', '/color.less');
		lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
		lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
		lessScriptNode.async = true;
		lessScriptNode.onload = () => {
			buildIt();
			lessScriptNode.onload = null;
		};
		document.body.appendChild(lessStyleNode);
		document.body.appendChild(lessConfigNode);
		document.body.appendChild(lessScriptNode);
		lessNodesAppended = true;
	} else {
		buildIt();
	}
};

const updateColorWeak = colorWeak => {
	document.body.className = colorWeak ? 'colorWeak' : '';
};

// 展开收缩菜单栏
const getSetting = () => (dispatch, getState) => {
	const setting = {};
	const state = getState().settingStore;
	const urlParams = new URL(window.location.href); // eslint-disable-line
	Object.keys(state).forEach(key => {
		if (urlParams.searchParams.has(key)) {
			const value = urlParams.searchParams.get(key);
			setting[key] = value === '1' ? true : value;
		}
	});
	const { primaryColor, colorWeak } = setting;
	if (state.primaryColor !== primaryColor) {
		updateTheme(primaryColor);
	}
	updateColorWeak(colorWeak);
	dispatch({
		type: GET_SETTING,
		preload: { ...state, ...setting },
	});
};

// 展开收缩菜单栏
const changeSetting = data => (dispatch, getState) => {
	const state = getState().settingStore;
	const urlParams = new URL(window.location.href); // eslint-disable-line
	Object.keys(defaultSettings).forEach(key => {
		if (urlParams.searchParams.has(key)) {
			urlParams.searchParams.delete(key);
		}
	});
	Object.keys(data).forEach(key => {
		if (key === 'collapse') {
			return;
		}
		let value = data[key];
		if (value === true) {
			value = 1;
		}
		if (defaultSettings[key] !== value) {
			urlParams.searchParams.set(key, value);
		}
	});
	const { primaryColor, colorWeak, contentWidth } = data;
	if (state.primaryColor !== primaryColor) {
		updateTheme(primaryColor);
	}
	if (state.contentWidth !== contentWidth && window.dispatchEvent) {
		window.dispatchEvent(new Event('resize'));
	}
	updateColorWeak(colorWeak);
	window.history.replaceState(null, 'setting', urlParams.href);

	dispatch({
		type: CHANGE_SETTING,
		preload: data
	});
};

/**
 *
 * @param {*} state
 * @param {*} param1
 */
const settingState = (state = initialState, { type, preload }) => {
	switch (type) {
		case GET_SETTING:
			return { ...state, ...preload };
		case CHANGE_SETTING:
			return { ...state, ...preload };
		default:
			return state;
	}
};

export default {
	reducer: settingState,
	action: { getSetting, changeSetting }
}


