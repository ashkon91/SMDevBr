module.exports = formatter = (arr, type) => {

	const types = {
		streams: 'streamName',
		players: 'name',
		sets: ['player1Id', 'player2Id', 'fullRoundText']
	}
	const formattedObj = {};

	if (type == 'streams' || 'players') {

		const desiredKey = types[type];

		for (let i = 0; i < arr.length; i++) {
			let ind = arr[i];
			formattedObj[ind.id] = ind[desiredKey];
		}
		return formattedObj;
	}
	else if (type == 'sets') {

		for (let i = 0; i < arr.length; i++) {
			let ind = arr[i];
			formattedObj[ind.id] = [ind.player1Id, ind.player2Id, ind.fullRoundText];
		}
		return formattedObj;
	}
	else {
		throw new Error(`Formatter type parameter "${type}" is invalid`);
	}
}