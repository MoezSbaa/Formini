import  React,{useEffect,useState} from "react";

import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import { Button } from "react-native-elements";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("screen");


function LoginSelection() {
  const navigation = useNavigation();
  const [value, setValue] = useState(null);

  function readItem() {
    AsyncStorage.getItem("user").then(itemValue => setValue(itemValue));
  }
  useEffect(() => {
    readItem()
    value?navigation.navigate("HomePage") :null
  });

  return (
    <>
      <ImageBackground
        source={{
          uri:
            "https://compote.slate.com/images/ad27ef8a-0ea1-46b7-b515-415c4af18528.jpg?width=960",
        }}
        style={styles.image}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image source={require("../assets/formini.png")} />
        </View>
        <View
          style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
        ></View>
        <View style={{ flex: 1 }}>
          <Button
            title="Connexion"
            buttonStyle={{
              width: width * 0.5,
              marginLeft: width * 0.25,
              backgroundColor: "white",
              borderRadius: 30,
            }}
            titleStyle={{ color: "orange", alignSelf: "center" }}
            onPress={() => navigation.navigate("Login")}
          />
          <Button
            title="Crée un compte"
            buttonStyle={{
              width: width * 0.5,
              marginLeft: width * 0.25,
              backgroundColor: "orange",
              borderRadius: 30,
              marginTop: 50,
            }}
            titleStyle={{ color: "white", alignSelf: "center" }}
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
      </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,

    height: height,
    width: width,
    resizeMode: "contain",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoginSelection;
