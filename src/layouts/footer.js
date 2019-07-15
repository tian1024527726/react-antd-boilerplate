import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from 'GlobalFooter';

const { Footer } = Layout;
const copyright = (
	<Fragment>
		Copyright <Icon type="copyright" /> 2019 React Antd Template
	</Fragment>
);
const FooterView = () => (
	<Footer style={{ padding: 0 }}>
		<GlobalFooter
			copyright={copyright}
		/>
	</Footer>
);
export default FooterView;
