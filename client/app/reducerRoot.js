/*
state: 
{
	tournamentURL: ''
}
*/

import { combineReducers } from 'redux';
import { default as tournamentURL } from './SelectStream/reducer'

const streamrunnerApp = combineReducers({
	tournamentURL
})

export default streamrunnerApp