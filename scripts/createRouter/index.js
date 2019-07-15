import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import Mustache from 'mustache';
import routesToJSON from './routesToJSON'
import stripJSONQuote from './stripJSONQuote'

let routesContent;

module.exports = (filePath) => {
	const absRouterJSPath = join(process.cwd(), 'src/router.js')
	const routerTpl = readFileSync(join(__dirname, './template/router.js.tpl'), 'utf-8');
	const routes = stripJSONQuote(routesToJSON(filePath));
	const curRoutesContent = Mustache.render(routerTpl, {
		routes
	});

	// 避免文件写入导致不必要的 webpack 编译
	if (routesContent !== curRoutesContent) {
		writeFileSync(absRouterJSPath, `${curRoutesContent.trim()}\n`, 'utf-8');
		routesContent = curRoutesContent;
	}
}
