import React, { Component } from 'react';
import 'babel-polyfill';
import SelectStream from './SelectStream';
import SignUp from './SignUp';
import SignIn from './SignIn';

export default class Landing extends Component<{}> {
	constructor(props) {
		super(props)
		this.slug = React.createRef();

		this.state = {
			signIn: false,
			slug: null,
			streams: null,
			tournamentId: null
		}
	}

	getStreamStations = () => {
		const slug = this.slug.current.value;
		this.generateStreamStations()
      .then(({streams, tournamentId}) => {
      	this.setState({slug: slug, tournamentId: tournamentId, streams: streams});
      })
      .catch((err) => {
      	console.log(err);
      });
	}

	generateStreamStations = async () => {
    const response = await fetch('http://localhost:3001/api/tournament/'+this.slug.current.value);
    const body = await response.json();
    return body;
  }

  keyPress = (e) => {
  	if (e.keyCode === 13) {
  		e.preventDefault();
  		this.getStreamStations();
  	}
  }

	render() {

		const streamDropdown = this.state.streams ? <SelectStream {...this.state} /> : null;
		const formSwitchText = this.state.signIn ? "Don't have an account?" : "Already have an account?";
		const whichForm = this.state.signIn ? <SignIn /> : <SignUp />

		return(
			<div
				style={{margin: '20px', padding: '10px', border: '1px solid black'}}
			>
				<a 
					href="javascript:;"
					onClick={() => this.setState({signIn: !this.state.signIn})}
				>
					{formSwitchText}
				</a>
				{whichForm}
				<p>Copy and paste the tournament's slug from Smash.gg. The slug can be found by visiting your tournament's Smash.gg page and checking the URL -> "http://smash.gg/tournament/<span style={{color: 'red'}}>YOUR-SLUG-HERE</span>"!</p>
				<input 
					type="text" 
					placeholder="Tournament Slug"
					ref={this.slug}
					onKeyDown={this.keyPress}
				/>
				<button
					onClick={this.getStreamStations}
				>
					Submit
				</button>
				{ streamDropdown }
			</div>
		)
	}
}

