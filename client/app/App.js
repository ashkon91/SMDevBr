import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import Landing from './Landing';
import Overlay from './Overlay';
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
				<Route path="/streamrunner" exact component={Landing} />
				<Route path="/streamrunner/:slug/:streamName" exact component={Overlay} />
			</div>
		)
	}
}