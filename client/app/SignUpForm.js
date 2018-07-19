import React, { Component } from 'react';

const formatPropAsKey = (key, value) => {
	return {[key]: value}
}

export default class SignUpForm extends Component<{}> {
	constructor(props) {
		super(props)

		this.state = {
			username: '',
			email: '',
			passwordOne: '',
			passwordTwo: '',
			error: null
		}
	}

	handleSubmit = e => {

	}

	render() {
		return(
			<form
				onSubmit={e => {e.preventDefault();}}
			>
				<input
					type="text"
					value={this.state.username}
					onChange={e => this.setState(formatPropAsKey('username', e.target.value))}
					placeholder="Username"
				/><br />
				<input
					type="text"
					value={this.state.email}
					onChange={e => this.setState(formatPropAsKey('email', e.target.value))}
					placeholder="Email address"
				/><br />
				<input
					type="password"
					value={this.state.passwordOne}
					onChange={e => this.setState(formatPropAsKey('passwordOne', e.target.value))}
					placeholder="Password"
				/><br />
				<input
					type="password"
					value={this.state.passwordTwo}
					onChange={e => this.setState(formatPropAsKey('passwordTwo', e.target.value))}
					placeholder="Re-enter password"
				/><br />
				<button>Submit</button>
			</form>
		)
	}
}