//* Stack Navigation for Catch Data Upload
//! Requires internet connection upon app startup,
//! meaning the app needs an initial connection
//! even for offline features
//TODO: Isolate this feature from offline features of the app
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CatchDataViewer from "../../features/CatchDataViewer/screens/CatchDataViewer.screen";
import CatchDataEdit from "../../features/CatchDataViewer/screens/CatchDataEdit.screen";

const Stack = createStackNavigator();

function CatchDataViewerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CatchDataView"
        component={CatchDataViewer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CatchDataEdit"
        component={CatchDataEdit}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default CatchDataViewerStack;
