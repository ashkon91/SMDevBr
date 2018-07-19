const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request-promise');
const admin = require('firebase-admin');
const formatter = require('./utils/formatTournamentObject.js');
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

//firebase node refs
const rootRef = db.ref();
const userRef = db.ref("users");
const tournamentRef = db.ref("tournaments");



/*
*
*
* * * * FIRST HTTP REQUEST TO INIT APP * * * *
*
*
*
*/



app.get('/api/init/:tournamentId/tournament/:slug/stream/:streamId', (req, res) => {
	const stationQueueOptions = {
		method: 'GET',
		uri: 'https://api.smash.gg/station_queue/' + req.params.tournamentId,
		json: true
	}
	request(stationQueueOptions)
		.then(resp => {
			//compose initial variables containing sgg api data to be restructured
			const streams = resp.data.entities.stream;
			const initQueues = resp.queues;
			const players = resp.data.entities.entrants;
			const initSets = resp.data.entities.sets;

			//rebuild tournament sets path with payloads ready to go!
			const deliverable = formatter(initQueues, initSets, players);

			//firebase ref declarations
			const tournamentKey = req.params.tournamentId;
			const tournRefKey = tournamentRef.child(tournamentKey);
			// const updatedTournData = {};

			// the 2 lines below are for multi-location updates, which we will have to do once auth and users come into exist
			// updatedTournData["user/"+userId+"/tournaments/" + tournamentKey] = true;
			// updatedTournData["tournaments/" + tournamentKey] = {
			const updatedTournData = {
				slug: req.params.slug,
				streams: deliverable
			};

			//get my stream payload
			const streamId = req.params.streamId;
			const payload = deliverable[streamId][0];
			console.log(payload);

			//write tournament object to firebase
			tournRefKey.update(updatedTournData, err => {
				if (err) {
					console.log(err, 'error returned while attempting to write data to firebase');
					res.sendStatus(500);
				} 
				else {
					console.log('tournament data uploaded successfully');
					res.send(payload);
				}});


		})
		.catch(err => {
			console.log(err);
			res.sendStatus(500);
		})
})



/*
*
*
* * * * POLL REQUEST FIRED EVERY 60s * * * *
*
*
*/



app.get('/api/poll/:tournamentId', (req, res) => {

	const stationQueueOptions = {
		method: 'GET',
		uri: 'https://api.smash.gg/station_queue/' + req.params.tournamentId,
		json: true
	}
	request(stationQueueOptions)
		.then(resp => {
			//compose initial variables containing sgg api data to be restructured
			const streams = resp.data.entities.stream;
			const formattedQueues = resp.queues;
			const players = resp.data.entities.entrants;
			const initSets = resp.data.entities.sets;

			//rebuild tournament sets path with payloads ready to go!
			const deliverable = formatter(formattedQueues, initSets, players);

			//firebase ref declarations
			const tournamentKey = req.params.tournamentId;
			const tournRefKey = tournamentRef.child(tournamentKey);
			// const updatedTournData = {};

			// the 2 lines below are for multi-location updates, which we will have to do once auth and users come into exist
			// updatedTournData["user/"+userId+"/tournaments/" + tournamentKey] = true;
			// updatedTournData["tournaments/" + tournamentKey] = {
			const updatedTournData = {
				streams: deliverable
			};

			//write tournament object to firebase
			tournRefKey.update(updatedTournData, err => {
				if (err) {
					res.sendStatus(500);
					console.log(err, 'error returned while attempting to write data to firebase');
				} 
				else {
					res.sendStatus(200);
					console.log('smashgg polled and firebase updated successfully');
				}});
		})
		.catch(err => {
			res.sendStatus(500);
			console.log(err);
		})
});



/*
*
*
* * * * RETURN TOURNAMENT ID & STREAMLIST * * * *
*
*
*/



app.get('/api/tournament/:slug', (req, res) => {
	const tournamentIdOptions = {
		method: 'GET',
		uri: 'http://api.smash.gg/tournament/' + req.params.slug,
		json: true
	}
	request(tournamentIdOptions)
		.then(resp => {
			const tournamentId = resp.entities.tournament.id;
			const stationQueueOptions = {
				method: 'GET',
				uri: 'http://api.smash.gg/station_queue/' + tournamentId,
				json: true
			}
			request(stationQueueOptions)
				.then(response => {
					const streams = response.data.entities.stream;
					res.send({tournamentId: tournamentId, streams: streams});
				})
				.catch(err => {
					console.log(err);
					res.sendStatus(500);
				})
		})
		.catch(error => {
			console.log(error);
			res.sendStatus(500);
		})
})



/*
*
*
* * * * TEST ROUTE * * * *
*
*
*/



app.get('/api/test/tournament/:slug/stream/:streamName', (req, res) => {

	//first api call to get tournament id
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

					//compose initial variables containing sgg api data to be restructured
					const streams = resp.data.entities.stream;
					const initQueues = resp.queues;
					const players = resp.data.entities.entrants;
					const initSets = resp.data.entities.sets;

					//get my stream
					const myStreamArr = streams.filter(stream => {
						return stream.streamName.toUpperCase() === req.params.streamName.toUpperCase();
					});
					const myStream = myStreamArr[0];
					const nextSetId = initQueues[myStream.id][0];

					//firebase ref declarations
					const tournamentKey = response.entities.tournament.id;
					const tournRefKey = tournamentRef.child(tournamentKey);
					// const updatedTournData = {};

					//create new stream data object
					const formattedStreams = formatter(streams, 'streams');

					//create new formatted players object
					const formattedPlayers = formatter(players, 'players');

					//create new sets object
					const formattedSets = {};
					for (let i = 0; i < initSets.length; i++) {
						let setObj = initSets[i];
						let newObj = {};
						newObj.playerOne = setObj.entrant1Id || 'Player 1';
						newObj.playerTwo = setObj.entrant2Id || 'Player 2';
						newObj.roundInfo = setObj.fullRoundText;
						formattedSets[setObj.id] = newObj;
					}
					// const formattedSots = formatter(initSets, 'sets'); BORKED FOR SOME UNIDENTIFIABLE REASON

					// updatedTournData["user/"+userId+"/tournaments/" + tournamentKey] = true;
					// updatedTournData["tournaments/" + tournamentKey] = {
					const updatedTournData = {
						slug: req.params.slug,
						streams: formattedStreams,
						queues: initQueues,
						players: formattedPlayers,
						sets: formattedSets
					};

					//construct set payload 
					// --- WRITE UTIL FOR THIS CUZ WE'RE GONNA HAVE TO DO IT A LOT ---
					const nextSet = formattedSets[nextSetId];
					const {playerOne = 'Player One', playerTwo = 'Player Two', roundInfo = 'Bracket'} = payload;
					for (let key in nextSet) {
						let playerId = nextSet[key];
						payload[key] = formattedPlayers[playerId];
					}
					payload.roundInfo = nextSet.roundInfo;

					//write tournament object to firebase
					tournRefKey.update(updatedTournData, err => {
						if (err) {
							res.sendStatus(500);
						} 
						else {
							console.log('tournament data uploaded successfully');
							res.send(payload);
						}});


				})
				.catch(err => {
					console.log(err);
					res.sendStatus(500);
				})
		})
		.catch(err => {
			console.log(err);
			res.sendStatus(500);
		});
});

const server = app.listen(port, () => {
	console.log(`its bonertime on port ${port} bros`);
});




