import React, { Component } from 'react';
import classnames from 'classnames';
import Moment from 'moment';
import dynamicFormStyle from '../style.scss';

class Text extends Component {
	render() {
		const { value, textValue, format, style, className, ...restProps } = this.props; // eslint-disable-line
		let showText = textValue || value;
		if (value === null || value === undefined || value === '') {
			showText = '无';
		}
		if (Array.isArray(value)) {
			showText = textValue || value.join(',');
		}
		if (Moment.isMoment(value)) {
			showText = value.format(format);
		}
		const cls = classnames(className, dynamicFormStyle.text);
		return <div {...restProps} className={cls}>{showText}</div>;
	}
}

export default Text;
