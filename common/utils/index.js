import { createInputFactory as CIF } from 'DynamicForm';

let IS_LOADING = false;

export const fileToImgsrc = (fileinput) => {
	return new Promise((resolve, reject) => {
		let files = fileinput.files,
			img = new Image();
		console.log(files);
		if (window.FileReader) {
			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = function (e) {
				img.src = this.result;

				if (img.complete) {
					resolve(compress(img));
				} else {
					img.onload = () => {
						const imgBase64Data = compress(img);
						resolve(imgBase64Data);
						img = null;
					};
				}
				// resolve(this.result);
				reader = null;
			}
		} else if (window.Blob && files[0] instanceof Blob) {
			let mpImg = new MegaPixImage(files[0]);
			mpImg.render(img);
			img.onload = function (e) {
				resolve(this.src);
				img = null;
			};
		}
	});
};

export const toQS = (params) => {
	let paramsList = [];
	for (let key in params) {
		paramsList.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
	}
	return paramsList.join("&");
};

export const addQS = (host, url, params) => {
	if (!/^(:?https?:\/)?\//.test(url)) {
		url = host + url;
	}
	const query = toQS(params);
	return query ? url + (url.indexOf("?") ? "?" : "&") + toQS(params) : url;
};


export const formatMoney = (money, n) => {
	if (!money || !(money = parseFloat(money))) {
		money = 0;
	}
	n = n > 0 && n <= 3 ? n : 2;
	money = money.toFixed(n);
	let l = money.split(".")[0].split("").reverse();
	let r = money.split(".")[1];
	let t = "";
	for (let i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
};

export const unformatMoney = num => {
	if (num) {
		return num.replace(/,/g, "");
	}
	return num;
};


export const dateFormatting = (fmt, dateStr) => {
	if (!dateStr) return '';
	dateStr = dateStr.replace(new RegExp("-", "g"), "\/");
	var date = new Date(dateStr);
	var o = {
		"M+": date.getMonth() + 1,                 //月份
		"d+": date.getDate(),                    //日
		"h+": date.getHours(),                   //小时
		"m+": date.getMinutes(),                 //分
		"s+": date.getSeconds(),                 //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds()             //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

export const disableCIF = label => CIF(label).isDisable();
export const phCIF = label => CIF(label).ph();
export const requireCIF = label => CIF(label).isRequired();


export const pipePromise = promiseArr => () => new Promise((resolve, reject) => {
	const promiseChain = promiseArr.reduce(
		(lastPromise, promise) => () => lastPromise().then(promise).catch(err => {
			reject(err);
			return Promise.reject(err);
		}),
		() => Promise.resolve(),
	);
	promiseChain().then(resolve);
});

export const composePromise = promiseArr => () => new Promise((resolve, reject) => {
	const promiseChain = promiseArr.reduceRight(
		(lastPromise, promise) => () => lastPromise().then(promise).catch(err => {
			reject(err);
			return Promise.reject(err);
		}),
		() => Promise.resolve(),
	);
	promiseChain().then(resolve);
});

if (Object.defineProperty) {
	Object.defineProperty(Promise, 'pipe', {
		value: pipePromise,
		enumerable: false,
		configurable: false,
		writable: false,
	});
	Object.defineProperty(Promise, 'compose', {
		value: composePromise,
		enumerable: false,
		configurable: false,
		writable: false,
	});
} else {
	Promise.pipe = pipePromise;
	Promise.compose = composePromise;
}

