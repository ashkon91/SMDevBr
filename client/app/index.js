import React from 'react';
import { render } from 'react-dom';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import streamrunnerApp from './reducerRoot.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import App from './App';

// let store = createStore(streamrunnerApp, window.devToolsExtension ? window.devToolsExtension() : f => f)

render(
	<Router>
		<App />
	</Router>, document.getElementById('root')
)