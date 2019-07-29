import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'Login';
import inject from '@inject';
import styles from './login.module.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@inject('user')
class LoginPage extends Component {
	state = {
		type: 'account',
		autoLogin: true,
	};

	onTabChange = type => {
		this.setState({ type });
	};

	onGetCaptcha = () =>
		new Promise((resolve, reject) => {
			this.loginForm.validateFields(['mobile'], {}, (err, values) => {
				if (err) {
					reject(err);
				} else {
					const { dispatch } = this.props;
					dispatch({
						type: 'login/getCaptcha',
						payload: values.mobile,
					})
						.then(resolve)
						.catch(reject);
				}
			});
		});

	handleSubmit = (err, values) => {
		const { type } = this.state;
		if (!err) {
			const { userAction: { login } } = this.props;
			login({ ...values, type })
		}
	};

	changeAutoLogin = e => {
		this.setState({
			autoLogin: e.target.checked,
		});
	};

	renderMessage = content => (
		<Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
	);

	render() {
		const { submitting } = this.props;
		const { type, autoLogin } = this.state;
		const status = true;
		return (
			<div className={styles.main}>
				<Login
					defaultActiveKey={type}
					onTabChange={this.onTabChange}
					onSubmit={this.handleSubmit}
					ref={form => {
						this.loginForm = form;
					}}
				>
					<Tab key="account" tab='用户名登录'>
						{status === 'error' &&
							type === 'account' &&
							!submitting &&
							this.renderMessage('用户名密码错误')}
						<UserName
							name="userName"
							placeholder='用户名: admin'
							rules={[
								{
									required: true,
									message: '请输入用户名',
								},
							]}
						/>
						<Password
							name="password"
							placeholder='密码: qq123456'
							rules={[
								{
									required: true,
									message: '请输入密码',
								},
							]}
							onPressEnter={e => {
								e.preventDefault();
								this.loginForm.validateFields(this.handleSubmit);
							}}
						/>
					</Tab>
					<Tab key="mobile" tab='手机号登录'>
						{status === 'error' &&
							type === 'mobile' &&
							!submitting &&
							this.renderMessage(
								'验证码错误'
							)}
						<Mobile
							name="mobile"
							placeholder='手机号'
							rules={[
								{
									required: true,
									message: '请输入手机号',
								},
								{
									pattern: /^1\d{10}$/,
									message: '手机号格式不正确',
								},
							]}
						/>
						<Captcha
							name="captcha"
							placeholder='验证码'
							countDown={120}
							onGetCaptcha={this.onGetCaptcha}
							getCaptchaButtonText='获取验证码'
							getCaptchaSecondText='s'
							rules={[
								{
									required: true,
									message: '请输入验证码',
								},
							]}
						/>
					</Tab>
					<div>
						<Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
							记住密码
						</Checkbox>
						<a style={{ float: 'right' }} href="#">
							忘记密码
						</a>
					</div>
					<Submit loading={submitting}>
						登录
					</Submit>
					<div className={styles.other}>
						其他登录方式
						<Icon type="alipay-circle" className={styles.icon} theme="outlined" />
						<Icon type="taobao-circle" className={styles.icon} theme="outlined" />
						<Icon type="weibo-circle" className={styles.icon} theme="outlined" />
						<Link className={styles.register} to="/user/register">
							注册账户
						</Link>
					</div>
				</Login>
			</div>
		);
	}
}

export default LoginPage;
