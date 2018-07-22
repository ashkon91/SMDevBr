import React, { Component } from 'react';
import { auth } from './firebase/index.js';

const formatPropAsKey = (key, value) => {
	return {[key]: value}
}

const initialState = {
		username: '',
		email: '',
		passwordOne: '',
		passwordTwo: '',
		error: null
	}

export default class SignUpForm extends Component<{}> {
	constructor(props) {
		super(props)

		this.state = {...initialState}
	}

	handleSubmit = e => {
		auth.createUser(this.state.email, this.state.passwordOne)
			.then(user => {
				console.log(user);
				this.setState({...initialState});
			})
			.catch(err => {
				this.setState(formatPropAsKey('error', err));
			})
		e.preventDefault();
	}

	render() {
		const invalid = 
      this.state.passwordOne !== this.state.passwordTwo ||
      this.state.passwordOne === '' ||
      this.state.email === '' ||
      this.state.username === '';

		return(
			<div>
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
				<button 
					disabled={invalid}
					type="button"
					onClick={e => this.handleSubmit(e)}
				> 
					Submit 
				</button>
				{ this.state.error && <p style={{color: 'red'}}>{this.state.error.message}</p> }
			</div>
		)
	}
}