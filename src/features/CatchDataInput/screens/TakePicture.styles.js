import styled from "styled-components/native";
import { Camera as ExpoCamera } from "expo-camera";

export const Camera = styled(ExpoCamera)`
  flex: 1;
  width: 140%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
`;

export const SnapButton = styled.TouchableOpacity`
  display: ${(props) => (props.evaluating ? "none" : "flex")};
  flex: 0;
  background-color: white;
  padding: ${(props) => props.theme.sizes[2]};
  align-self: center;
  margin: 20px;
  height: ${(props) => props.theme.sizes[3]};
  width: ${(props) => props.theme.sizes[3]};
  border-radius: ${(props) => props.theme.sizes[3]};
  border-width: 5px;
  border-color: black;
`;

export const Evaluating = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(0, 75, 102, 0.5);
`;
