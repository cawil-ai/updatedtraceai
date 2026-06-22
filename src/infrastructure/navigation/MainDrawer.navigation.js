import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Dashboard from "../../features/Dashboard/screens/Dashboard.screen";
// import CatchDataViewer from "../../features/CatchDataViewer/screens/CatchDataViewer.screen";
import TakePicture from "../../features/CatchDataInput/screens/TakePicture.screen";
import CatchDataInput from "../../features/CatchDataInput/screens/CatchDataInput.screen";
import CatchDataUploadStack from "./CatchDataUpload.navigation";
import CatchDataViewerStack from "./CatchDataViewer.navigation";
import FishermanProfile from "../../features/Account/screens/FishermanProfile.screen";

import MainDrawerContent from "../../components/navigation/MainDrawerContent.component";

import { colors } from "../theme/colors";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//* Options for the header shown at the top of each screen
//  Here, you can set if the header should be visible,
//  set styles such as background and text color,
//  or maybe create a custom header component
const headerOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: colors.brand.primary },
  headerTintColor: "white",
};

//* Screen stack navigation for inputting catch data
//  First the fisherman takes a picture of their catch,
//  then they shall input the necessary info on the next screen
function TakePictureStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TakePicture"
        component={TakePicture}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CatchDataInput"
        component={CatchDataInput}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

//* Main drawer navigation for the app
//? Dashboard: Main dashboard/home screen
//? CatchDataViewer: View latest catch info to be uploaded
//? TakePictureStack: Take picture and input data for latest catch
//? CatchDataUpload: Upload catch data to Firebase (requires internet)
//? FishermanProfile: View fisherman's profile info
//  The icons used for the drawer menu labels can also be found here.
function MainDrawer() {
  return (
    <Drawer.Navigator
      // drawerStyle={{
      //   backgroundColor: "#c6cbef",
      //   width: 240,
      //   textColor: "c6cbef"
      // }}
      initialRouteName="DashboardStack"
      backBehavior="initialRoute"
      drawerContent={(props) => <MainDrawerContent {...props} />}>
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          ...headerOptions,
          title: "Dashboard",
          headerTitle: "Upload Fish Photo",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CatchDataViewer"
        component={CatchDataViewerStack}
        options={{
          ...headerOptions,
          title: "View Catch Data",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fish" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TakePictureStack"
        component={TakePictureStack}
        options={{
          ...headerOptions,
          title: "Input Catch Data",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CatchDataUploadStack"
        component={CatchDataUploadStack}
        options={{
          ...headerOptions,
          title: "Upload Catch Data",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cloud-upload"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="FishermanProfile"
        component={FishermanProfile}
        options={{
          ...headerOptions,
          title: "Fisherman Profile",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainDrawer;
