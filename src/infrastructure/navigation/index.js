import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import HomeStack from "./Home.navigation";
import MainDrawer from "./MainDrawer.navigation";

import { QRAuthenticationContext } from "../../services/authentication/QRAuthentication.context";

//* Main login flow for the app
//  Once the fisherman scans their QR code,
//  they will be redirected to the main app
function Navigation() {
  const { isAuthenticated } = useContext(QRAuthenticationContext);

  return (
    <NavigationContainer>
      {!isAuthenticated ? <HomeStack /> : <MainDrawer />}
    </NavigationContainer>
  );
}

export default Navigation;
