import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './index.module.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './siderMenuUtils';

const BaseMenu = React.lazy(() => import('./baseMenu'));
const { Sider } = Layout;

let firstMount = true;

export default class SiderMenu extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			openKeys: getDefaultCollapsedSubMenus(props),
		};
	}

	componentDidMount() {
		firstMount = false;
	}

	static getDerivedStateFromProps(props, state) {
		const { pathname, flatMenuKeysLen } = state;
		if (props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
			return {
				pathname: props.location.pathname,
				flatMenuKeysLen: props.flatMenuKeys.length,
				openKeys: getDefaultCollapsedSubMenus(props),
			};
		}
		return null;
	}

	isMainMenu = key => {
		const { menuData } = this.props;
		return menuData.some(item => {
			if (key) {
				return item.key === key || item.path === key;
			}
			return false;
		});
	};

	handleOpenChange = openKeys => {
		const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
		this.setState({
			openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
		});
	};

	render() {
		const { logo, collapsed, theme, fixSiderbar, onCollapse } = this.props;
		const { openKeys } = this.state;
		const defaultProps = collapsed ? {} : { openKeys };
		const siderClassName = classNames(styles.sider, {
			[styles.fixSiderBar]: fixSiderbar,
			[styles.light]: theme === 'light',
		});
		return (
			<Sider
				trigger={null}
				collapsible
				onCollapse={collapse => {
					if (firstMount) {
						onCollapse(collapse);
					}
				}}
				collapsed={collapsed}
				breakpoint="lg"
				width={256}
				theme={theme}
				className={siderClassName}
			>
				<div className={styles.logo} id="logo">
					<Link to="/">
						<img src={logo} alt="logo" />
						<h1>React Antd Temp</h1>
					</Link>
				</div>
				<Suspense fallback={<PageLoading />}>
					<BaseMenu
						{...this.props}
						mode="inline"
						handleOpenChange={this.handleOpenChange}
						onOpenChange={this.handleOpenChange}
						style={{ padding: '16px 0', width: '100%' }}
						{...defaultProps}
					/>
				</Suspense>
			</Sider>
		);
	}
}
