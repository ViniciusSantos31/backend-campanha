import admin from 'firebase-admin';

import firebaseConfig from '../config/firebase.json';

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();

