import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/core";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [offer, setOffer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );
        // console.log(response.data);
        setOffer(response.data);
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
          data={offer}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            // console.log("RENDER", item);
            // console.log("ID", item._id);
            // console.log("ACCOUNT", item.user.account.photo.url);
            return (
              <TouchableOpacity
                onPress={async () => {
                  navigation.navigate("Offer");
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
                      {item.ratingValue === 5 ? (
                        <View style={[styles.rating, styles.flexRow]}>
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Text>{item.reviews} reviews</Text>
                        </View>
                      ) : (
                        <View style={[styles.rating, styles.flexRow]}>
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="orange" />
                          <Ionicons name="star" size={20} color="gray" />
                          <Text>{item.reviews} reviews</Text>
                        </View>
                      )}
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
  flexRow: {
    flexDirection: "row",
  },
  title: {
    fontSize: 30,
    // borderWidth: 3,
    width: 230,
  },

  allOffer: {
    width: "100%",
    alignItems: "center",
    // borderWidth: 3,
  },
  picPrice: {
    width: "90%",
    alignItems: "center",
    // borderWidth: 3,
    // borderColor: "red",
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
    // borderColor: "blue",
    // borderWidth: 3,
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rating: {
    gap: 7,
    alignItems: "center",
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
});
