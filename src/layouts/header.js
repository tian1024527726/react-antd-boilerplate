import React, { Component } from 'react';
import { Layout } from 'antd';
import Animate from 'rc-animate';
import GlobalHeader from 'GlobalHeader';
import TopNavHeader from 'TopNavHeader';
import { getItem } from '@common/utils/storage';
import inject from '@inject';
import styles from './header.module.less';

const { Header } = Layout;

@inject('global', 'user', 'setting')
class HeaderView extends Component {
	state = {
		visible: true,
	};

	static getDerivedStateFromProps(props, state) {
		if (!props.settingStore.autoHideHeader && !state.visible) {
			return {
				visible: true,
			};
		}
		return null;
	}

	componentDidMount() {
		document.addEventListener('scroll', this.handScroll, { passive: true });
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.handScroll);
	}

	getHeadWidth = () => {
		const { globalStore: { collapsed }, settingStore: { fixedHeader, layout } } = this.props

		if (!fixedHeader || layout === 'topmenu') {
			return '100%';
		}
		return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
	};


	handleMenuClick = ({ key }) => {
		if (key === 'userCenter') {
			return;
		}
		if (key === 'userinfo') {
			return;
		}
		if (key === 'logout') {
			this.logout();
		}
	}

	handScroll = () => {
		const { settingStore: { autoHideHeader } } = this.props;
		const { visible } = this.state;
		if (!autoHideHeader) {
			return;
		}
		const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
		if (!this.ticking) {
			this.ticking = true;
			requestAnimationFrame(() => {
				if (this.oldScrollTop > scrollTop) {
					this.setState({
						visible: true,
					});
				} else if (scrollTop > 300 && visible) {
					this.setState({
						visible: false,
					});
				} else if (scrollTop < 300 && !visible) {
					this.setState({
						visible: true,
					});
				}
				this.oldScrollTop = scrollTop;
				this.ticking = false;
			});
		}
	}

	logout = () => {
		const { userAction: { logout } } = this.props;
		logout();
	}

	render() {
		const { userStore: { avatar }, globalStore: { collapsed }, settingStore: { fixedHeader, navTheme, layout }, globalAction: { changeLayoutCollapsed } } = this.props;
		const { visible } = this.state;
		const isTop = layout === 'topmenu';
		const width = this.getHeadWidth();
		const userName = getItem('userName', '0');
		const HeaderDom = visible ? (
			<Header
				style={{ padding: 0, width }}
				className={fixedHeader ? styles.fixedHeader : ''}
			>
				{isTop ? (
					<TopNavHeader
						theme={navTheme}
						mode="horizontal"
						onCollapse={changeLayoutCollapsed}
						onMenuClick={this.handleMenuClick}
						currentUser={{
							name: userName,
							avatar
						}}
						{...this.props}
					/>
				) : (
						<GlobalHeader
							onMenuClick={this.handleMenuClick}
							onCollapse={changeLayoutCollapsed}
							collapsed={collapsed}
							currentUser={{
								name: userName,
								avatar
							}}
							{...this.props}
						/>
					)}
			</Header>
		) : null;
		return (
			<Animate component="" transitionName="fade">
				{HeaderDom}
			</Animate>
		);
	}
}

export default HeaderView
