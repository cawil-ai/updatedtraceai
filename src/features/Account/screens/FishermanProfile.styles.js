import React from "react";
import styled, { css } from "styled-components/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export const HeadingWrapper = styled.View`
  align-items: center;
`;

export const Heading = styled.View`
  position: absolute;
  background-color: ${(props) => props.theme.colors.brand.muted};
  width: 100%;
  height: 75px;
`;

export const ProfilePicture = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border-color: white;
  background-color: lightgrey;
  border-width: 3px;
  margin-top: ${(props) => props.theme.sizes[2]};
  margin-bottom: ${(props) => props.theme.sizes[2]};
`;

export const UserName = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.title};
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: bold;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* text-align-vertical: center; */
`;

export const UserInfoContainer = styled.View`
  flex: 1;
  padding: ${(props) => props.theme.sizes[1]};
`;

export const UserInfoItem = styled.View`
  padding: ${(props) => props.theme.sizes[0]};
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const iconStyles = css`
  margin-right: ${(props) => props.theme.sizes[2]};
  font-size: ${(props) => props.theme.fontSizes.icon};
  color: ${(props) => props.theme.colors.text.primary};
`;

const StyledMaterialCommunityIcons = styled(MaterialCommunityIcons)`
  ${iconStyles}
`;

const StyledMaterialIcons = styled(MaterialIcons)`
  ${iconStyles}
`;

export const UserInfoIcon = ({ type, name }) => {
  if (type === "MaterialIcons") {
    return <StyledMaterialIcons name={name} />;
  }

  return <StyledMaterialCommunityIcons name={name} />;
};

UserInfoIcon.defaultProps = {
  type: "MaterialCommunityIcons",
};

export const UserInfoText = styled.Text`
  flex: 1;
  flex-wrap: wrap;
  font-size: ${(props) => props.theme.sizes[1]};
  color: ${(props) => props.theme.colors.text.primary};
`;
