import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
        console.log(response.data);

        const userToken = response.data.token;
        // console.log(userToken);
        setToken(userToken);
      } catch (error) {
        console.log("ERROR ==>", error.response.data);
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
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />

        <View style={[styles.password, styles.flexRow]}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={(text) => {
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
        <View style={styles.submit}>
          <Button
            title="Sign in"
            color={Platform.OS === "android" ? "" : "gray"}
            onPress={async () => {
              Submit();
            }}
          />
        </View>

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

  logo: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "red",
    marginBottom: 20,
    // width: 300,
    paddingBottom: 8,
    width: "75%",
  },
  allInput: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },

  error: {
    color: "red",
    marginTop: 50,
  },
  submit: {
    borderColor: "red",
    borderWidth: 3,
    paddingVertical: 8,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  password: {
    width: "85%",
    justifyContent: "center",
    gap: 15,
  },
});
