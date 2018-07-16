import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import Nameplate from './Nameplate';
import Round from './Round';
import './_root.scss';

export default class Overlay extends Component<{}> {
	constructor(props) {
		super()

		this.state = {
			roundInfo: null,
			playerOne: null,
			playerTwo: null,
			tournamentId: null,
			streamId: null
		}
	}

	componentDidMount() {
		//init socket.io connection
		const server = socketIOClient(`http://192.168.1.90:3001`);
		this.state.tournamentId ? console.log('id already init') : server.emit('initializeSR', {slug: this.props.match.params.slug, streamName: this.props.match.params.streamName});
		
		server.on('initialized', payload => {
			this.setState(payload);
			this.startPolling(server);
		});

		server.on('updated', payload => {
			this.setState(payload);
		})


		//express api init endpoint
		// this.pollTournamentEndpoint(this.props.match.params.slug, this.props.match.params.streamName);
	}

	startPolling = server => {
		let polling = setInterval(() => {server.emit('poll', this.state.tournamentId)}, 60000)
	}

	pollTournamentEndpoint = (slug, streamName) => {
		this.getTournamentData(slug, streamName)
			.then(({playerOne, playerTwo, roundInfo}) => {
				this.setState({roundInfo: roundInfo, playerOne: playerOne, playerTwo: playerTwo})
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