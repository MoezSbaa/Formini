import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import Cart from "./Carts";
import Categories from "./Categories";
import Feather from "react-native-vector-icons/Feather";
import Home from "./home";
import Ion from "react-native-vector-icons/Ionicons";
import Mat from "react-native-vector-icons/MaterialIcons";
import Profile from "./Profile";
import React from "react";
import Search from "./Search";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function Tab() {
  const Tabs = AnimatedTabBarNavigator();

  return (
    <Tabs.Navigator
      tabBarOptions={{
        activeTintColor: "#875d10",
        activeBackgroundColor: "#ffa500 ",
      }}
      appearence={{
        tabBarBackground: "#DCDCDC",
      }}
      style={{ elevation: 1 }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Feather
              name="home"
              size={size ? size : 24}
              color={focused ? color : "black"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        component={Search}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Feather
              name="search"
              size={size ? size : 24}
              color={focused ? color : "black"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Feather
              name="list"
              size={size ? size : 30}
              color={focused ? color : "black"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ion
              name="person"
              size={size ? size : 24}
              color={focused ? color : "black"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        component={Cart}
        options={{
          tabBarBadge: 3,
          tabBarIcon: ({ focused, color, size }) => (
            <Mat
              name="shopping-cart"
              size={size ? size : 24}
              color={focused ? color : "black"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
export default Tab;
