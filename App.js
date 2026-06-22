import * as React from "react";
import "react-native-get-random-values";
import { ThemeProvider } from "styled-components/native";
import { LogBox, ScrollViewBase } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);
// import * as firebase from "firebase";
// const firebaseConfig = {
//   apiKey: "AIzaSyDKTctmhw6lyCxxtb04xx2jERLriE_BIGQ",
//   authDomain: "fishappproj.firebaseapp.com",
//   databaseURL: "https://fishappproj-default-rtdb.firebaseio.com",
//   projectId: "fishappproj",
//   storageBucket: "fishappproj.appspot.com",
//   messagingSenderId: "175974153365",
//   appId: "1:175974153365:web:8995d08d6b523aa4a1af9c",
//   measurementId: "G-6SQV7ZEXK5",
// };

// firebase.initializeApp(firebaseConfig);

import { QRAuthenticationContextProvider } from "./src/services/authentication/QRAuthentication.context";
import Navigation from "./src/infrastructure/navigation";
import theme from "./src/infrastructure/theme";

//* Uncomment this if you want to test how the Splash Screen looks
// import * as SplashScreen from "expo-splash-screen";
// SplashScreen.preventAutoHideAsync();
// setTimeout(SplashScreen.hideAsync, 3000);

//mohomin123: Uncomment below line and ortTest() for test. 
// import ortTest from "./OrtTest";

function App() {

  // ortTest();

  return (
    <ThemeProvider theme={theme}>
      <QRAuthenticationContextProvider>
        <Navigation />
      </QRAuthenticationContextProvider>
    </ThemeProvider>
  );
}

export default App;
