import 'babel-polyfill';
import 'eventsource-polyfill';
import '@common/utils/swInit';
import React from 'react';
import ReactDOM from 'react-dom';
import history from '@history'
import configureStore from './redux/store';
import './global.module.scss';
import './mock';

// 暴露出全局store 方便非react组件对象可以调用
const store = configureStore(history);

const rootElement = document.getElementById('app');

const oldRender = () => {
	const App = require('./router').default;
	ReactDOM.render(<App store={store} history={history} />, rootElement);
};

oldRender();

if (module.hot) {
	module.hot.accept('./router', () => {
		ReactDOM.unmountComponentAtNode(rootElement);
		oldRender();
	});
}

