const setTournamentURL = newURL => {
	return {
		type: 'SET_TOURNAMENT',
		payload: {
			newURL
		}
	}
}

export default {
	setTournamentURL
}