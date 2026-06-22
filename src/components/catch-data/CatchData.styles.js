import React from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//* Global styles for the catch data input/viewer screens

const ImageContainer = styled.View`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

export const CatchPhotoContainer = ({ children }) => {
  //* Get screen dimensions
  //  Useful for styling later
  const { width, height } = useWindowDimensions();

  return (
    <ImageContainer width={width} height={height*0.45}>
      {children}
    </ImageContainer>
  );
};

//comment by mohomin123: I don't know front end styles(especilly flexible), so use absolute pixel size. TODO:change it to flex
export const CatchPhoto = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export const NavButtonContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const NavButton = styled.TouchableOpacity`

  align-items: center;
  background-color: transparent;
`;

export const NavCatchButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  width: 90%;
  align-items: center;
  background-color: transparent;
`;

export const CatchDataItem = styled.View`
  padding: ${(props) => props.theme.sizes[0]};
  margin: 1px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CatchDataIcon = styled(MaterialCommunityIcons)`
  font-size: ${(props) => props.theme.fontSizes.icon};
  color: ${(props) => props.theme.colors.text.primary};
  margin-right: ${(props) => props.theme.sizes[1]};
`;

export const CatchDataTextInput = styled.TextInput`
  paddingLeft: 20px;
  height: ${(props) => props.theme.sizes[3]};
  font-size: ${(props) => props.theme.sizes[1]};
  color: ${(props) => props.theme.colors.brand.primary};
`;

//TODO: Replace this with the typography Text component later
export const CatchDataText = styled.Text`
  flex: 1;
  flex-wrap: wrap;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text.primary};
`;
