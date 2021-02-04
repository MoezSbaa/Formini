import * as React from "react";
import { categoryImgUrl } from "./config/imghttp";
import accesClient from "./config/accesClient";

import {
  ToastAndroid,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Appbar } from "react-native-paper";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get("screen");

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:{},
      loading: true,
      categories: {},
    };
  }
  showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
   addCourse =async(course)=>{
    const jsonValue = await AsyncStorage.getItem("Cart");
    if(jsonValue!==null){
          var myCourses=JSON.parse(jsonValue)
          console.log("myCourses");

          console.log(myCourses);
          let founded =  myCourses.find(element => element.id===course.id)
          founded ?this.showToast("Item Already exist in cart !") 
          :myCourses.push(course)
           myCourses= JSON.stringify(myCourses)
           console.log("myCourses1");
           console.log(myCourses);
          AsyncStorage.setItem('Cart',myCourses);

    }else{
      let addCourse= [course]
      console.log('addCourse');
      console.log(addCourse);
      let final=JSON.stringify(addCourse)
      AsyncStorage.setItem('Cart',final);
      this.showToast("Course added to cart !") 

    }
   }

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      console.log("im here" + jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  };
  getCategory = async () => {
    await accesClient.get("/category").then((res) => {
      console.log(res.data.category);

      this.setState({
        categories: res.data.category,
      });
    });
  };
  componentDidMount = async() => {
    const {navigation} = this.props;
    navigation.addListener ('focus', async() =>{
      this.getCategory();
    });
    this.getCategory();
    var logged = await this.getData();
    logged ? null : this.props.navigation.navigate("Login");
  };
  //

  render() {
    const Cat = ({ item }) => {
      const navigation = useNavigation();

      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SpecialistList", {
              id: item.id,
              nom: item.nom,
            })
          }
        >
          <ImageBackground
            source={{ uri: categoryImgUrl + item.id }}
            style={styles.image}
          >
            <Image
              source={{
                uri: item.image,
              }}
              resizeMode="cover"
            />
            <Text style={styles.text}>{item.nom}</Text>
          </ImageBackground>
        </TouchableOpacity>
      );
    };
    return (
      <View>
        <Appbar.Header style={{ backgroundColor: "#FFFFFF", elevation: 0 }}>
          <Appbar.Content
            title="Categories"
            titleStyle={{ color: "black", padding: 20 }}
          />
        </Appbar.Header>
        <FlatList
          contentContainerStyle={{ paddingBottom: 150 }}
          data={this.state.categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Cat item={item} />}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    margin: 25,
    height: height * 0.2,
    width: width * 0.8,
    resizeMode: "contain",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: width * 0.1,
    borderColor: "black",
    borderWidth: 3,
  
  },
  text: {
    backgroundColor: "black",
    justifyContent: "flex-end",
    color: "#ffa500",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default function (props) {
  const Navigation = useNavigation();

  return <Categories {...props} Navigation={Navigation} />;
}
