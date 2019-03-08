import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';
import ButtonContent from './button-content';
import getDefaultStyle from './google-styles';

class GoogleLogout extends Component {
	constructor(props) {
		super(props);
		this.signOut = this.signOut.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.state = {
			disabled: true,
			hovered: false,
			active: false
		};
	}
	componentDidMount() {
		const { jsSrc, onFailure, isSignedIn, clientId, cookiePolicy, loginHint, hostedDomain, fetchBasicProfile, discoveryDocs, uxMode, redirectUri, scope, accessType } = this.props;

		((d, s, id, cb) => {
			const element = d.getElementsByTagName(s)[0];
			const fjs = element;
			let js = element;
			js = d.createElement(s);
			js.id = id;
			js.src = jsSrc;
			if (fjs && fjs.parentNode) {
				fjs.parentNode.insertBefore(js, fjs);
			} else {
				d.head.appendChild(js);
			}
			js.onload = cb;
		})(document, 'script', 'google-login', () => {
			const params = {
				client_id: clientId,
				cookie_policy: cookiePolicy,
				login_hint: loginHint,
				hosted_domain: hostedDomain,
				fetch_basic_profile: fetchBasicProfile,
				discoveryDocs,
				ux_mode: uxMode,
				redirect_uri: redirectUri,
				scope,
				access_type: accessType
			};

			window.gapi.load('auth2', () => {
				this.enableButton();
				if (!window.gapi.auth2.getAuthInstance()) {
					window.gapi.auth2.init(params).then(
						res => {
							if (isSignedIn && res.isSignedIn.get()) {
								this.handleSigninSuccess(res.currentUser.get());
							}
						},
						err => onFailure(err)
					);
				}
			});
		});
	}

	componentWillUnmount() {
		this.enableButton = () => {};
	}

	enableButton() {
		this.setState({
			disabled: false
		});
	}

	signOutThen(data) {
		this.auth2
			.disconnect()
			.then(this.props.onSuccess)
			.catch(data => {
				console.log('google-logout: catch in disconnect promise ');

				if (this.props.onFailure != null) {
					this.props.onFailure();
				}
			});
	}

	signOut() {
		if (this.props.onClick != null) {
			this.props.onClick();
		}

		if (window.gapi) {
			this.auth2 = window.gapi.auth2.getAuthInstance();

			if (this.auth2 != null) {
				if (this.auth2.signOut == null) {
					console.log('google-logout: signOut is null ');
				}

				this.auth2
					.signOut()
					.then(this.signOutThen.bind(this))
					.catch(data => {
						console.log('google-logout: catch in signOut promise ');

						if (this.props.onFailure != null) {
							this.props.onFailure();
						}
					});
			} else {
				console.log('google-logout: auth2 is null');
			}
		}
	}

	render() {
		const { tag, type, className, disabledStyle, buttonText, children, render, theme, icon } = this.props;

		if (render) {
			return render({ onClick: this.signOut });
		}

		const disabled = this.state.disabled || this.props.disabled;

		const defaultStyle = getDefaultStyle(disabled, this.state.active, this.state.hovered, theme, disabledStyle);

		const GoogleLogoutButton = React.createElement(
			tag,
			{
				onMouseEnter: () => this.setState({ hovered: true }),
				onMouseLeave: () => this.setState({ hovered: false, active: false }),
				onMouseDown: () => this.setState({ active: true }),
				onMouseUp: () => this.setState({ active: false }),
				onClick: this.signOut,
				style: defaultStyle,
				type,
				disabled,
				className
			},
			[
				icon && <Icon key={1} active={this.state.active} />,
				<ButtonContent icon={icon} key={2}>
					{children || buttonText}
				</ButtonContent>
			]
		);

		return GoogleLogoutButton;
	}
}

GoogleLogout.propTypes = {
	jsSrc: PropTypes.string,
	buttonText: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node,
	disabledStyle: PropTypes.object,
	tag: PropTypes.string,
	disabled: PropTypes.bool,
	onLogoutSuccess: PropTypes.func,
	type: PropTypes.string,
	render: PropTypes.func,
	theme: PropTypes.string,
	icon: PropTypes.bool
};

GoogleLogout.defaultProps = {
	type: 'button',
	tag: 'button',
	buttonText: 'Logout of Google',
	disabledStyle: {
		opacity: 0.6
	},
	icon: true,
	theme: 'light',
	jsSrc: 'https://apis.google.com/js/api.js'
};

export default GoogleLogout;
