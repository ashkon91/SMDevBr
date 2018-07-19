import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { rootRef, tournamentRef } from './firebase.js';
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
			tournamentId: props.match.params.tournamentId,
			streamId: props.match.params.streamId,
			slug: props.match.params.slug,
			pollAttempts: 0
		}

		this.myTournamentRef = tournamentRef.child(props.match.params.tournamentId);
	}

	componentDidMount() {
		//create firebase listeners
		this.myTournamentRef.on('child_changed', snapshot => {
			if (snapshot.key == 'streams') {
				this.newPayload(snapshot.val());
			}
		});

		//express api init endpoint
		this.state.roundInfo ? console.log('initTournament was not run') : this.initTournament(this.props.match.params.tournamentId, this.props.match.params.streamId, this.props.match.params.slug);
	}

	newPayload = snap => {
		let streamId = this.state.streamId;
		let payload = snap[streamId][0];
		this.setState(payload);
	}

	startPolling = server => {
		let polling = setInterval(() => {
			fetch('http://localhost:3001/api/poll/' + this.state.tournamentId);
			this.setState({pollAttempts: this.state.pollAttempts + 1}, () => {console.log(`smashgg has been polled ${this.state.pollAttempts} times`)});
		}, 60000);
	}

	initTournament = (tournamentId, streamId, slug) => {
		this.getTournamentData(tournamentId, streamId, slug)
			.then((payload) => {
				this.setState(payload, () => {
					this.startPolling();
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	getTournamentData = async (tournamentId, streamId, slug) => {
		const response = await fetch('http://localhost:3001/api/init/' + tournamentId + '/tournament/' + slug + '/stream/' + streamId);
		const body = await response.json();
		return body;
	}

	render() {
		console.log('rendered');
		return(
			<div className="overlay">
				<Nameplate playerName={this.state.playerOne} color='white' xPos='500px'/>
				<Round round={this.state.roundInfo}/>
				<Nameplate playerName={this.state.playerTwo} color='white' xPos='1300px'/>
			</div>
		)
	}
}