import { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

const RoomScreen = () => {
  const { params } = useRoute();
  //   console.log("PARAMS ===>", params);
  const [isLoading, setIsLoading] = useState(true);
  const [roomDetails, setRoomDetails] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${params.id}`
        );
        // console.log("REPONSE AXIOS ===>", response.data);

        setRoomDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  // console.log("ROOM INFO ===>", roomDetails);

  return isLoading ? (
    <ActivityIndicator size="large" color="#EB5A62" />
  ) : (
    <View style={styles.roomInfo}>
      <Text> {roomDetails.title}</Text>
      <ImageBackground
        source={{
          uri: roomDetails.photos[0].url,
        }}
        style={styles.picture}
      >
        <Text style={styles.price}>{roomDetails.price} €</Text>
      </ImageBackground>

      {/* <Text numberOfLines={3}>{roomDetails.description}</Text> */}
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  roomInfo: {
    width: "100%",
    alignItems: "center",
  },
  picture: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  price: {
    backgroundColor: "#000000",
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 22,
    marginBottom: 10,
  },
});
