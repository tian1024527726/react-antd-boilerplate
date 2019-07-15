import request from '@/utils/request';
import userApi from '@/api/user';

/**
 * 获取用户信息
 * @param {*} params
 */
export const getUserInfo = (params) => {
	return request({
		url: userApi.getUserInfo,
		...params
	});
}

export default {
	getUserInfo
}
