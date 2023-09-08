import { Button, Text, View } from "react-native";

export default function SettingsScreen({ setToken }) {
  return (
    <View>
      <Button
        title="Log Out"
        onPress={() => {
          setToken(null);
        }}
      />
    </View>
  );
}
