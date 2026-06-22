import React, { useState, createContext } from "react";
import * as firebase from "firebase";

import { loginRequest } from "./FirebaseAuthentication.service";

//* Context for firebase login feature
//* Use data from QR code to help with the Firebase login flow
export const FirebaseAuthenticationContext = createContext();

export const FirebaseAuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [error, setError] = useState(null);

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setFirebaseUser(currentUser);
    }
    setIsLoading(false);
  });

  async function onLogin(email, password) {
    setIsLoading(true);
    try {
      const currentUser = await loginRequest(email, password);
      setFirebaseUser(currentUser);
      setIsLoading(false);
    } catch (err) {
      setError(err.toString());
      setIsLoading(false);
    }
  }

  function onLogout() {
    setFirebaseUser(null);
    firebase.auth().signOut();
  }

  return (
    <FirebaseAuthenticationContext.Provider
      value={{
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        isLoading,
        error,
        onLogin,
        onLogout,
      }}>
      {children}
    </FirebaseAuthenticationContext.Provider>
  );
};
