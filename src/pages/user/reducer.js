import logo from '@/assets/logo.png';
import * as types from './constants';

const initialState = {
	avatar: logo,
	userName: '',
	user: '', // 用户信息
};

const user = (state = initialState, { type, data }) => {
	switch (type) {
		case types.UPDATE_DATA:
			return {
				...state,
				...data,
			};
		case types.SAVE_USER_INFO:
			return {
				...state,
				...data,
			};
		case types.UPDATA_AUTHS:
			return {
				...state,
				userAuths: [...state.userAuths, ...data],
			};
		default:
			return state;
	}
};


export default user;
