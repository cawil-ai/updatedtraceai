//* Firebase Login screen
//  The fisherman first needs to authenticate with Firebase
//  in order to upload their catch data
//  Firebase login details may be automatically
//  provided thru the QR login code
import React, { useEffect, useContext } from "react";
import { View, Text, Button } from "react-native";

import { FirebaseAuthenticationContext } from "../../../services/authentication/FirebaseAuthentication.context";
import { QRAuthenticationContext } from "../../../services/authentication/QRAuthentication.context";

function FirebaseLogin({ navigation }) {
  const { user } = useContext(QRAuthenticationContext);
  const { isLoading, error, onLogin, isAuthenticated } = useContext(
    FirebaseAuthenticationContext,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("CatchDataUpload");
    }
  }, [navigation, isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 10 }}>Logging in as: {user.casaEmail}</Text>
      <Button
        title="Proceed"
        onPress={() => onLogin(user.casaEmail, user.casaPw)}
      />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
    </View>
  );
}

export default FirebaseLogin;
