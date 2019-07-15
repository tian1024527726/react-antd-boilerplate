/* eslint-disable */
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import renderRoutes from './renderRoutes';
import dynamic from './dynamic';

let routes = {{{ routes }}};

// route change handler
function routeChangeHandler(location, action) {
	// console.log(location)
	// console.log(action)
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper({ store, history }) {
	return (
		// 利用Provider可以使我们的 store 能为下面的组件所用
		<Provider store={store}>
			<Router history={history}>
				{renderRoutes(routes, {})}
			</Router>
		</Provider>
	);
}
