import React from 'react';
import SiderMenu from './siderMenu';
import { getFlatMenuKeys } from './siderMenuUtils';

const SiderMenuWrapper = React.memo(props => {
	const { menuData } = props;
	const flatMenuKeys = getFlatMenuKeys(menuData);
	return <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
});

export default SiderMenuWrapper;
