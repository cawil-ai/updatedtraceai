import React, { useState, createContext } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const QRAuthenticationContext = createContext();

//* Context for the fisherman's data from their QR code.
//  This context is used for the initial (offline) login
//  using the fisherman's QR code.
//  Upon successful login, saves the QR data in the Context's State.
//  Optionally provides some handy loading/error state values as well
export const QRAuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  async function onLogin({ type, data }) {
    try {
      setIsLoading(true);
      //  Decode JSON data from QR code
      const fishermanData = JSON.parse(data);
      //? JSON format for fisherman data:
      const keys = [
        "firstName",
        "lastName",
        "casaEmail",
        "casaPw",
        "mobileNum",
        "regOrigin",
        "vesselNum",
        "fishGear",
        "fisherUid", //? Firebase: user.uid
        "casaUid", //? Firebase: firebaseUser.user.uid
      ];

      //  Validate JSON data from QR code
      //! Right now, this only checks if the parsed JSON data
      //! has all the keys we expect from the fisherman data format
      //TODO: Maybe research other ways to validate QR code data?
      if (keys.every((key) => fishermanData.hasOwnProperty(key))) {
        //  If QR code data is valid:
        //  Save fisherman info to async storage,
        //  and navigate to main app
        ToastAndroid.show(
          "QR Code detected. Logging in...",
          ToastAndroid.SHORT,
        );
        try {
          //! Async Storage only accepts string data,
          //! so we pass in the stringified JSON data here
          await AsyncStorage.setItem("@fisherman_data", data);
          //  Save user info in context state variable
          setUser(fishermanData);
        } catch (e) {
          //TODO: Handle errors on saving data
          setIsLoading(false);
          ToastAndroid.show(
            "Failed to save data. Please try again.",
            ToastAndroid.SHORT,
          );
          setError("Failed to save data. Please try again.");
        }
        setIsLoading(false);
      } else {
        //  If QR code data is NOT valid:
        //  display an error message to the fisherman
        setIsLoading(false);
        ToastAndroid.show(
          "Invalid QR Code detected. Please try again.",
          ToastAndroid.SHORT,
        );
        setError("Invalid QR Code detected. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      ToastAndroid.show(
        "Invalid QR Code detected. Please try again.",
        ToastAndroid.SHORT,
      );
      setError("Invalid QR Code detected. Please try again.");
    }
  }

  function onLogout() {
    //TODO
    setUser(null);
  }

  return (
    <QRAuthenticationContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        onLogin,
        onLogout,
      }}>
      {children}
    </QRAuthenticationContext.Provider>
  );
};
