import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styled from "styled-components";

const HomeContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HomeImage = styled.Image`
  flex: 1;
  width: 85%;
  resize-mode: contain;
`;

const ButtonContainer = styled.View`
  flex: 0.3;
  flex-direction: row;
`;

const ButtonText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  padding-left: 5px;
`;

const ButtonLogin = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.brand.primary};
  height: 60px;
  border-radius: 10px;
  padding: ${(props) => props.theme.sizes[1]};
`;

function HomeScreen({ navigation }) {
  return (
    <HomeContainer>
      <HomeImage
        source={require("../../../../assets/logo-wide-transparent.png")}
      />
      <ButtonContainer>
        <ButtonLogin onPress={() => navigation.navigate("LoginScreen")}>
          <MaterialCommunityIcons
            name="image-filter-center-focus"
            size={30}
            color="#fff"
          />
          <ButtonText>SCAN QR CODE TO LOGIN</ButtonText>
        </ButtonLogin>
      </ButtonContainer>
    </HomeContainer>
  );
}

export default HomeScreen;
