import { useEffect, useState } from "react";
import axios from "axios";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import { View, StyleSheet, ActivityIndicator } from "react-native";
{
}
const AroundMeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [finishLoading, setFinishLoading] = useState(false);

  // State pour gérer mes localisations
  const [coords, setCoords] = useState({});
  const [roomLocation, setRoomLocation] = useState([]);

  useEffect(() => {
    const AskPermissionToGetCoords = async () => {
      //  Demande de permission à l'utilisateur pour accéder à ces coordonnées GPS
      const { status } = await Location.requestForegroundPermissionsAsync();
      //   console.log("REPONSE GEO ===>", status);

      if (status === "granted") {
        const { coords } = await Location.getCurrentPositionAsync();
        // console.log("COORDS ===>", coords);

        // On transmet les coordonées dans notre state
        setCoords({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setIsLoading(false);
      } else {
        alert("access denied");
      }
    };
    AskPermissionToGetCoords();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${48.866667}&longitude=${2.333333}`
        );
        // console.log("REPONSE AXIOS ===>", response.data);
        setRoomLocation(response.data);
        setFinishLoading(true);
      } catch (error) {
        console.log("ERROR ==>", error.response);
      }
    };
    if (!isLoading && coords.latitude && coords.longitude) {
      fetchData();
    }
  }, [coords, isLoading]);
  //   console.log(coords);

  return !finishLoading ? (
    <ActivityIndicator size="large" color="#EB5A62" />
  ) : (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          // Map centré sur la position de l'utilisateur
          latitude: 48.866667,
          longitude: 2.333333,
          //  Détermine le zoom de la map
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation
      >
        {roomLocation.map((coord) => {
          // console.log(coord);
          return (
            <Marker
              key={coord._id}
              coordinate={{
                latitude: coord.location[1],
                longitude: coord.location[0],
              }}
              title={coord.title}
              description={coord.description}
              onPress={() => {
                navigation.navigate("RoomMap", {
                  id: coord._id,
                });
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default AroundMeScreen;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
