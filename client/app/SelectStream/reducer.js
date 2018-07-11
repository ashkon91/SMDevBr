const tournamentURL = (state = 'smash.gg/tournament/ashkon-testerino-please-no-copypastarino', action) => {
	switch (action.type) {
		case 'SET_TOURNAMENT':
			return action.newURL
		default:
			return state
	}
}

export default tournamentURL