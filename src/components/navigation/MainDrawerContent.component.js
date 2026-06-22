import React, { useContext } from "react";
import { DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { QRAuthenticationContext } from "../../services/authentication/QRAuthentication.context";

import {
  DrawerContainer,
  DrawerHeader,
  DrawerBackBtn,
  DrawerLogoContainer,
  DrawerLogo,
} from "./MainDrawerContent.styles";

import Logo from "../../../assets/logo-wide-transparent.png";

//* Custom component for the drawer menu
//  This defines the appearance of the drawer menu
//  such as the TrACE.AI logo on top of the menu,
//  as well as adding a log out button to take the
//  fisherman back to the login screen
const MainDrawerContent = (props) => {
  const { onLogout } = useContext(QRAuthenticationContext);

  return (
    <DrawerContainer>
      <DrawerHeader>
        <DrawerBackBtn onPress={() => props.navigation.closeDrawer()}>
          <MaterialCommunityIcons name="close" size={30} color="#FFF" />
        </DrawerBackBtn>
        <DrawerLogoContainer>
          <DrawerLogo source={Logo} resizeMode="center" />
        </DrawerLogoContainer>
      </DrawerHeader>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Log Out"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="logout" size={size} color={color} />
        )}
        onPress={() => onLogout()}
      />
    </DrawerContainer>
  );
};

export default MainDrawerContent;
