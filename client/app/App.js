import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Landing from './Landing';
import Overlay from './Overlay';
import SignUp from './SignUp';
import './_root.scss';	

export default class App extends Component<{}> {
	constructor() {
		super()

		this.state = {
			
		}
	}

	render() {
		return(
			<div>
				<Route path="/streamrunner" component={SignUp} />
				<Route path="/streamrunner" exact component={Landing} />
				<Route path="/streamrunner/:slug/:tournamentId/:streamId" exact component={Overlay} />
			</div>
		)
	}
}