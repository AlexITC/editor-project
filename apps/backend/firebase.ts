import { ServiceAccount } from 'firebase-admin'
import app from 'firebase-admin';
import firestore from 'firebase-admin';

// Replace this file with your service account key you get when setting up a firestore.
import serviceAccount from './serviceAccountKey.json'

console.log('initialize app');
app.initializeApp({
  credential: app.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://databaseName.firebaseio.com"
})

export default firestore.firestore()
