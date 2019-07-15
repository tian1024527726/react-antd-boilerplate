import { createHashHistory, createBrowserHistory } from 'history';

let history = null;
if (process.env.ROUTE_MODE === 'hash') {
	history = createHashHistory();
} else if (process.env.ROUTE_MODE === 'browser') {
	history = createBrowserHistory();
} else {
	history = createHashHistory();
}

window.g_history = history;
module.exports = history;
