// 公用缓存，目前只支持存取 object 对象
let cache = {};
let cid = 'cid2019-';

const storageObj = {
	'1': sessionStorage,
	'0': localStorage,
}

/**
 * 获取缓存
 * @param type 1=session 0=local
 */
export function getItem(key, type = '1') {
  key = cid + key;
  let result = cache[key];
	if (!result) {
		result = storageObj[type].getItem(key)
		if (result) {
			result = JSON.parse(result)
			if (result['__storageType'] === 'string') {
				result = result['value']
			}
		} else {
			result = ''
		}
		cache[key] = result
	}
	return result;
}

/**
 * 设置缓存
 * @param value 目前支持字符串跟对象
 */
export function setItem(key, value = {}, type = '1') {
  key = cid + key;
  cache[key] = value;
	if (typeof value === 'string') {
		value = {
			__storageType: 'string',
			value,
		}
	}
	const str = JSON.stringify(value);
	storageObj[type].setItem(key, str)
}

// 删除值
export function removeItem(key, type = '1') {
  key = cid + key;
  cache[key] = '';
	storageObj[type].removeItem(key);
}

export function setString(key, value = '', type = '1') {
  key = cid + key;
  cache[key] = value;
  const str = value;
	storageObj[type].setItem(key, str)
};

export function getString(key, type = '1') {
  key = cid + key;
  let result = cache[key];
	if (!result) {
		result = storageObj[type].getItem(key);
		cache[key] = result;
	}
	return result
};
