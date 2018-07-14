const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request-promise');
const admin = require('firebase-admin');
const port = 3001;

//firebase init
const serviceAccount = process.env.MY_CREDENTIALS;
admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(serviceAccount)),
	databaseURL: 'https://streamrunner-24c68.firebaseio.com/'
})
const db = admin.database();

//middleware
app.use(cors())



/*
*
*
* * * * TEST ROUTE * * * *
*
*
*/



//firebase node refs
const rootRef = db.ref();
const userRef = db.ref("users");
const tournamentRef = db.ref("tournaments");
const setRef = db.ref("sets");

app.get('/api/test/tournament/:slug/stream/:streamName', (req, res) => {

	//first api call to get tournament id
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

			//2nd api call to get tournament station queue info
			const stationQueueOptions = {
				method: 'GET',
				uri: 'https://api.smash.gg/station_queue/' + response.entities.tournament.id,
				json: true
			}
			request(stationQueueOptions)
				.then(resp => {
					//old api pinging code, remove or repurpose
					const streams = resp.data.entities.stream;
					const initQueues = resp.queues;
					const players = resp.data.entities.entrants;
					const initSets = resp.data.entities.sets;
					const myStreamArr = streams.filter(stream => {
						return stream.streamName.toUpperCase() === req.params.streamName.toUpperCase();
					});
					const myStream = myStreamArr[0];
					const currentSetId = initQueues[myStream.id][0];



					//firebase test stuff
					const tournamentKey = response.entities.tournament.id;
					const tournRefKey = tournamentRef.child(tournamentKey);
					// const updatedTournData = {};

					//create new stream data object
					const streamData = {};
					for (let i = 0; i < streams.length; i++) {
						let streamId = streams[i].id;
						streamData[streamId] = streams[i].streamName;
					}

					//create new formatted players object
					const formattedPlayers = {};
					for (let i = 0; i < players.length; i++) {
						let playerObj = players[i];
						formattedPlayers[playerObj.id] = playerObj.name;
					}

					//create new sets object
					const formattedSets = {};
					for (let i = 0; i < initSets.length; i++) {
						let setObj = initSets[i];
						formattedSets[setObj.id] = [setObj.entrant1Id, setObj.entrant2Id, setObj.fullRoundText];
					}

					// updatedTournData["user/"+userId+"/tournaments/" + tournamentKey] = true;
					// updatedTournData["tournaments/" + tournamentKey] = {
					const updatedTournData = {
						slug: req.params.slug,
						streams: streamData,
						queues: initQueues,
						players: formattedPlayers,
						sets: formattedSets
					};

					// console.log(formattedSets);
					tournRefKey.update(updatedTournData);

					// //3rd api call to get set data -- is this necessary? --
					// const setDataOptions = {
					// 	method: 'GET',
					// 	uri: 'https://api.smash.gg/set/' + currentSetId + '?expand%5B%5D=setTask',
					// 	json: true
					// }
					// request(setDataOptions)
					// 	.then(response => {
					// 		const set = response.entities.sets;
					// 		const entrants = resp.data.entities.entrants;
					// 		const players = entrants.filter(entrant => {
					// 			return entrant.id === set.entrant1Id || entrant.id === set.entrant2Id;
					// 		})

					// 		payload.roundInfo = response.entities.sets.fullRoundText;
					// 		payload.playerOne = players[0].name;
					// 		payload.playerTwo = players[1].name;

					// 		res.send({payload})
					// 	})
					// 	.catch(error => {
					// 		res.send({message: 'error with set data api call', error: error})
					// 	})

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


})

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