import { firebase } from '@firebase/app';
import '@firebase/database';
import '@firebase/auth';

const config = {
	apiKey: "AIzaSyCRun2iuUvUYsdwwvK2wVhMc8jCHx88MPA",
	authDomain: "streamrunner-24c68.firebaseapp.com",
	databaseURL: "https://streamrunner-24c68.firebaseio.com",
	projectId: "streamrunner-24c68",
	storageBucket: "streamrunner-24c68.appspot.com",
	messagingSenderId: "547286407961"
};

if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

export const auth = firebase.auth();

export const db = firebase.database();