// 导入 reducer
// 导入 actions
import global from './global';
import setting from './setting';

const globalStore = global.reducer;
const globalAction = global.action;

const settingStore = setting.reducer;
const settingAction = setting.action;

/**
 * 通过require.context方法获取pages下antions.js和reducer.js文件
 * 通过yarn create:page 创建页面时会动态生成antions.js和reducer.js文件
 */
const getClientReduxContext = () => {
	const actionsContext = require.context('../pages', true, /action\.js$/);
	const reducerContext = require.context('../pages', true, /reducer\.js$/);
	return {
		actionsContext,
		reducerContext,
	};
};

const { actionsContext, reducerContext } = getClientReduxContext();

/**
 * 根据文件路径生成导入的模块名称
 * demo： ./aaa/ccc/bbb/fff.js => aaaCccBbbFff
 * @param path
 */
// const reg = /\/\w/g;
const formatModuleName = path => {
	// 去除./和.js字符
	let moduleName = path.replace(/\.\/|\.js/g, '');

	moduleName = moduleName.split('/').filter((item, index) => { if (moduleName.split('/').length - 2 <= index) { return item } }).map(item => item.charAt(0).toUpperCase() + item.substr(1)).join(''); //eslint-disable-line
	// 首字母小写
	moduleName = moduleName.charAt(0).toLowerCase() + moduleName.substr(1);
	// 将Reducer改为Store方便开发理解含义
	moduleName = moduleName.replace('Reducer', 'Store');
	return moduleName;
};

const getRedux = context => {
	const obj = {};
	context.keys().forEach(item => {
		const moduleName = formatModuleName(item);
		obj[moduleName] = context(item).default;
	});
	return obj;
};

const pageActions = getRedux(actionsContext);
const pageReducers = getRedux(reducerContext);

// 将reducer 加入自动注入对象
export const allReducers = {
	globalStore,
	settingStore,
	...pageReducers,
};

// 将actions 加入自动导入对象
export const allActions = {
	globalAction,
	settingAction,
	...pageActions,
};

export default allReducers;
