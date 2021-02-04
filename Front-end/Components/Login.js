import * as React from "react";

import { Button, Input } from "react-native-elements";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from "react-native";
import accesClient from "./config/accesClient";

import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import useForm from "react-hooks-form-validator";

const { height, width } = Dimensions.get("screen");
const formConfig = {
  mail: {
    required: true,
    patterns: [
      {
        regex: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        errorMsg: "Please enter a Valid email !",
      },
    ],
  },
  password: {
    min: 6,
    max: 20,
    required: true,
  },
};
const showToast = (message) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};
function Login() {
  const navigation = useNavigation();

  const [fields, formData] = useForm(formConfig);

  const doLogin = async () => {
    await accesClient
      .post("/user/login", {
        mail: fields.mail.value,
        password: fields.password.value,
      })
      .then((res) => {
        let user= JSON.stringify(res.data.user)
        AsyncStorage.setItem('user',user);
        AsyncStorage.removeItem('Cart');

        navigation.navigate("HomePage");

      })
      .catch((err) => {
        showToast(
          err.response.data.message
            ? err.response.data.message
            : "Something bad happened"
        );
        
      });
   
  };

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
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: width * 0.1,
          }}
        >
          <Input
            placeholder="E-mail"
            label={"Email"}
            labelStyle={{ color: "white" }}
            inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
            onChangeText={fields.mail.setValue}
            value={fields.mail.value}
          />
          {fields.mail.errorMsg ? (
            <Text style={styles.errmsg}>{fields.mail.errorMsg}</Text>
          ) : null}

          <Input
            placeholder="Password"
            label={"Password"}
            labelStyle={{ color: "white" }}
            secureTextEntry={true}
            onChangeText={fields.password.setValue}
            value={fields.password.value}
            inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
          />
          {fields.password.errorMsg ? (
            <Text style={styles.errmsg}>{fields.password.errorMsg}</Text>
          ) : null}
          <Button
            title="Login"
            buttonStyle={{
              width: width * 0.5,
              backgroundColor: "white",
              borderRadius: 30,
            }}
            titleStyle={{ color: "orange", alignSelf: "center" }}
            onPress={doLogin}
            disabled={!formData.isValid}
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
  errmsg: {
    fontWeight: "bold",
    borderRadius: 5,

    backgroundColor: "#F08080",
    color: "red",
  },
});

export default Login;
