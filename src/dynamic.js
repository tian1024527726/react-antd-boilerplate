import React, { Component } from 'react';

let defaultLoadingComponent = () => null;

const asyncComponent = (config) => {
	const { resolve } = config;

	return class DynamicComponent extends Component {
		constructor(...args) {
			super(...args);
			this.LoadingComponent = config.LoadingComponent || defaultLoadingComponent;
			this.state = {
				AsyncComponent: null,
			};
			this.load();
		}

		componentDidMount() {
			this.mounted = true;
		}

		componentWillUnmount() {
			this.mounted = false;
		}

		load = () => {
			resolve().then((m) => {
				const AsyncComponent = m.default || m;
				if (this.mounted) {
					this.setState({ AsyncComponent });
				} else {
					this.state.AsyncComponent = AsyncComponent; // eslint-disable-line
				}
			});
		}

		render() {
			const { AsyncComponent } = this.state;
			const { LoadingComponent } = this;
			if (AsyncComponent) return <AsyncComponent {...this.props} />;

			return <LoadingComponent {...this.props} />;
		}
	};
}

const dynamic = (config) => {
	const { component: resolveComponent } = config;
	return asyncComponent({
		resolve: config.resolve || function () { // eslint-disable-line
			const component = resolveComponent();
			return new Promise((resolve) => {
				Promise.all([component]).then((ret) => {
					return resolve(ret[0]);
				});
			});
		},
		...config,
	});
}

dynamic.setDefaultLoadingComponent = (LoadingComponent) => {
	defaultLoadingComponent = LoadingComponent;
};

export default dynamic
