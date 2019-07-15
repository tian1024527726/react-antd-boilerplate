import React from 'react';
import { Link } from 'react-router-dom';
import MenuContext from '@/layouts/menuContext';
import BreadcrumbView from './breadcrumb';
import styles from './index.module.less';

export default ({ ...restProps }) => (
	<MenuContext.Consumer>
		{value => (
			<div className={styles.conte}>
				<BreadcrumbView
					{...value}
					key="breadcrumb"
					{...restProps}
					linkElement={Link}
					itemRender={item => {
						return item.name;
					}}
				/>
			</div>
		)}
	</MenuContext.Consumer>
);
