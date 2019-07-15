import { message } from 'antd';
import EnhanceAxios from '@common/utils/enhanceAxios';
import requestHandler from '@common/utils/requestHandler';

const { HOST } = process.env;
const Axios = EnhanceAxios({ baseURL: HOST, beforeSend: () => { } }); // 创建项目接口请求的axios

const request = (options) => {
	const { method, url, data } = options;
	const requestFun = requestHandler.subscribe(url, +new Date())
	console.log('入参-->')
	console.log(data)
	const requestData = JSON.stringify(data); // 处理入参

	return Axios({
		url,
		method: method || 'post',
		data: requestData
	})
		.then(res => {
			// 统一增加后端接口前置判断条件
			if (res.responseCode === '000000') {
				console.log('出参-->')
				console.log(res.responseData)
				return Promise.resolve(res.responseData);
			}
			return Promise.reject(res)
		})
		.catch(err => {
			message.error(err.responseMessage || '系统繁忙，请稍后再试');
			return Promise.reject(err);
		})
		.finally(() => {
			requestFun();
		})
}

export default request;
