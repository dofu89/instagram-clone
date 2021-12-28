import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyC9ShUlYFFKVU3QDEfckcX4_V552B72xSo',
  authDomain: 'instagram-clone-c0eee.firebaseapp.com',
  projectId: 'instagram-clone-c0eee',
  storageBucket: 'instagram-clone-c0eee.appspot.com',
  messagingSenderId: '117470913781',
  appId: '1:117470913781:web:3656d45e391420537851bc',
  measurementId: 'G-B4TBYL7991',
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }
