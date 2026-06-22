import React, { useState, useEffect, useContext } from "react";
import { Text, ToastAndroid, Image } from "react-native";
import styled from "styled-components";
import { useIsFocused } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FillContainer from "../../../components/utility/FillContainer.component";
import * as ImagePicker from "expo-image-picker";

import { QRAuthenticationContext } from "../../../services/authentication/QRAuthentication.context";

const Scanner = styled(BarCodeScanner)`
  height: 100%;
  width: 100%;
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
  position: absolute;
  bottom: 10%;
  padding: ${(props) => props.theme.sizes[1]};
`;

const MaskQR = styled.Image`
  position: absolute;
  width: 180px;
  height: 180px;
`;

function LoginScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);

  const { onLogin, isLoading } = useContext(QRAuthenticationContext);

  //* Request permission for camera/barcode scanner
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //* Unmount camera component upon leaving the screen
  if (!isFocused) {
    return (
      <FillContainer>
        <Text>Camera already in use!</Text>
      </FillContainer>
    );
  }

  // Pick image from gallery
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //? Looks like the `allowsEditing` property
      //? causes the "Can not extract metadata" error
      //? encountered after running the ejected project
      //? See: https://github.com/expo/expo/issues/15155#issuecomment-986178534
      // allowsEditing: true,
      quality: 1,
    });

    // Return back the data scanned from the image picked from the gallery
    const res = await BarCodeScanner.scanFromURLAsync(result.uri);

    if (!result.cancelled) {
      onLogin(res[0]);
    }
  };

  return (
    <FillContainer>
      <Scanner
        type={type}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={isLoading ? undefined : onLogin}
      />
      <MaskQR source={require("../../../../assets/qrMask.png")} />
      <ButtonLogin onPress={pickImage}>
        <MaterialCommunityIcons name="file-image" size={30} color="#fff" />
        <ButtonText>UPLOAD QR CODE FROM GALLERY</ButtonText>
      </ButtonLogin>
    </FillContainer>
  );
}

export default LoginScreen;
