import React, { Component } from 'react';
import Nameplate from './Nameplate';
import Round from './Round';
import './_root.scss';

export default class Overlay extends Component<{}> {
	constructor(props) {
		super()

		this.state = {
			roundInfo: null,
			playerOne: null,
			playerTwo: null
		}
	}

	componentDidMount() {
		this.pollTournamentEndpoint(this.props.match.params.slug, this.props.match.params.streamName);
	}

	pollTournamentEndpoint = (slug, streamName) => {
		this.getTournamentData(slug, streamName)
			.then(({payload}) => {
				this.setState({roundInfo: payload.roundInfo, playerOne: payload.playerOne, playerTwo: payload.playerTwo})
			})
			.catch(err => {
				console.log(err);
			});
	}

	getTournamentData = async (slug, streamName) => {
		const response = await fetch('http://localhost:3001/api/test/tournament/' + slug + '/stream/' + streamName);
		const body = await response.json();
		return body;
	}

	render() {
		return(
			<div className="overlay">
				<Nameplate playerName={this.state.playerOne} color='white' xPos='500px'/>
				<Round round={this.state.roundInfo}/>
				<Nameplate playerName={this.state.playerTwo} color='white' xPos='1300px'/>
			</div>
		)
	}
}