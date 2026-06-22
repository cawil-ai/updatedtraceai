import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../../features/Home/screens/Login.screen";
import HomeScreen from "../../features/Home/screens/Home.screen";

const Stack = createStackNavigator();

//* Stack Navigator for the screens before logging in
//  Currently only contains the QR Login screen
//  Might also add other screens to this stack later?
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "Scan QR Code to Log in" }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
