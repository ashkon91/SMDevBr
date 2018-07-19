import { auth } from './firebase.js';

export const createUser = (email, password) => {
	auth.createUserWithEmailAndPassword(email, password);
}

export const signInUser = (email, password) => {
	auth.signInWithEmailAndPassword(email, password);
}

export const signOutuser = (email, password) => {
	auth.signOut();
}

export const passwordReset = (email) => {
	auth.sendPasswordResetEmail(email);
}

export const passwordUpdate = (password) => {
	auth.currentUser.updatePassword(password);
}