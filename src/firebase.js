import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDGtg2SjGffqPUXdk5aS88PjOXLQOxk_uM",
    authDomain: "instagram-clone-2aa6d.firebaseapp.com",
    databaseURL: "https://instagram-clone-2aa6d.firebaseio.com",
    projectId: "instagram-clone-2aa6d",
    storageBucket: "instagram-clone-2aa6d.appspot.com",
    messagingSenderId: "190814994976",
    appId: "1:190814994976:web:7e0ae968f5bcee0831b245",
    measurementId: "G-5Y12MFX7B2"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
