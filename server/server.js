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



/*
*
*
* * * SOCKET.IO * * *
*
*
*/



const server = app.listen(port, () => {
	console.log(`its bonertime on port ${port} bros`);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
	console.log(`initializing streamrunner on socket ${socket.id}`);
	socket.on('initializeSR', async ({slug, streamName}) => {
		console.log(`fetching data for tournament ${slug} and stream ${streamName}`);
		// const 

	});
});







