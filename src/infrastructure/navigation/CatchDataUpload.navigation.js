//* Stack Navigation for Catch Data Upload
//! Requires internet connection upon app startup,
//! meaning the app needs an initial connection
//! even for offline features
//TODO: Isolate this feature from offline features of the app
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FirebaseLogin from "../../features/CatchDataUpload/screens/FirebaseLogin.screen";
import CatchDataUpload from "../../features/CatchDataUpload/screens/CatchDataUpload.screen";

import { FirebaseAuthenticationContextProvider } from "../../services/authentication/FirebaseAuthentication.context";

// import { initializeFirebase } from "../../config/firebase.config";

const Stack = createStackNavigator();

// initializeFirebase();

function CatchDataUploadStack() {
  return (
    <FirebaseAuthenticationContextProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="FirebaseLogin"
          component={FirebaseLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CatchDataUpload"
          component={CatchDataUpload}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </FirebaseAuthenticationContextProvider>
  );
}

export default CatchDataUploadStack;
