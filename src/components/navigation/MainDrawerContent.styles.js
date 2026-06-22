import { DrawerContentScrollView } from "@react-navigation/drawer";
import styled from "styled-components/native";

//* Styles for the custom drawer component
export const DrawerContainer = styled(DrawerContentScrollView)`
  flex: 1;
`;

export const DrawerHeader = styled.View`
  flex-direction: column;
  margin-top: -5px;
  padding-top: ${(props) => props.theme.sizes[2]};
  padding-left: ${(props) => props.theme.sizes[1]};
  height: 150px;
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

export const DrawerBackBtn = styled.TouchableOpacity`
  position: absolute;
  top: ${(props) => props.theme.sizes[0]};
  left: ${(props) => props.theme.sizes[0]};
`;

export const DrawerLogoContainer = styled.View`
  width: 220px;
  height: 70px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  overflow: hidden;
`;

export const DrawerLogo = styled.Image`
  width: 250px;
  height: 70px;
  margin-top: 20px;
`;
