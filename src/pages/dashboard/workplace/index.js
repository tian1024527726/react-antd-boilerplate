// 这是自动生成的文件，可以修改。
import React, { Component } from 'react';
import inject from '@inject';
import styles from './style.module.scss';

@inject('workplace')
class Workplace extends Component {

	componentDidMount() {
		/* 初始化渲染执行之后调用,仅执行一次 */
		const { workplaceAction: { getUserInfo }, workplaceStore } = this.props;
		getUserInfo()
			.then(() => {
				console.log(workplaceStore)
			})
	}

	componentWillUnmount() {
		/* 组件从DOM中移除时调用 */
	}

	render() {
		return (
			<div className={styles.content}>
				workplace
			</div>
		);
	}
}

export default Workplace;
