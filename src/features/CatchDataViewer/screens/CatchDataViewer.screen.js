import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import {
  CatchDataIcon,
  CatchDataItem,
  CatchDataText,
  CatchPhoto,
  CatchPhotoContainer,
  NavButton,
  //NavCatchButton,
  NavButtonContainer,
} from "../../../components/catch-data/CatchData.styles";

import formatDate from "../../../utils/formatDate";

const CatchDataViewer = ({ navigation }) => {
  //* State variables for the catch data we are going to display
  //TODO: consider using something like useReducer() to clean this up later
  const [catchData, setCatchData] = useState(null);
  console.log(catchData)
  const [currentCatchIdx, setCurrentCatchIdx] = useState(0);

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

  //* Delete individual catch item
  async function deleteCurrentCatch() {
    const fileDir = FileSystem.documentDirectory;
    const catchDataURI = `${fileDir}catchData.json`;

    const id = catchData[currentCatchIdx].id;

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
    buttonEdit: {
      alignItems: "center",
      color: "white",
      backgroundColor: '#1D4ED8',
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
      fontWeight: "bold"
    }
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
      {/* 
        <Button title="Edit Data" color="blue" onPress={()=>navigation.navigate('CatchDataEdit',{id:currentCatchIdx})} />
        <Button title="Delete" color="red"  onPress={deleteCurrentCatch} />
      */}
      <View>
        <Text style={styles.textSpace}> Review Catch Data: </Text>
        <CatchDataItem>
          <CatchDataIcon name="fish" />
          <CatchDataText>
            Species: {catchData[currentCatchIdx].species}
          </CatchDataText>
        </CatchDataItem>
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

      <TouchableOpacity
        style={styles.buttonEdit}
        onPress={() =>
          navigation.navigate("CatchDataEdit", { id: currentCatchIdx })
        }>
        <Text style={styles.innerText}>EDIT DATA</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonDelete}
        onPress={() =>
          navigation.navigate("CatchDataEdit", { id: currentCatchIdx })
        }>
        <Text style={styles.innerText}>DELETE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CatchDataViewer;
