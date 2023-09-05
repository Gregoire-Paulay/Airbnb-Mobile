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
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();

  const [errorMessage, setErrorMessage] = useState("");

  // State pour gérer mes input
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State pour gérer l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const Submit = () => {
    const fetchData = async () => {
      try {
        setErrorMessage("");
        if (password !== confirmPassword) {
          setErrorMessage("The password in fields must be the same");
        } else {
          const response = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
            {
              email: email,
              username: username,
              description: description,
              password: password,
            }
          );
          console.log(response.data);
          alert("Compte créer avec succès");
          const userToken = response.data.token;
          setToken(userToken);
        }
      } catch (error) {
        console.log("ERROR ==>", error.response.data);
        if (error.response.data.error === "Missing parameter(s)") {
          setErrorMessage("Please fill all fields.");
        } else if (
          error.response.data.error === "This email already has an account."
        ) {
          setErrorMessage("This email already has an account.");
        } else if (
          error.response.data.error === "This username already has an account."
        ) {
          setErrorMessage("This username is already used.");
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
          Sign up
        </Text>
      </View>

      <View style={styles.allInput}>
        <TextInput
          placeholder="Email"
          value={email}
          style={styles.input}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
          }}
        />

        <TextInput
          placeholder="Describe yourself"
          style={styles.input}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
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

        <View style={[styles.password, styles.flexRow]}>
          <TextInput
            placeholder="Confirm password"
            secureTextEntry={!showConfirmedPassword}
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShowConfirmedPassword(!showConfirmedPassword);
            }}
          >
            <AntDesign name="eye" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.error}>{errorMessage ? errorMessage : ""}</Text>
        <View style={styles.submit}>
          <Button
            title="Sign up"
            color={Platform.OS === "android" ? "" : "gray"}
            onPress={async () => {
              Submit();
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        >
          <Text>Already got an account ? Sign in</Text>
        </TouchableOpacity>

        {/* <Button
          title="Sign up"
          onPress={async () => {
            // const userToken = "secret-token";
            // setToken(userToken);
          }}
        /> */}
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

  allInput: {
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "red",
    marginBottom: 20,
    // width: 300,
    paddingBottom: 8,
    width: "75%",
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
