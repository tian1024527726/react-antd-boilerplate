// 这是自动生成的文件，可以修改。
import React, { Component } from 'react';
import inject from '@inject';
import styles from './style.module.scss';

@inject('dashboard')
class Dashboard extends Component {

	componentDidMount() {
		/* 初始化渲染执行之后调用,仅执行一次 */
		const { dashboardAction: { getUserInfo }, dashboardStore } = this.props;
		getUserInfo()
			.then(() => {
				console.log(dashboardStore)
			})
	}

	componentWillUnmount() {
		/* 组件从DOM中移除时调用 */
	}

	render() {
		return (
			<div className={styles.content}>
				dashboard
			</div>
		);
	}
}

export default Dashboard;
