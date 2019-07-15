import React from 'react'
import isEqual from 'lodash/isEqual'

const PureHoc = Component => {

	return class extends React.Component {
		shouldComponentUpdate(nextProps) {
			return !isEqual(nextProps, this.props);
		}

		render() {
			const { children, ...others } = this.props;
			return <Component {...others} >{children}</Component>;
		}
	}

};

export default PureHoc;
