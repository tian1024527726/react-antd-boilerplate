import { getItem, setItem } from '@common/utils/storage';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
	return getItem('react-antd-template-authority', '0') || str;
}

export function setAuthority(authority) {
	return setItem('react-antd-template-authority', authority, '0')
}
