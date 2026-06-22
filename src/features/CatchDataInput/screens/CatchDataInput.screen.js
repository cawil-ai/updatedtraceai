import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Button,
  Text,
  ToastAndroid,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { v4 as uuidv4 } from "uuid";

import {
  CatchPhoto,
  CatchPhotoContainer,
  CatchDataTextInput,
  CatchDataText,
} from "../../../components/catch-data/CatchData.styles";

import formatDate from "../../../utils/formatDate";

const CatchDataInput = ({ route, navigation }) => {
  //* State variables for imported packages
  const [location, setLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  //* State variables for the catch data we are going to save
  //TODO: consider using something like useReducer() to clean this up later
  const [catchWeight, setCatchWeight] = useState("");
  const [byCatchType, setbyCatchType] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  //* Get temp image URI from route params
  const { imageURI, detected_boxes, detected_klass, totalWeight } =
    route.params;
  const totalWeightDisplay = totalWeight;
  
  // const species = (
  //   result.label.charAt(0).toUpperCase() + result.label.slice(1)
  // ).replace("-", " ");

  //* List of catch species to be put into the dropdown input
  //? label: the text that will be displayed in the dropdown
  //? value: the actual value to be saved (i.e. into catchData.json)
  const speciesList = [
    { label: "No Species Detected", value: "" },
    { label: "Bigeye Tuna", value: "Bigeye Tuna" },
    { label: "Blue Marlin", value: "Blue Marlin" },
    { label: "Blue Swimmer Crab", value: "Blue Swimmer Crab" },
    { label: "Shrimp", value: "Shrimp" },
    { label: "Grouper", value: "Grouper" },
    { label: "Mackerel", value: "Mackerel" },
    { label: "Mahi-mahi", value: "Mahi-mahi" },
    { label: "Sailfish", value: "Sailfish" },
    { label: "Skipjack", value: "Skipjack" },
    { label: "Swordfish", value: "Swordfish" },
    { label: "Yellowfin Tuna", value: "Yellowfin Tuna" },
    { label: "zMarker", value: "zMarker" },
    { label: "Others", value: "Others" },
  ];
  //find species in speciesList
  const getSpeciesValue = function (species) {
    for (let i = 0; i < speciesList.length; i++) {
      if (
        species != null &&
        species.toUpperCase().replace(/-/g, " ") ==
          speciesList[i].label.toUpperCase()
      ) {
        return speciesList[i].value;
      }
    }
    return "";
  };
  // Get species that matches list
  const [catchSpecies, setCatchSpecies] = useState(
    getSpeciesValue(detected_klass),
  );

  //* Request permission to access location data
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
      //* Get location data
      try {
        let locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData);
      } catch (error) {
        console.log(error);
        setLocation({ error: error.message });
      }
    })();
  }, []);

  //* Enables button if inputs are valid
  // useEffect(() => {
  //   setIsButtonDisabled(!validateInputs());
  // }, [catchWeight, catchSpecies, location, validateInputs]);
  useEffect(() => {
    setIsButtonDisabled(!validateInputs());
  }, [catchWeight, catchSpecies, location, validateInputs, byCatchType]);

  const validateInputs = useCallback(() => {
    //const isValidWeight = !isNaN(+catchWeight) && +catchWeight > 0;
    const isValidLocation = location && !location.hasOwnProperty("error");
    const isValidCatch = byCatchType || catchSpecies !== "By-catch";
    return catchSpecies && isValidLocation && isValidCatch;
  }, [catchWeight, catchSpecies, location, byCatchType]);

  if (hasPermission === null) {
    return <Text>Requesting for permissions...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Error: Permission to access location was denied</Text>;
  }

  async function requestLocation() {
    //* Get location data
    try {
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    } catch (error) {
      setLocation({ error: error.message });
    }
  }

  async function handleSubmit() {
    if (!validateInputs()) {
      ToastAndroid.show("Please enter valid inputs!", ToastAndroid.SHORT);
      return;
    }
    try {
      //  Get TrACE.AI folder URI
      //! This saves the catch data and catch photos successfully,
      //! but they are not currently viewable thru file explorer etc.
      //! Currently, only this app can find the correct folder
      //! and view/read/save files inside.
      //! Consider using other FileSystem libraries, if available.
      const fileDir = FileSystem.documentDirectory;
      //? Current format for documentDirectory is:
      //? file:///data/data/host.exp.exponent/files/ExperienceData/.../
      //? This format below is visible to the user/file explorer/etc.,
      //? but is not currently supported by Expo's FileSystem library.
      //? file:///storage/emulated/0/traceapp/

      const id = uuidv4();
      const catchDataURI = `${fileDir}catchData.json`;
      const catchPhotoURI = `${fileDir}traceapp_${id}.jpg`;

      //? Check if TrACE.AI directory exists
      // const checkFileDir = await FileSystem.getInfoAsync(fileDir);
      // console.log(checkFileDir);

      //? Test code for Expo MediaLibrary
      // const asset = await MediaLibrary.createA
      ssetAsync(imageURI);
      // const album = await MediaLibrary.getAlbumAsync(fileDir);
      // if(!album) {
      //   await MediaLibrary.createAlbumAsync(fileDir, asset);
      // } else {
      //   await MediaLibrary.addAssetsToAlbumAsync([asset], fileDir)
      // }
      // ToastAndroid.show("Saving image...", ToastAndroid.SHORT);

      //  Get existing data from JSON file, if any
      const catchData = await FileSystem.getInfoAsync(catchDataURI);
      let oldCatchData = [];
      if (catchData.exists) {
        const unparsedData = await FileSystem.readAsStringAsync(catchDataURI);
        oldCatchData = JSON.parse(unparsedData);
      }
      //  Collect catch data to be saved into JSON file
      const newCatchData = {
        id,
        src: catchPhotoURI,
        species: catchSpecies,
        weight: totalWeight,
        byCatch: byCatchType,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      };
      //  Save permanent copy of catch photo
      await FileSystem.copyAsync({
        from: imageURI,
        to: catchPhotoURI,
      });
      //  Append new catch data into JSON file
      const toWrite = [...oldCatchData, newCatchData];
      ToastAndroid.show("Saving to JSON file...", ToastAndroid.SHORT);
      await FileSystem.writeAsStringAsync(
        catchDataURI,
        JSON.stringify(toWrite),
      );
      //  Save latest catch location and timestamp to AsyncStorage
      await AsyncStorage.setItem(
        "@latest_catch_location",
        JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      );
      await AsyncStorage.setItem("@latest_catch_date", `${location.timestamp}`);
      //  Go back to the TakePicture screen upon completing submit
      navigation.goBack();
    } catch (error) {
      //TODO: Handle errors on async calls
      console.error(error);
    }
  }

  //* Process location data to display
  //! If there are any unhandled errors on getting location data,
  //! consider showing them here as well
  //TODO: Figure out a cleaner way to display location data
  let locationInfo = <Text>Waiting for location data...</Text>;
  if (location && location.hasOwnProperty("error")) {
    locationInfo = (
      <View>
        <Text>Error: {JSON.stringify(location.error)}</Text>
        <Button title="Refresh" onPress={requestLocation} />
      </View>
    );
  } else if (location) {
    locationInfo = (
      <View>
        <CatchDataText>Latitude: {location.coords.latitude}</CatchDataText>
        <CatchDataText>Longitude: {location.coords.longitude}</CatchDataText>
        <CatchDataText>Date: {formatDate(location.timestamp)}</CatchDataText>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    buttonSubmit: {
      alignItems: "center",
      color: "white",
      backgroundColor: "#1D4ED8",
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
      marginLeft: 20,
      fontWeight: "bold",
    },
    textSpace2: {
      marginTop: 10,
      marginLeft: 25,
      fontWeight: "bold",
    },
  });
  return (
    <ScrollView>
      <CatchPhotoContainer>
        {detected_boxes.map((item, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              marginTop: item[1],
              marginLeft: item[0],
              width: item[2],
              height: item[3],
              borderStyle: "solid",
              borderWidth: 2,
              borderColor: "#1589FF",
              zIndex: 1,
            }}
          />
        ))}
        <CatchPhoto source={{ uri: imageURI }} />
      </CatchPhotoContainer>
      <Text style={styles.textSpace}> Detected Species: </Text>
      <View
        style={{
          zIndex: 20,
        }}>
  
        <Picker
          selectedValue={catchSpecies}
          onValueChange={(itemValue, itemIndex) => setCatchSpecies(itemValue)}>
          {speciesList.map(({ label, value }) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
        {catchSpecies === "Others" && (
          <TextInputByCatch
            placeholderTextColor="#777"
            placeholder="Specific By-Catch"
            onChangeText={(value) => setbyCatchType(value)}
            value={byCatchType}
          />
        )}
      </View>
      <Text style={styles.textSpace2}>
         Estimated Weight: {parseFloat(totalWeightDisplay.toFixed(2))} kg
      </Text>
      <Text style={styles.textSpace}> Location Data:</Text>
      <Text style={styles.textSpace}> {locationInfo}</Text>

      <TouchableOpacity
        style={styles.buttonSubmit}
        onPress={handleSubmit}
        disabled={isButtonDisabled}>
        <Text style={styles.innerText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CatchDataInput;
