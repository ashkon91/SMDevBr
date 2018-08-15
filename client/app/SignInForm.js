import React, { Component } from 'react';
import { auth } from './firebase/index.js';
// import { auth as authObj } from './firebase/firebase.js';

const formatPropAsKey = (key, value) => {
	return {[key]: value}
}

const initialState = {
	email: '',
	password: '',
	error: null
}

export default class SignInForm extends Component<{}> {
	constructor(props) {
		super(props)

		this.state = {...initialState}
	}

	handleSubmit = e => {
		auth.signInUser(this.state.email, this.state.password)
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
			this.state.email === '' || 
			this.state.password === '';

		return(
			<div>
				<input 
					type="text" 
					placeholder="Email" 
					value={this.state.email}
					onChange={e => this.setState(formatPropAsKey('email', e.target.value))}/>
				<br />
				<input 
					type="password" 
					placeholder="Password" 
					value={this.state.password}
					onChange={e => this.setState(formatPropAsKey('password', e.target.value))}/>
				<br />
				<button
					type="button"
					disabled={invalid}
					onClick={e => this.handleSubmit(e)}
				>
					Sign In
				</button>
				{ this.state.error && <p style={{color: 'red'}}> {this.state.error.message} </p> }
			</div>
		)
	}
}