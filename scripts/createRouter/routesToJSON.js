import { isAbsolute, relative, resolve } from 'path';
import { cloneDeep } from 'lodash';
import getRouteConfigFromConfig from './getRouteConfigFromConfig'
import modifyRouteComponent from './modifyRouteComponent'


let targetLevel = null;
let level = 0;

export default (filePath) => {
	const routes = require(filePath).default;

	targetLevel = 1;
	const routesHaveChild = routes.filter(
		route => route.routes && route.routes.length,
	);

	if (routesHaveChild.length) {
		targetLevel = 2;
	}

	let clonedRoutes = cloneDeep(routes);
	clonedRoutes = getRouteConfigFromConfig(clonedRoutes);
	patchRoutes(clonedRoutes);

	return JSON.stringify(
		clonedRoutes,
		(key, value) => {
			switch (key) {
				case 'component':
					if (value.startsWith('() =>')) {
						return value.replace(/\(\) =>/, '').trim();
					}

					const [component, webpackChunkName] = value.split('^^');
					const importPath = isAbsolute(component)
						? component
						: `./${relative('./src', component)}`

					let ret = `require('${importPath}').default`;

					ret = modifyRouteComponent(ret, {
						importPath,
						webpackChunkName,
					})

					return ret;
				case 'Routes':
					return `[${value
						.map(
							v =>
								`require('${resolve(process.cwd(), v)}').default`,
						)
						.join(', ')}]`;
				default:
					return value;
			}
		},
		2,
	);
}

function patchRoutes(routes, webpackChunkName) {
	level += 1;
	routes.forEach(route => {
		patchRoute(route, webpackChunkName);
	});
	level -= 1;
}

function normalizeEntry(entry) {
	return entry
		.replace(/^.(\/|\\)/, '')
		.replace(/(\/|\\)/g, '__')
		.replace(/\.jsx?$/, '')
		.replace(/\.tsx?$/, '');
}

function patchRoute(route, webpackChunkName) {
	if (route.component && !route.component.startsWith('() =>')) {
		if (!webpackChunkName || level <= targetLevel) {
			webpackChunkName = normalizeEntry(route.component || 'common_component')
				.replace(/^src__/, '')
				.replace(/^pages__/, 'p__')
				.replace(/^page__/, 'p__');
		}
		route.component = [
			route.component || 'common_component',
			webpackChunkName,
			route.path,
		].join('^^');
	}
	if (route.routes) {
		// 只在一级路由做按需编译
		patchRoutes(route.routes, webpackChunkName);
	}
}
