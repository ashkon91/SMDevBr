module.exports = formatter = (queue, sets, players) => {	
	const pL = {};
	const qCopy = Object.assign({}, queue);
	for (let key in qCopy) {
		let pArr = [];
		for (let i = 0; i < qCopy[key].length; i++) {
			let pKey = key;
			sets.forEach(set => {
				if (set.id == qCopy[key][i]) {
					let pObj = {playerOne: 'Player One', playerTwo: 'Player Two', roundInfo: 'Bracket'};
					players.forEach(player => {
						if (player.id == set.entrant1Id) {
							pObj.playerOne = player.name;
						}
						else if (player.id == set.entrant2Id) {
							pObj.playerTwo = player.name;
						}
					})
					pObj.roundInfo = set.fullRoundText;
					pArr.push(pObj);
				}
			})
			pL[pKey] = pArr;
		}
	}
	return pL;
}