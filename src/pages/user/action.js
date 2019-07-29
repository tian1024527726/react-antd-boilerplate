import { message } from 'antd';
import CryptoJS from 'crypto-js';
import { setItem } from '@common/utils/storage';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import userService from '@/service/user';
import history from '@history';
import * as type from './constants';

const updateData = data => ({
	type: type.UPDATE_DATA,
	data,
});

const login = params => dispatch => {
	if (params.userName === 'admin' && params.password === 'qq123456') {
		dispatch(updateData({ userName: params.userName }));
		setItem('token', CryptoJS.MD5('qq123456').toString(), '0');
		setItem('userName', params.userName, '0');
		setAuthority('admin');
		reloadAuthorized();
		history.replace('/');
	} else {
		message.error('账户或密码错误');
	}
};

const logout = () => dispatch => {
	dispatch(updateData({ userName: '' }));
	history.replace('/user/login');
	setAuthority('');
	reloadAuthorized();
};

/* eslint no-unused-vars:0 */
const getUserInfo = (params = {}) => async dispatch => {
	return userService.getUserInfo({
		data: params.data,
		success: res => {
			dispatch({
				type: type.SAVE_USER_INFO,
				data: res
			})
		}
	})
}


export default {
	login,
	logout,
	getUserInfo,
};
