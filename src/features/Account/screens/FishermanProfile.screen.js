import React, { useState, useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";

import {
  Heading,
  HeadingWrapper,
  ProfilePicture,
  UserName,
  UserInfoContainer,
  UserInfoItem,
  UserInfoIcon,
  UserInfoText,
} from "./FishermanProfile.styles";

import formatDate from "../../../utils/formatDate";

import DefaultProfile from "../../../../assets/defaultprofile.png";

const FishermanProfile = () => {
  const [userData, setUserData] = useState({});
  const [latestCatchLocation, setLatestCatchLocation] = useState(null);
  const [latestCatchDate, setLatestCatchDate] = useState(null);

  //* Get fisherman info and latest catch info from async storage,
  //* and refresh the display if data is updated
  //! Currently, this re-fetches the fisherman profile data
  //! every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      getFishermanData();
    }, []),
  );

  async function getFishermanData() {
    //TODO: Use the QR Auth context to get the fisherman data instead
    const userDataJson = await AsyncStorage.getItem("@fisherman_data");
    if (userDataJson !== null) {
      const parsedUserData = JSON.parse(userDataJson);
      setUserData(parsedUserData);
      //  Use async storage to fetch latest catch info
      const [locationData, timestampData] = await AsyncStorage.multiGet([
        "@latest_catch_location",
        "@latest_catch_date",
      ]);
      if (locationData[1] && timestampData[1]) {
        setLatestCatchLocation(JSON.parse(locationData[1]));
        setLatestCatchDate(+timestampData[1]);
      }
    }
  }

  //* Display error message if fisherman data is invalid
  if (!userData) {
    return (
      <View>
        <Text>No user info detected. Try logging in again?</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <HeadingWrapper>
        <Heading />
        <ProfilePicture source={DefaultProfile} />
        <UserName>
          {userData.firstName} {userData.lastName}
        </UserName>
      </HeadingWrapper>
      <UserInfoContainer>
        <UserInfoItem>
          <UserInfoIcon name="registered-trademark" />
          <UserInfoText>
            Origin of Registration: {userData.regOrigin}
          </UserInfoText>
        </UserInfoItem>
        <UserInfoItem>
          <UserInfoIcon type="MaterialIcons" name="directions-boat" />
          <UserInfoText>Vessel #: {userData.vesselNum}</UserInfoText>
        </UserInfoItem>
        <UserInfoItem>
          <UserInfoIcon name="email" />
          <UserInfoText>Email Address: {userData.email}</UserInfoText>
        </UserInfoItem>
        <UserInfoItem>
          <UserInfoIcon name="phone" />
          <UserInfoText>Mobile #: {userData.mobileNum}</UserInfoText>
        </UserInfoItem>
        <UserInfoItem>
          <UserInfoIcon name="fish" />
          <UserInfoText>Fishing Gear: {userData.fishGear}</UserInfoText>
        </UserInfoItem>
        {latestCatchDate && (
          <UserInfoItem>
            <UserInfoIcon name="calendar-month" />
            <UserInfoText>
              Latest catch: {formatDate(latestCatchDate)}
            </UserInfoText>
          </UserInfoItem>
        )}
        {latestCatchLocation && (
          <UserInfoItem>
            <UserInfoIcon name="map-marker" />
            <UserInfoText>
              Latest catch location: {latestCatchLocation.latitude},{" "}
              {latestCatchLocation.longitude}
            </UserInfoText>
          </UserInfoItem>
        )}
      </UserInfoContainer>
    </ScrollView>
  );
};

export default FishermanProfile;
