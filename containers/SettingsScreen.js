import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

import {
  Button,
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";

// Import de mes Images
import userIcon from "../assets/user-icon.jpg";

export default function SettingsScreen({ setToken, userToken }) {
  // state pour gérer les données de l'utilisateur
  const [userId, setUserId] = useState("");
  const [userAvatar, setUserAvatar] = useState({});

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPic, setSelectedPic] = useState("");

  // State pour gérer les loading des useEffect
  const [IsLoading, setIsLoading] = useState(true);
  const [loadingFinished, setLoadingFinished] = useState(false);

  useEffect(() => {
    const getIdInStorage = async () => {
      const userStorageId = await AsyncStorage.getItem("id");
      setUserId(userStorageId);
      setIsLoading(false);
    };
    getIdInStorage();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        // console.log("AXIOS ===>", data);
        setUserAvatar(data.photo.url);
        setEmail(data.email);
        setUsername(data.username);
        setDescription(data.description);

        setLoadingFinished(true);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, [userId, IsLoading, userAvatar]);

  const getPermissionToOpenLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // console.log(status);

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      // console.log(result);
      if (result.canceled) {
        alert("Aucune photo n'a été sélectionée");
      } else {
        setSelectedPic(result.assets[0].uri);
      }
    } else {
      alert(
        "Accès non autorisé, si vous voulez autorisez l'accès à la galerie de photos aller dans Réglages ==> Photos"
      );
    }
  };

  const getPermissionToOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    // console.log(status);

    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      // console.log(result);
      if (result.canceled) {
        alert("No picture selected");
      } else {
        setSelectedPic(result.assets[0].uri);
      }
    } else {
      alert(
        "Accès non autorisé, pour autorisé l'accès à votre caméra, aller dans Réglages ===> Appareil Photo"
      );
    }
  };

  const editInfo = async () => {
    try {
      const { data } = await axios.put(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
        {
          email: email,
          username: username,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("UPDATE ==>", data);

      if (selectedPic) {
        const tab = selectedPic.split(".");
        // console.log(tab.at(-1));

        const formData = new FormData();
        formData.append("photo", {
          uri: selectedPic,
          name: `avatar.${tab.at(-1)}`,
          type: `image/${tab.at(-1)}`,
        });

        try {
          const response = await axios.put(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
            formData,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("AVATAR EDIT ===>", response.data);
          setUserAvatar(response.data.photo.url);
          // console.log("AVATAR EDIT ===>", userAvatar);
        } catch (error) {
          console.log(error.response);
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  // console.log(userId);
  // console.log("AVATAR ===>", userAvatar);

  return !loadingFinished ? (
    <ActivityIndicator size="large" color="#EB5A62" />
  ) : (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={[styles.flexRow, styles.avatarChange]}>
        {userAvatar === null ? (
          <Image style={[styles.avatar, styles.borderRed]} source={userIcon} />
        ) : (
          <Image
            style={[styles.avatar, styles.borderRed]}
            source={{ uri: userAvatar }}
          />
        )}

        <View style={styles.media}>
          <TouchableOpacity onPress={getPermissionToOpenLibrary}>
            <FontAwesome name="photo" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionToOpenCamera}>
            <FontAwesome name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.allInput}>
        <TextInput
          value={email}
          style={[styles.input, styles.borderRed]}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInput
          value={username}
          style={[styles.input, styles.borderRed]}
          onChangeText={(text) => {
            setUsername(text);
          }}
        />
        <TextInput
          multiline={true}
          textAlignVertical="top"
          style={[styles.input, styles.inputDescription, styles.borderRed]}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
          }}
        />
      </View>

      <TouchableOpacity onPress={editInfo}>
        <Text
          style={[
            styles.update,
            styles.borderRed,
            styles.textSize20,
            styles.textGray,
          ]}
        >
          Update Profile
        </Text>
      </TouchableOpacity>

      {/* {selectedPic && (
        <Image source={{ uri: selectedPic }} style={styles.img} />
      )} */}
      <TouchableOpacity
        onPress={() => {
          setToken(null);
        }}
        style={[styles.logOut, styles.borderRed]}
      >
        <Text style={[styles.textSize20, styles.textGray, styles.textAlign]}>
          Log Out
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  borderRed: {
    borderColor: "#EB5A62",
  },
  flexRow: {
    flexDirection: "row",
  },
  textSize20: {
    fontSize: 20,
  },
  textAlign: {
    textAlign: "center",
  },

  img: {
    width: 100,
    height: 100,
  },

  avatarChange: {
    // borderWidth: 3,
    gap: 15,
    marginTop: 15,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 90,
    borderWidth: 1,
    padding: 5,
  },
  media: {
    justifyContent: "space-evenly",
  },

  allInput: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 5,
    width: "75%",
  },
  inputDescription: {
    borderWidth: 1,
    height: 100,
  },

  update: {
    borderWidth: 3,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
    width: 220,
    textAlign: "center",
  },
  logOut: {
    borderWidth: 3,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
    width: 220,
    textAlign: "center",
    backgroundColor: "lightgray",
  },
});
