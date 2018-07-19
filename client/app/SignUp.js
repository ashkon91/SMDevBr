import React from 'react';
import SignUpForm from './SignUpForm';

const SignUp = () => {
	return(
		<div
			style={{margin: '20px', padding: '10px', border: '1px solid black'}}
		>
			<h2>Sign up!</h2>
			<SignUpForm />
		</div>
	)
}

export default SignUp;