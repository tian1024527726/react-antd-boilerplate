import React, { PureComponent } from 'react';
import { Spin, Menu, Icon, Avatar, } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.module.less';

export default class GlobalHeaderRight extends PureComponent {

	render() {
		const {
			theme,
			currentUser,
			onMenuClick,
		} = this.props;
		const menu = (
			<Menu selectedKeys={[]} onClick={onMenuClick}>
				<Menu.Item key="userCenter" disabled>
					<Icon type="user" />
					<span>个人中心</span>
				</Menu.Item>
				<Menu.Item key="userinfo" disabled>
					<Icon type="setting" />
					<span>个人设置</span>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="logout">
					<Icon type="logout" />
					<span>退出登录</span>
				</Menu.Item>
			</Menu>
		);
		let className = styles.right;
		if (theme === 'dark') {
			className = `${styles.right}  ${styles.dark}`;
		}

		return (
			<div className={className}>
				{currentUser.name ? (
					<HeaderDropdown overlay={menu}>
						<span className={`${styles.action} ${styles.account}`}>
							<Avatar
								className={styles.avatar}
								src={currentUser.avatar}
								size='small'
								alt="avatar"
							/>
							<span className={styles.name}>{currentUser.name}</span>
						</span>
					</HeaderDropdown>
				) : (
						<Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
					)}
			</div>
		);
	}
}
