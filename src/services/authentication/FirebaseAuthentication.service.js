import * as firebase from "firebase";

//* This service provides helper functions to handle firebase requests.
//* Only the login request is here for now, but other firebase auth requests
//* should also be handled using helper functions on this file.
export const loginRequest = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);
