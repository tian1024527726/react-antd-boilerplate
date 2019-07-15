// 缓存
const cache = {};
const cid = 'cid2019-';

export const getItem = (key) => {
	key = cid + key;
	let result = cache[key];
	let cookieObj = {}, cookieArr = [];
	if (!result) {
		if (document.cookie) {
			cookieArr = document.cookie.split(';');
			cookieArr.map((item, index) => {
				item = item.trim();
				const arr = item.split('=');
				try {
					const obj = JSON.parse(decodeURIComponent(arr[1]));
					if (obj.__cookieType === 'string') {
						cookieObj[arr[0]] = obj.value;
					} else {
						cookieObj[arr[0]] = obj;
					}
				} catch (e) {
					cookieObj[arr[0]] = arr[1];
				}
			})
			return cache[key] = cookieObj[key];
		} else {
			return null;
		}
	} else {
		return result;
	}
}

export const setItem = (key, data = {}, expires = '') => {
	cache[key] = data;
	key = cid + key;
	let newData;
	if (typeof data === 'string') {
		newData = {
			__cookieType: 'string',
			value: data
		}
	} else {
		newData = data
	}
	if (expires) {
		let time = new Date();
		time.setTime(time.getTime() + expires * 1000);
		expires = time.toGMTString();
	}
	document.cookie = `${key}=${encodeURIComponent(JSON.stringify(newData))};expires=${expires}`
}

export const removeItem = (key, data = {}) => {
	cache[key] = '';
	key = cid + key;
	let time = new Date();
	time.setTime(time.getTime() - 1);
	document.cookie = `${key}=${JSON.stringify(data)};expires=${time.toGMTString()}`
}
