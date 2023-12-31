import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import de mes écrans
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomSreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import AroundMeScreen from "./containers/AroundMeScreen";

// import ProfileScreen from "./containers/ProfileScreen";
// import SplashScreen from "./containers/SplashScreen";

// Import de mes Components
import Logo from "./components/Logo";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                {/* -------------------------------- */}
                {/* -- PREMIER ONGLET (HOME) ------- */}
                {/* -------------------------------- */}

                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      {/* -- Premier écran du premier onglet */}
                      <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                          headerTitle: () => <Logo />,
                          headerTitleAlign: "center",
                        }}
                      />

                      <Stack.Screen
                        name="Room"
                        component={RoomScreen}
                        options={{
                          headerTitle: () => <Logo />,
                          headerTitleAlign: "center",
                        }}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                {/* -------------------------------- */}
                {/* - DEUXIEME ONGLET (AROUND ME) -- */}
                {/* -------------------------------- */}

                <Tab.Screen
                  name="AroundMe"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"ios-location-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Location"
                        component={AroundMeScreen}
                        options={{
                          headerTitle: () => <Logo />,
                          headerTitleAlign: "center",
                        }}
                      />
                      <Stack.Screen
                        name="RoomMap"
                        component={RoomScreen}
                        options={{
                          headerTitle: () => <Logo />,
                          headerTitleAlign: "center",
                        }}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                {/* -------------------------------- */}
                {/* - TROISIEME ONGLET (SETTINGS) -- */}
                {/* -------------------------------- */}

                <Tab.Screen
                  name="TabSettings"
                  options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"ios-options"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Settings"
                        options={{
                          headerTitle: () => <Logo />,
                          headerTitleAlign: "center",
                        }}
                      >
                        {() => (
                          <SettingsScreen
                            setToken={setToken}
                            userToken={userToken}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
