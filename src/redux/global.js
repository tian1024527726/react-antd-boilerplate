import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
// import Authorized from '@/utils/Authorized';

// const { check } = Authorized;

// constant of dispath types
const CHANGE_LAYOUT_COLLAPSED = 'global/CHANGE_LAYOUT_COLLAPSED';
const GET_MENU_DATA = 'global/GET_MENU_DATA';

// state
const initialState = {
	collapsed: false, // 菜单栏收缩状态
	menuData: [],
	routerData: [],
	breadcrumbNameMap: {},
};

// Conversion router to menu.
function formatter(data, parentAuthority) {
	if (!data) {
		return undefined;
	}
	return data
		.map(item => {
			if (!item.name || !item.path) {
				return null;
			}

			// close menu international
			const { name } = item;
			const result = {
				...item,
				name,
				authority: item.authority || parentAuthority,
			};
			if (item.routes) {
				const children = formatter(item.routes, item.authority);
				// Reduce memory usage
				result.children = children;
			}
			delete result.routes;
			return result;
		})
		.filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
// const getSubMenu = item => {
// 	// doc: add hideChildrenInMenu
// 	if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
// 		return {
// 			...item,
// 			children: filterMenuData(item.children), // eslint-disable-line
// 		};
// 	}
// 	return item;
// };

/**
 * filter menuData
 */
const filterMenuData = menuData => {
	if (!menuData) {
		return [];
	}
	return menuData
		.filter(item => item.name && !item.hideInMenu)
		// .map(item => check(item.authority, getSubMenu(item)))
		.filter(item => item);
};

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
	if (!menuData) {
		return {};
	}
	const routerMap = {};

	const flattenMenuData = data => {
		data.forEach(menuItem => {
			if (menuItem.children) {
				flattenMenuData(menuItem.children);
			}
			// Reduce memory usage
			routerMap[menuItem.path] = menuItem;
		});
	};
	flattenMenuData(menuData);
	return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);


// 展开收缩菜单栏
const changeLayoutCollapsed = collapsed => dispatch => {
	dispatch({
		type: CHANGE_LAYOUT_COLLAPSED,
		payload: collapsed,
	});
};

// 获取菜单栏数据
const getMenuData = payload => dispath => {
	const { routes, authority, path } = payload;
	const originalMenuData = memoizeOneFormatter(routes, authority, path);
	const menuData = filterMenuData(originalMenuData);
	const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);

	dispath({
		type: GET_MENU_DATA,
		payload: { menuData, breadcrumbNameMap, routerData: routes },
	})
}

/**
 *
 */
const globalState = (state = initialState, { type, payload }) => {
	switch (type) {
		case CHANGE_LAYOUT_COLLAPSED:
			return { ...state, collapsed: payload };
		case GET_MENU_DATA:
			return { ...state, ...payload };
		default:
			return state;
	}
};

export default {
	reducer: globalState,
	action: { changeLayoutCollapsed, getMenuData }
}


