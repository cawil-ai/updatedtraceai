import React from "react";
import styled from "styled-components/native";
import { MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons";

import FillContainer from "../../../components/utility/FillContainer.component";

const DashboardContainer = styled(FillContainer)`
  background-color: ${(props) => props.theme.colors.brand.secondary};
`;

const BigBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const BigBtnText = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.h5};
  font-weight: ${(props) => props.theme.fontWeights.bold}
  color: white;
`;

const Dashboard = ({ navigation }) => {
  return (
    <>
      <DashboardContainer>
        <BigBtn onPress={() => navigation.navigate("TakePictureStack")}>
          <Entypo name="camera" size={125} color="#fff" />
          <BigBtnText>Take Photo</BigBtnText>
        </BigBtn>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
