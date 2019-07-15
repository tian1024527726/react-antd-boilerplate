// 这是自动生成的文件，可以修改。
import * as types from './constant';

const initialState = {
	result: null
};

const resultState = (state = initialState, { type, payload }) => {
	switch (type) {
		case types.SAVE_USER_INFO:
			/**
			 * 这里返回一定要返回一个新的对象，而不能在原来的state基础上做修改
			 * 正确的是
			 * return { ...state }
			 * 错误的是
			 * state.data = xxx;
			 * return state;
			 *
			 * 要达到newState !== oldState的效果
			 * 视图的数据才会随着更改而更新，否则视图层不会更新
			 */
			return {
				...state,
				...payload,
			};
		default:
			return state;
	}
};


export default resultState;
