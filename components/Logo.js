import { Image, StyleSheet } from "react-native";

const Logo = () => {
  return <Image source={require("../assets/logo.png")} style={styles.logo} />;
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
