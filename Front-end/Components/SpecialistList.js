import * as React from "react";

import { Card, Divider, Text } from "react-native-elements";
import {
  FlatList,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Component } from "react";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import accesClient from "./config/accesClient";
import { courseImgUrl } from "./config/imghttp";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("screen");

class SpecialistList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loading: true,
      CoursesData: "",
    };
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
       
       await this.getcourse();
      }
    );
  }
  showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  addCourse = async (course) => {
    const jsonValue = await AsyncStorage.getItem("Cart");
    if (jsonValue !== null) {
      var myCourses = JSON.parse(jsonValue);
      console.log("myCourses");

      console.log(myCourses);
      let founded = myCourses.find((element) => element.id === course.id);
      founded
        ? this.showToast("Item Already exist in cart !")
        : myCourses.push(course);
      myCourses = JSON.stringify(myCourses);
      console.log("myCourses1");
      console.log(myCourses);
      AsyncStorage.setItem("Cart", myCourses);
      this.showToast("Course has been aded to cart !");
    } else {
      let addCourse = [course];
      console.log("addCourse");
      console.log(addCourse);
      let final = JSON.stringify(addCourse);
      AsyncStorage.setItem("Cart", final);
      this.showToast("Course has been aded to cart !");
    }
  };
  async getcourse() {
    
    this.state.user.id ? await accesClient
          .get("/Course/category/"+this.props.route.params.id+"/"+this.state.user.id)
          .then((res) => {
            this.setState({
              CoursesData: res.data.course,
            });
          })
      : null;
  }
  async componentDidMount() {
    var logged = await this.getData();
    logged
      ? await this.setState({ user: logged[0] })
      : this.props.navigation.navigate("Login");
      await this.getcourse();
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

  componentWillUnmount = async () => {
    this.focusListener();
  };

  render() {
    const { navigation, route } = this.props;
    const { nom } = route.params;

    const Courses = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CourseDetails", {
              id: item.id,
              nom: item.name_co,
            })
          }
        >
          <Card containerStyle={styles.card}>
            <Image
              style={styles.image}
              source={{ uri: courseImgUrl + item.id }}
            />
            <Divider
              style={{ backgroundColor: "#dfe6e9", marginVertical: 15 }}
            />
            <Text style={styles.notes}>Center Name:{item.center}</Text>
            <Text style={styles.notes}>Course Name: {item.name_co}</Text>
            <Text style={styles.notes}>Category:{item.category}</Text>
            <Divider
              style={{ backgroundColor: "#dfe6e9", marginVertical: 15 }}
            />
            <TouchableOpacity
              onPress={() => this.addCourse(item)}
              style={styles.button}
            >
              <Text style={styles.time}>
                {" "}
                <Ionicons name="cart" size={25} color="black" /> Price:
                {item.price}$
              </Text>
            </TouchableOpacity>
          </Card>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <Appbar.Header style={{ backgroundColor: "#FFFFFF", elevation: 0 }}>
          <Appbar.Content
            title={nom}
            titleStyle={{ color: "black", padding: 20 }}
          />
        </Appbar.Header>
        <FlatList
          contentContainerStyle={{ paddingBottom: 80 }}
          data={this.state.CoursesData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Courses item={item} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffa500",
    marginTop: 20,
    marginBottom: 10,

    borderWidth: 0,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
  },
  time: {
    alignSelf: "center",

    fontSize: 25,
    color: "black",
    fontWeight: "bold",
  },
  notes: {
    fontSize: 20,
    color: "#fff",
    textTransform: "capitalize",
  },
  image: {
    alignSelf: "center",
    borderWidth: 4,
    borderColor: "black",
    width: 350,
    height: 200,
    borderRadius: 25,

    backgroundColor: "#ffa500",
  },
  button: {
    backgroundColor: "#dfe6e9",
    borderRadius: 25,
  },

  //============
});

export default function (props) {
  const Navigation = useNavigation();

  return <SpecialistList {...props} Navigation={Navigation} />;
}
