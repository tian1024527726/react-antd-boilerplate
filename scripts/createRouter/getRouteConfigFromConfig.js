import assert from 'assert';
import { join, isAbsolute } from 'path';
import slash from 'slash2';
import { cloneDeep } from 'lodash';
import isUrl from 'is-url';

export default (routes, pagesPath = 'src/pages', parentRoutePath = '/') => {
	// cloneDeep 是为了避免 patch 多次
	const clonedRoutes = cloneDeep(routes);
	patchRoutes(clonedRoutes, pagesPath, parentRoutePath);
	return clonedRoutes;
};

function patchRoutes(routes, pagesPath, parentRoutePath) {
	assert(Array.isArray(routes), `routes should be Array, but got ${routes}`);
	routes.forEach(route => {
		patchRoute(route, pagesPath, parentRoutePath);
	});
}

function patchRoute(route, pagesPath, parentRoutePath) {
	// route.component start from pages
	if (route.component) {
		route.component = resolveComponent(pagesPath, route.component);
	}

	// path patch must be before bigfish patch
	if (route.path && route.path.charAt(0) !== '/') {
		if (isUrl(route.path)) {
			route.path = slash(route.path);
		} else {
			route.path = slash(join(parentRoutePath, route.path));
		}
	}

	// Compatible with bigfish
	if (route.childRoutes) {
		route.routes = route.childRoutes;
		delete route.childRoutes;
	}
	if (route.indexRoute) {
		if (route.indexRoute.redirect) {
			let { redirect } = route.indexRoute;
			if (redirect.charAt(0) !== '/') {
				redirect = slash(join(route.path, redirect));
			}
			if (route.indexRoute.component || route.routes) {
				if (!route.routes) {
					route.routes = [];
				}
				route.routes.unshift({
					path: route.path,
					redirect,
				});
			} else {
				route.redirect = redirect;
			}
		}
		if (route.indexRoute.component) {
			if (!route.routes) {
				route.routes = [];
			}
			const parsedRoute = {
				...route.indexRoute,
				path: route.path,
				exact: true,
				component: route.indexRoute.component,
			};
			delete parsedRoute.redirect;
			route.routes.unshift(parsedRoute);
		}
		delete route.indexRoute;
	}

	if (route.redirect && route.redirect.charAt(0) !== '/') {
		route.redirect = slash(join(parentRoutePath, route.redirect));
	}
	if (route.routes) {
		patchRoutes(route.routes, pagesPath, route.path);
	} else if (!('exact' in route)) {
		route.exact = true;
	}

	return route;
}

function resolveComponent(pagesPath, component) {
	if (isAbsolute(component) || component.startsWith('() =>')) {
		return component;
	}
	const ret = slash(join(pagesPath, component));
	if (ret.indexOf('./') !== 0) {
		return `./${ret}`;
	}
}
