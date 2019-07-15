import pathToRegexp from 'path-to-regexp';

// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
// eslint-disable-next-line import/prefer-default-export
export const urlToList = (url) => {
	const urllist = url.split('/').filter(i => i);
	return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
}

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menuData
 */
export const getFlatMenuKeys = menuData => {
	let keys = [];
	menuData.forEach(item => {
		keys.push(item.path);
		if (item.children) {
			keys = keys.concat(getFlatMenuKeys(item.children));
		}
	});
	return keys;
};

export const getMenuMatches = (flatMenuKeys, path) =>
	flatMenuKeys.filter(item => {
		if (item) {
			return pathToRegexp(item).test(path);
		}
		return false;
	});
/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = props => {
	const {
		location: { pathname },
		flatMenuKeys,
	} = props;
	return urlToList(pathname)
		.map(item => getMenuMatches(flatMenuKeys, item)[0])
		.filter(item => item)
		.reduce((acc, curr) => [...acc, curr], ['/']);
};
