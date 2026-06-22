import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import {
  CatchDataIcon,
  CatchDataItem,
  CatchDataText,
  CatchPhoto,
  CatchDataTextInput,
  CatchPhotoContainer,
} from "../../../components/catch-data/CatchData.styles";

import formatDate from "../../../utils/formatDate";

//mohomin123: there is a bug; although specify the species, it doesn't work with msg("please specify species")
const CatchDataEdit = ({ navigation, route }) => {
  //* State variables for the catch data we are going to display
  //TODO: consider using something like useReducer() to clean this up later
  const [catchData, setCatchData] = useState(null);
  const [catchSpecies, setCatchSpecies] = useState("");
  const [catchWeight, setCatchWeight] = useState("");
  const [byCatchType, setbyCatchType] = useState("");

  //* Fetch catch data from the catchData.json file
  //! Currently, this re-fetches the fisherman profile data
  //! every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      getCatchData();
    }, []),
  );

  //TODO: Use Context API to provide the catch data
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

  //Update Data on specific data
  const updateData = async () => {
    //Alert if theres no species and/or weight putted
    if (!catchWeight && !catchSpecies) {
      alert("Please specify the species and weight. Thank you", "Reminder");
    } else if (!catchSpecies) {
      alert("Please specify the species. Thank you");
    } else if (!catchWeight) {
      alert("Please specify the weight. Thank you");
    } else if (!byCatchType) {
      alert("Please specify the specific species. Thank you");
    } else {
      const fileDir = FileSystem.documentDirectory;
      const catchDataURI = `${fileDir}catchData.json`;

      catchData[route.params.id] = {
        ...catchData[route.params.id],
        weight: catchWeight,
        species: catchSpecies,
        byCatch: byCatchType,
      };

      await FileSystem.writeAsStringAsync(
        catchDataURI,
        JSON.stringify(catchData),
      );

      navigation.navigate("CatchDataView");
    }
  };

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

  const speciesList = [
    { label: "Species", value: "" },
    { label: "Bigeye Tuna", value: "Bigeye Tuna" },
    { label: "Blue Marlin", value: "Blue Marlin" },
    { label: "Blue Swimming Crab", value: "Blue Swimming Crab" },
    { label: "Shrimp", value: "Shrimp" },
    { label: "Grouper", value: "Grouper" },
    { label: "Mackerel", value: "Mackerel" },
    { label: "Mahi-mahi", value: "Mahi-mahi" },
    { label: "Sailfish", value: "Sailfish" },
    { label: "Skipjack", value: "Skipjack" },
    { label: "Swordfish", value: "Swordfish" },
    { label: "Yellowfin Tuna", value: "Yellowfin Tuna" },
    { label: "Others", value: "Others" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10,
    },
    buttonEdit: {
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
      marginBottom: 5,
      marginLeft: 5,
      fontWeight: "bold",
    },
  });
  return (
    <ScrollView>
      <CatchPhotoContainer>
        <CatchPhoto source={{ uri: `${catchData[route.params.id].src}` }} />
      </CatchPhotoContainer>
      <View>
      <Text style={styles.textSpace}> Edit Catch Data: </Text>
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
        <CatchDataTextInput
          placeholderTextColor="#777"
          keyboardType="decimal-pad"
          placeholder="Weight (kg)"
          onChangeText={(value) => setCatchWeight(value)}
          value={catchWeight}
        />
        <CatchDataItem>
          <CatchDataIcon name="map-marker" />
          <CatchDataText>
            Latitude: {catchData[route.params.id].latitude}
          </CatchDataText>
        </CatchDataItem>
        <CatchDataItem>
          <CatchDataIcon name="map-marker" />
          <CatchDataText>
            Longitude: {catchData[route.params.id].longitude}
          </CatchDataText>
        </CatchDataItem>
        <CatchDataItem>
          <CatchDataIcon name="calendar-month-outline" />
          <CatchDataText>
            Date Caught: {formatDate(catchData[route.params.id].timestamp)}
          </CatchDataText>
        </CatchDataItem>
      </View>
      <View>
      <TouchableOpacity
        style={styles.buttonEdit}
        onPress={updateData}>
        <Text style={styles.innerText}>UPDATE DATA</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.buttonDelete}
        onPress={() => navigation.navigate("CatchDataView")}>
        <Text style={styles.innerText}>CANCEL</Text>
      </TouchableOpacity>

      
        {/* <Button title="Update Data" color="blue" onPress={updateData} />
        <Button
          title="Cancel"
          color="red"
          onPress={() => navigation.navigate("CatchDataView")}
        /> */}
      </View>
    </ScrollView>
  );
};

export default CatchDataEdit;
