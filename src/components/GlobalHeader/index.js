import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.module.less';
import RightContent from './rightContent';

export default class GlobalHeader extends PureComponent {
	componentWillUnmount() {
		this.triggerResizeEvent.cancel();
	}
	/* eslint-disable*/
	@Debounce(600)
	triggerResizeEvent() {
		// eslint-disable-line
		const event = document.createEvent('HTMLEvents');
		event.initEvent('resize', true, false);
		window.dispatchEvent(event);
	}
	toggle = () => {
		const { collapsed, onCollapse } = this.props;
		onCollapse(!collapsed);
		this.triggerResizeEvent();
	};
	render() {
		const { collapsed } = this.props;
		return (
			<div className={styles.header}>
				<span className={styles.trigger} onClick={this.toggle}>
					<Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
				</span>
				<RightContent {...this.props} />
			</div>
		);
	}
}
