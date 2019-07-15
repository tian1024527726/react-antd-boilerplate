// 这是自动生成的文件，可以修改。
import userService from '@/service/user';
import * as type from './constant';

/* eslint no-unused-vars:0 */
const getUserInfo = (data = {}) => async dispatch => {
	const res = await userService.getUserInfo({ data })

	dispatch({
		type: type.SAVE_USER_INFO,
		payload: res
	})

	return res;
}

export default {
	getUserInfo
};
