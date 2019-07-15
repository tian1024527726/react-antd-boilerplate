import React, { Component, Fragment } from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import GlobalFooter from 'GlobalFooter';
import DocumentTitle from 'react-document-title';
import logo from '@/assets/logo.png';
import getPageTitle from '@/utils/getPageTitle';
import inject from '@/redux/inject';
import styles from './userLayout.module.less';

const copyright = (
	<Fragment>
		Copyright <Icon type="copyright" /> 2019 React Antd Template
	</Fragment>
);

@inject('global')
class UserLayout extends Component {

	render() {
		const {
			children,
			location: {
				pathname
			},
			globalStore: {
				breadcrumbNameMap
			}
		} = this.props;
		return (
			<DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
				<div className={styles.container}>
					<div className={styles.content}>
						<div className={styles.top}>
							<div className={styles.header}>
								<Link to="/">
									<img alt="logo" className={styles.logo} src={logo} />
									<span className={styles.title}>React Antd Temp</span>
								</Link>
							</div>
							<div className={styles.desc}>一个使用React、Antd、Redux、Redux-Thunk的开发模板</div>
						</div>
						{children}
					</div>
					<GlobalFooter copyright={copyright} />
				</div>
			</DocumentTitle>
		);
	}
}

export default UserLayout
