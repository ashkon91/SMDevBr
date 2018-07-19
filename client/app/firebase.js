import { firebase } from '@firebase/app';
import '@firebase/database';

const config = {
	apiKey: "AIzaSyCRun2iuUvUYsdwwvK2wVhMc8jCHx88MPA",
	authDomain: "streamrunner-24c68.firebaseapp.com",
	databaseURL: "https://streamrunner-24c68.firebaseio.com",
	projectId: "streamrunner-24c68",
	storageBucket: "streamrunner-24c68.appspot.com",
	messagingSenderId: "547286407961"
};

firebase.initializeApp(config);

const db = firebase.database();

export const rootRef = db.ref();
export const tournamentRef = db.ref('tournaments');