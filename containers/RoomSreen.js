import { useEffect, useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Image,
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

  console.log("ROOM INFO ===>", roomDetails);

  const displayRating = (rate) => {
    const tab = [];

    for (let i = 1; i <= 5; i++) {
      // console.log(i);
      if (i <= rate) {
        tab.push(<Ionicons name="star" size={20} color="orange" key={i} />);
      } else {
        tab.push(<Ionicons name="star" size={20} color="gray" key={i} />);
      }
    }

    // console.log(tab);
    return tab;
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#EB5A62" />
  ) : (
    <ScrollView contentContainerStyle={styles.roomInfo}>
      <ImageBackground
        source={{
          uri: roomDetails.photos[0].url,
        }}
        style={styles.picture}
      >
        <Text style={styles.price}>{roomDetails.price} €</Text>
      </ImageBackground>

      <View style={styles.description}>
        <View style={[styles.flexRow, styles.detail]}>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {roomDetails.title}
            </Text>
            <View style={[styles.rating, styles.flexRow]}>
              {displayRating(roomDetails.ratingValue)}
              <Text style={styles.textGray}>{roomDetails.reviews} reviews</Text>
            </View>
          </View>

          <Image
            source={{ uri: roomDetails.user.account.photo.url }}
            style={styles.avatar}
          />
        </View>

        <Text numberOfLines={3} style={styles.textDescription}>
          {roomDetails.description}
        </Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: roomDetails.location[1],
          longitude: roomDetails.location[0],
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        <Marker
          coordinate={{
            latitude: roomDetails.location[1],
            longitude: roomDetails.location[0],
          }}
          title={roomDetails.title}
          description={roomDetails.description}
        />
      </MapView>

      {/* <Text numberOfLines={3}>{roomDetails.description}</Text> */}
    </ScrollView>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  title: {
    fontSize: 22,
    width: 230,
  },
  textGray: {
    color: "gray",
  },
  description: {
    width: "90%",
    marginTop: 8,
  },

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

  detail: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    gap: 7,
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  textDescription: {
    marginVertical: 12,
  },

  map: {
    width: "100%",
    height: 300,
  },
});
