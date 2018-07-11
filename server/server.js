const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request-promise');
const port = 3001;
// const promisePoller = require('promise-poller').default;

app.use(cors())

app.get('/api/setdata/:setId', (req, res) => {

	const setDataOptions = {
		method: 'GET',
		uri: 'https://api.smash.gg/set/' + req.params.setId + '?expand%5B%5D=setTask',
		json: true
	}

	request(setDataOptions)
		.then(response => {
			res.send({currentSet: response.entities.sets})
		})
		.catch(error => {
			console.log(error);
			res.send({message: 'error with set data api call'})
		})
});



/*
*
*
* * * * LANDING NO AUTH ENDPOINT * * * *
*
*
*/



app.get('/api/tournament/:url', (req, res) => {

	const tournamentIdOptions = {
		method: 'GET',
		uri: 'https://api.smash.gg/tournament/' + req.params.url,
		json: true
	}

	// const checkSetQueue = (tournamentId, streamId) => {
	// 	return new Promise((res, rej) => {
			
	// 	})
	// }

	request(tournamentIdOptions)
		.then(response => {
			const stationQueueOptions = {
				method: 'GET',
				uri: 'https://api.smash.gg/station_queue/' + response.entities.tournament.id,
				json: true
			}

			request(stationQueueOptions)
				.then(resp => {
					const streams = resp.data.entities.stream

					res.send({streams});
				})
				.catch(err => {
					console.log(err);
					res.send({message: 'error with station queue api call'});
				})
		})
		.catch(err => {
			console.log(err);
			res.send({message: 'error with tournament slug api call'});
		});
});



/*
*
*
* * * * NO AUTH ENDPOINT * * * *
*
*
*/



app.get('/api/tournament/:slug/stream/:streamName', (req, res) => {

	const payload = {
		playerOne: 'Player One',
		playerTwo: 'Player Two',
		roundInfo: 'Bracket'
	}
	const tournamentIdOptions = {
		method: 'GET',
		uri: 'https://api.smash.gg/tournament/' + req.params.slug,
		json: true
	}

	request(tournamentIdOptions)
		.then(response => {
			const stationQueueOptions = {
				method: 'GET',
				uri: 'https://api.smash.gg/station_queue/' + response.entities.tournament.id,
				json: true
			}

			request(stationQueueOptions)
				.then(resp => {
					const streams = resp.data.entities.stream
					const queues = resp.queues
					const myStreamArr = streams.filter(stream => {
						return stream.streamName.toUpperCase() === req.params.streamName.toUpperCase();
					})
					const myStream = myStreamArr[0];
					const currentSetId = queues[myStream.id][0];

					const setDataOptions = {
						method: 'GET',
						uri: 'https://api.smash.gg/set/' + currentSetId + '?expand%5B%5D=setTask',
						json: true
					}

					request(setDataOptions)
						.then(response => {
							const set = response.entities.sets;
							const entrants = resp.data.entities.entrants;
							const players = entrants.filter(entrant => {
								return entrant.id === set.entrant1Id || entrant.id === set.entrant2Id;
							})

							payload.roundInfo = response.entities.sets.fullRoundText;
							payload.playerOne = players[0].name;
							payload.playerTwo = players[1].name;

							res.send({payload})
						})
						.catch(error => {
							res.send({message: 'error with set data api call', error: error})
						})

				})
				.catch(err => {
					console.log(err);
					res.send({message: 'error with station queue api call', error: err});
				})
		})
		.catch(err => {
			console.log(err);
			res.send({message: 'error with tournament slug api call', error: err});
		});
});

app.listen(port, () => {
	console.log(`its bonertime on port ${port} bros`)
});