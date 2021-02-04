import React, { useState, useEffect } from "react";
import accesClient from "./config/accesClient";

import { Button, Input } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  ScrollView,
  View,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useForm from "react-hooks-form-validator";

const { height, width } = Dimensions.get("screen");
const formConfig = {
  first_name: {
    required: true,
    min: 3,
    max: 20,
  },
  last_name: {
    min: 3,
    max: 20,
    required: true,
  },
  profession: {
    min: 3,
    max: 20,
    required: true,
  },
  gender: {
    required: true,
  },
  mail: {
    required: true,
    patterns: [
      {
        regex: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        errorMsg: "Please enter a Valid email !",
      },
    ],
  },
  phone: {
    required: true,
    patterns: [
      {
        regex: new RegExp(/^[0-9]{8}$/),
        errorMsg: "Please enter a Valid phone number !",
      },
    ],
  },
  adress: {
    min: 3,
    max: 20,
    required: true,
  },
  password: {
    min: 6,
    max: 20,
    required: true,
  },
};
function SignUp() {
  const navigation = useNavigation();
  const [file, setImage] = useState(null);
  const [fields, formData] = useForm(formConfig);




  const doSignup = async () => {
    let localUri = file.uri;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const data = new FormData();
    data.append("first_name", fields.first_name.value);
    data.append("last_name", fields.last_name.value);
    data.append("profession", fields.profession.value);
    data.append("gender", fields.gender.value);
    data.append("mail", fields.mail.value);
    data.append("password", fields.password.value);
    data.append("phone", fields.phone.value);
    data.append("adress", fields.adress.value);
    data.append("file", { uri: localUri, name: filename, type });
    await accesClient
      .post("/user", data, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((data) =>{console.log() 
        if(data.data.rows.affectedRows===1){
          navigation.navigate("Login")
        }
      } )
      .catch((err) => {console.log(err.response.data.message)
        showToast(err.response.data.message?err.response.data.message:'Something bad happened')

      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      noData: true,
    });

    console.log(result);

    if (result.uri) {
      setImage(result);
    }
  };
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
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
        <ScrollView style={{ marginBottom: 10 }}>
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
              textContentType="emailAddress"
              labelStyle={{ color: "orange" }}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.mail.setValue}
              value={fields.mail.value}
            />
            {fields.mail.errorMsg ? (
              <Text style={styles.errmsg}>{fields.mail.errorMsg}</Text>
            ) : null}
            <Input
              placeholder=" Password"
              label={"Password"}
              labelStyle={{ color: "orange" }}
              secureTextEntry={true}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.password.setValue}
              value={fields.password.value}
            />
            {fields.password.errorMsg ? (
              <Text style={styles.errmsg}>{fields.password.errorMsg}</Text>
            ) : null}

            <Input
              placeholder=" first Name"
              label={"First Name"}
              labelStyle={{ color: "orange" }}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.first_name.setValue}
              value={fields.first_name.value}
            />
            {fields.first_name.errorMsg ? (
              <Text style={styles.errmsg}>{fields.first_name.errorMsg}</Text>
            ) : null}

            <Input
              placeholder="Last Name"
              label={"Last Name"}
              labelStyle={{ color: "orange" }}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.last_name.setValue}
              value={fields.last_name.value}
            />
            {fields.last_name.errorMsg ? (
              <Text style={styles.errmsg}>{fields.last_name.errorMsg}</Text>
            ) : null}
            <Input
              placeholder="Profession"
              label={"Profession"}
              labelStyle={{ color: "orange" }}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.profession.setValue}
              value={fields.profession.value}
            />
            {fields.profession.errorMsg ? (
              <Text style={styles.errmsg}>{fields.profession.errorMsg}</Text>
            ) : null}
            <Text
              style={{
                color: "orange",
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "left",
                alignSelf: "flex-start",
              }}
            >
              {" "}
              Gender
            </Text>
            <Picker
              label={"Gender"}
              style={{
                height: 25,
                width: 300,
                color: "black",
                backgroundColor: "white",
                borderRadius: 10,
              }}
              selectedValue={fields.gender.value}
              onValueChange={fields.gender.setValue}
            >
              <Picker.Item label="-Gender-" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
            {fields.gender.errorMsg ? (
              <Text style={styles.errmsg}>{fields.gender.errorMsg}</Text>
            ) : null}
            <Input
              textContentType="telephoneNumber"
              placeholder="Phone"
              label={"Phone"}
              keyboardType="numeric"
              labelStyle={{ color: "orange" }}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.phone.setValue}
              value={fields.phone.value}
            />
            {fields.phone.errorMsg ? (
              <Text style={styles.errmsg}>{fields.phone.errorMsg}</Text>
            ) : null}
            <Input
              placeholder="Adress"
              label={"Adress"}
              labelStyle={{ color: "orange" }}
              inputStyle={{ backgroundColor: "white", borderRadius: 10 }}
              onChangeText={fields.adress.setValue}
              value={fields.adress.value}
            />
            {fields.adress.errorMsg ? (
              <Text style={styles.errmsg}>{fields.adress.errorMsg}</Text>
            ) : null}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Button
                title="Pick your photo from liabrary"
                titleStyle={{ color: "orange", alignSelf: "center" }}
                buttonStyle={{
                  width: width * 0.7,
                  backgroundColor: "white",
                  borderRadius: 30,
                  marginBottom: 10,
                }}
                onPress={pickImage}
              />
              {file && (
                <Image
                  source={{ uri: file.uri }}
                  style={{ width: 200, height: 200, borderRadius: 25 }}
                />
              )}
            </View>
            <Button
              title="Sign Up"
              disab
              disabled={!formData.isValid}
              buttonStyle={{
                width: width * 0.5,
                backgroundColor: "orange",
                borderRadius: 30,
              }}
              titleStyle={{ color: "white", alignSelf: "center" }}
              onPress={doSignup}
            />
          </View>
        </ScrollView>
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

export default SignUp;
