import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen({ setToken }) {
  // console.log(Platform.OS);
  const navigation = useNavigation();

  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // constante pour gérer l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const Submit = () => {
    const fetchData = async () => {
      try {
        setErrorMessage("");
        const response = await axios.post(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
          {
            email: email,
            password: password,
          }
        );
        // console.log(response.data);

        const userToken = response.data.token;
        const userId = response.data.id;

        await AsyncStorage.setItem("id", userId);
        setToken(userToken);
      } catch (error) {
        // console.log("ERROR ==>", error.response.data);
        if (error.response.data.error === "Missing parameter(s)") {
          setErrorMessage("Please fill all fields");
        } else if (
          error.response.data.error === "Unauthorized" ||
          "This account doesn't exist !"
        ) {
          setErrorMessage("Email or password incorrect");
        }
      }
    };
    fetchData();
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={[styles.title, styles.textGray, styles.textBold]}>
          Sign in
        </Text>
      </View>
      <View style={styles.allInput}>
        <TextInput
          placeholder="Email"
          style={[styles.input, styles.borderRed]}
          value={email}
          onChangeText={(text) => {
            setErrorMessage("");
            setEmail(text);
          }}
        />

        <View style={[styles.password, styles.flexRow, styles.borderRed]}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setErrorMessage("");
              setPassword(text);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            <AntDesign name="eye" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.error}>{errorMessage ? errorMessage : ""}</Text>

        <TouchableOpacity
          style={[styles.submit, styles.borderRed]}
          onPress={async () => {
            Submit();
          }}
        >
          <Text style={[styles.textGray, styles.textSize20]}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>No account ? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  textGray: {
    color: "#666666",
  },
  textBold: {
    fontWeight: "bold",
  },
  flexRow: {
    flexDirection: "row",
  },
  textSize20: {
    fontSize: 20,
  },

  borderRed: {
    borderColor: "#EB5A62",
  },

  logo: {
    width: 100,
    height: 150,
    resizeMode: "contain",
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

  error: {
    color: "red",
    marginTop: 50,
  },
  submit: {
    borderWidth: 3,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  password: {
    width: "75%",
    justifyContent: "space-between",
    padding: 5,
    gap: 15,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
});
