import * as React from "react";

import { Text, View } from "react-native";

import Home from "./Components/home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import LoginSelection from "./Components/LoginSelection";
import { NavigationContainer } from "@react-navigation/native";
import SpecialistList from "./Components/SpecialistList";
import CourseDetails from "./Components/CourseDetails";

import Tab from "./Components/Tabs";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginSelection"
          component={LoginSelection}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomePage"
          component={Tab}
        />
          <Stack.Screen
          options={{ headerShown: false }}
          name="SpecialistList"
          component={SpecialistList}
        />
          <Stack.Screen
          options={{ headerShown: false }}
          name="CourseDetails"
          component={CourseDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;