import React, { useState, useContext, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Button,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as firebase from "firebase";

import {
  CatchDataIcon,
  CatchDataItem,
  CatchDataText,
  CatchPhoto,
  CatchPhotoContainer,
  NavButton,
  NavButtonContainer,
} from "../../../components/catch-data/CatchData.styles";

// import { FirebaseAuthenticationContext } from "../../../services/authentication/FirebaseAuthentication.context";
import { QRAuthenticationContext } from "../../../services/authentication/QRAuthentication.context";

import { firebaseConfig, db, storage } from "../../../config/firebase.config";

//? Why initialize firebase here instead of the main App.js?
//! Firebase needs to get initialized upon *importing* this file,
//! meaning the rest of the app would also require an inital
//! firebase connection upon starting the app
//TODO: Make sure only this feature requires internet,
//TODO: Make sure the other features can still work fully offline
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

import formatDate from "../../../utils/formatDate";

function CatchDataUpload() {
  const { user } = useContext(QRAuthenticationContext);
  // const { firebaseUser } = useContext(FirebaseAuthenticationContext);
  // console.log(firebaseUser);

  const [catchData, setCatchData] = useState(null);
  const [currentCatchIdx, setCurrentCatchIdx] = useState(0);

  //* Fetch catch data from the catchData.json file
  //! Currently, this re-fetches the fisherman profile data
  //! every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      getCatchData();
    }, []),
  );

  async function getCatchData() {
    try {
      //  Get TrACE.AI folder URI
      const fileDir = FileSystem.documentDirectory;
      const catchDataURI = `${fileDir}catchData.json`;

      //  Read the catch data from catchData.json, if any
      const catchDataPromise = await FileSystem.getInfoAsync(catchDataURI);
      let catchDataContents = [];
      if (catchDataPromise.exists) {
        const unparsedData = await FileSystem.readAsStringAsync(catchDataURI);
        catchDataContents = JSON.parse(unparsedData);
      }

      //  Set the catch data to be displayed later
      //  Set an empty array if catchData.json doesn't exist
      setCatchData(catchDataContents);
    } catch (error) {
      //TODO: Handle error on async call
    }
  }

  //* onPress handlers for navigating thru catch data contents
  function getPrevCatch() {
    if (currentCatchIdx > 0) {
      setCurrentCatchIdx(currentCatchIdx - 1);
    }
  }

  function getNextCatch() {
    if (currentCatchIdx < catchData.length) {
      setCurrentCatchIdx(currentCatchIdx + 1);
    }
  }

  //? Uncomment this (and the Button below) if you want to delete
  //? ALL the contents inside the FileSystem.documentDirectory
  //! This is just a temporary workaround until we can find a way
  //! to save the catch data where the user can view them
  // async function deleteCatchData() {
  //   const contents = await FileSystem.readDirectoryAsync(
  //     FileSystem.documentDirectory,
  //   );
  //   contents.forEach(
  //     async (file) =>
  //       await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`),
  //   );
  //   setCatchData([]);
  // }

  async function uploadCatchData() {
    try {
      ToastAndroid.show("Uploading catch item...", ToastAndroid.SHORT);
      //* Fetch catch image from local file storage
      console.log("Fetching local image...");
      // const catchImage = await FileSystem.readAsStringAsync(
      //   catchData[currentCatch].src,
      //   { encoding: FileSystem.EncodingType.Base64 },
      // );

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", catchData[currentCatchIdx].src, true);
        xhr.send(null);
      });

      //* Upload image + catch data

      // console.log(blob);
      const { id, ...currentCatch } = catchData[currentCatchIdx];

      //  Upload catch image to firebase storage and get its URL
      console.log("Uploading image");
      const snapshot = await storage.child(`${id}.jpg`).put(blob);

      const uploadURL = await snapshot.ref.getDownloadURL();
      console.log("Image uploaded at", uploadURL);

      //  Upload catch data to realtime database
      const toUpload = {
        ...currentCatch,
        id,
        src: uploadURL,
        fisherUid: user.fisherUid,
      };

      db.child(`users/${user.casaUid}/catch/${id}`).set(toUpload);

      await deleteCurrentCatch(id);
      ToastAndroid.show("Catch item uploaded!", ToastAndroid.SHORT);
    } catch (err) {
      ToastAndroid.show(`Upload Error: ${err.message}`, ToastAndroid.SHORT);
      console.error(err);
    }
  }

  //* Deletes current catch item after it finishes uploading
  async function deleteCurrentCatch(id) {
    const fileDir = FileSystem.documentDirectory;
    const catchDataURI = `${fileDir}catchData.json`;

    const newCatchData = catchData.filter((item) => item.id !== id);
    if (currentCatchIdx >= newCatchData.length && currentCatchIdx > 0) {
      setCurrentCatchIdx(newCatchData.length - 1);
    }
    setCatchData(newCatchData);
    await FileSystem.writeAsStringAsync(
      catchDataURI,
      JSON.stringify(newCatchData),
    );
  }

  if (!catchData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!catchData.length) {
    return (
      <View>
        <Text>catchData.json not found!</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    buttonUpload: {
      alignItems: "center",
      color: "white",
      backgroundColor: "#009900",
      padding: 10,
      marginRight: 10,
      marginLeft: 10,
      marginTop: 20,
      marginBottom: 5,
      borderRadius: 10,
    },

    buttonDelete: {
      alignItems: "center",
      color: "white",
      backgroundColor: "#d11a2a",
      padding: 10,
      marginRight: 10,
      marginLeft: 10,
      marginBottom: 5,
      borderRadius: 10,
    },

    countContainer: {
      alignItems: "center",
      padding: 10,
    },
    innerText: {
      color: "white",
    },
    textSpace: {
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 5,
      fontWeight: "bold",
    },
  });
  return (
    <ScrollView>
      <CatchPhotoContainer>
        <CatchPhoto source={{ uri: `${catchData[currentCatchIdx].src}` }} />
        <NavButtonContainer>
          <NavButton onPress={getPrevCatch} disabled={currentCatchIdx <= 0}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={50}
              color={currentCatchIdx <= 0 ? "silver" : "white"}
            />
          </NavButton>
          <NavButton
            onPress={getNextCatch}
            disabled={currentCatchIdx >= catchData.length - 1}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={50}
              color={
                currentCatchIdx >= catchData.length - 1 ? "silver" : "white"
              }
            />
          </NavButton>
        </NavButtonContainer>
      </CatchPhotoContainer>

      {/* <Button title="Upload" color="green" onPress={uploadCatchData} /> */}
      {/* <Button title="Clear Data" color="red" onPress={deleteCatchData} /> */}
      <View>
        <CatchDataItem>
          <CatchDataIcon name="fish" />
          <CatchDataText>
            Species: {catchData[currentCatchIdx].species}
          </CatchDataText>
        </CatchDataItem>
        {catchData[currentCatchIdx].species === "Others" && (
          <CatchDataItem>
            <CatchDataIcon name="fish" />
            <CatchDataText>
              Specific Species: {catchData[currentCatchIdx].byCatch}
            </CatchDataText>
          </CatchDataItem>
        )}
        <CatchDataItem>
          <CatchDataIcon name="weight-kilogram" />
          <CatchDataText>
            Weight: {catchData[currentCatchIdx].weight} kg
          </CatchDataText>
        </CatchDataItem>
        <CatchDataItem>
          <CatchDataIcon name="map-marker" />
          <CatchDataText>
            Latitude: {catchData[currentCatchIdx].latitude}
          </CatchDataText>
        </CatchDataItem>
        <CatchDataItem>
          <CatchDataIcon name="map-marker" />
          <CatchDataText>
            Longitude: {catchData[currentCatchIdx].longitude}
          </CatchDataText>
        </CatchDataItem>
        <CatchDataItem>
          <CatchDataIcon name="calendar-month-outline" />
          <CatchDataText>
            Date Caught: {formatDate(catchData[currentCatchIdx].timestamp)}
          </CatchDataText>
        </CatchDataItem>
      </View>
      <TouchableOpacity style={styles.buttonUpload} onPress={uploadCatchData}>
        <Text style={styles.innerText}> UPLOAD </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CatchDataUpload;
