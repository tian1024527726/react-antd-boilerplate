import axios from 'axios';
const defaultTimeout = 2000;

const EnhanceAxios = (options) => {
	const { beforeSend, ...others } = options

	const instance = axios.create({
		baseURL: '/',
		timeout: defaultTimeout,
		responseType: 'json',
		withCredentials: true,
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
      /*Content-Type只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain,
      不然就不是简单请求，浏览器会默认发一次OPTIONS预检请求，确认服务器是否允许跨域*/
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		...others
	})

	// Add a request interceptor
	instance.interceptors.request.use(function (config) {
		beforeSend && beforeSend();
		return config
	}, function (error) {
		return Promise.reject(error);
	});

	// Add a response interceptor
	instance.interceptors.response.use(function (response) {
		return response.data;
	}, function (error) {
		//超时error.code  ECONNABORTED
		return Promise.reject(error);
	});

	return instance
}


export default EnhanceAxios
