import { db } from './firebase.js';

export const rootRef = db.ref();
export const tournamentRef = db.ref('tournaments');