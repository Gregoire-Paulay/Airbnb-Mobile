import { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

// import de fonction
import displayRating from "../function/displayRating";

export default function HomeScreen({ navigation }) {
  // State pour gérer l'affichage de ma page
  const [isLoading, setIsLoading] = useState(true);
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );
        // console.log(response.data);
        setRoomsList(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" color="#EB5A62" />
  ) : (
    <View>
      <View>
        <FlatList
          style={styles.container}
          data={roomsList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            // console.log("RENDER", item);

            return (
              <TouchableOpacity
                onPress={async () => {
                  // console.log(item._id);
                  navigation.navigate("Room", {
                    id: item._id,
                  });
                }}
              >
                <View style={styles.allOffer}>
                  <View style={styles.picPrice}>
                    <Image
                      source={{ uri: item.photos[0].url }}
                      style={styles.picture}
                    />
                    <Text style={styles.price}>{item.price} €</Text>
                  </View>

                  <View style={[styles.flexRow, styles.offerInfo]}>
                    <View>
                      <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={[styles.rating, styles.flexRow]}>
                        {displayRating(item.ratingValue)}
                        <Text style={styles.textGray}>
                          {item.reviews} reviews
                        </Text>
                      </View>
                    </View>
                    <Image
                      source={{ uri: item.user.account.photo.url }}
                      style={styles.avatar}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.borderContainer}>
              <View style={styles.borderGray}></View>
            </View>
          )}
        />
      </View>

      {/* <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  flexRow: {
    flexDirection: "row",
  },
  title: {
    fontSize: 30,
    width: 230,
  },
  textGray: {
    color: "gray",
  },

  allOffer: {
    width: "100%",
    alignItems: "center",
  },
  picPrice: {
    width: "90%",
    alignItems: "center",
    position: "relative",
  },
  price: {
    backgroundColor: "#000000",
    color: "white",
    position: "absolute",
    bottom: 10,
    left: 0,
    fontSize: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  picture: {
    height: 200,
    width: "100%",
  },
  borderContainer: {
    alignItems: "center",
  },
  borderGray: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    width: "90%",
    marginVertical: 15,
  },

  offerInfo: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
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
});
