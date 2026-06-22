import * as firebase from "firebase";
import "firebase/database";
import "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDKTctmhw6lyCxxtb04xx2jERLriE_BIGQ",
  authDomain: "fishappproj.firebaseapp.com",
  databaseURL: "https://fishappproj-default-rtdb.firebaseio.com",
  projectId: "fishappproj",
  storageBucket: "fishappproj.appspot.com",
  messagingSenderId: "175974153365",
  appId: "1:175974153365:web:8995d08d6b523aa4a1af9c",
  measurementId: "G-6SQV7ZEXK5",
};

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    return firebase.initializeApp(firebaseConfig);
  } else {
    return firebase; // if already initialized, use that one
  }
};

export const db = initializeFirebase().database().ref("/");
// export const db = firebase.database().ref("/");

export const storage = initializeFirebase().storage().ref("latestCatch");
// export const storage = firebase.storage().ref("/");
