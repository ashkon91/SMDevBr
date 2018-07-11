import React, { Component } from 'react';
import request from 'superagent';
import 'babel-polyfill';
import SelectStream from './SelectStream';

export default class Landing extends Component<{}> {
	constructor(props) {
		super(props)
		this.tournamentSlug = React.createRef();

		this.state = {
			tournamentSlug: null,
			streamList: null
		}
	}

	getStreamStations = () => {
		const slug = this.tournamentSlug.current.value;
		this.generateStreamStations()
      .then(({streams}) => {
      	this.setState({tournamentSlug: slug, streamList: streams})
      })
      .catch((err) => {
      	console.log(err);
      });
	}

	generateStreamStations = async () => {
    const response = await fetch('http://localhost:3001/api/tournament/'+this.tournamentSlug.current.value);
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

		const streamDropdown = this.state.streamList ? <SelectStream streams={this.state.streamList} tournamentSlug={this.state.tournamentSlug}/> : null;

		return(
			<div
				style={{margin: '20px', padding: '10px', border: '1px solid black'}}
			>
				<p>Copy and paste the tournament's slug from Smash.gg. The slug can be found by visiting your tournament's Smash.gg page and checking the URL -> "http://smash.gg/tournament/<span style={{color: 'red'}}>YOUR-SLUG-HERE</span>"!</p>
				<input 
					type="text" 
					placeholder="Tournament Slug"
					ref={this.tournamentSlug}
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

