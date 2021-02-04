import * as React from "react";

import { Appbar, Searchbar } from "react-native-paper";
import { Card, Divider, Text } from "react-native-elements";
import {
  FlatList,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import accesClient from "./config/accesClient";
import { courseImgUrl } from "./config/imghttp";
import { useNavigation } from "@react-navigation/native";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user:{},
      loading: true,
      CoursesData: [],
      filtredData: [],
      searchQuery: "",
    };
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.getcourse();
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
      this.showToast("Course added to cart !");
    }
  };
  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      console.log("im here" + jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  };

  handleSearcheChange = (query) => {
    this.setState({
      searchQuery: query,
    });
    var filtred = this.state.CoursesData.filter((item) =>
      item.name_co.toLowerCase().includes(query.toLowerCase())
    );
    this.setState({
      filtredData: filtred,
    });
  };
  async componentDidMount() {
    var logged = await this.getData();
    logged[0]
      ? this.setState({ user: logged[0] })
      : this.props.navigation.navigate("Login");
    this.getcourse();
  }

  async getcourse() {
    this.state.user.id ? await accesClient
          .get(`/course/notbought/${this.state.user.id}`)
          .then((res) => {
            this.setState({
              CoursesData: res.data.course,
              filtredData: res.data.course,
            });
          })
      : null;
  }


  componentWillUnmount = async () => {
    this.focusListener();
  };

 

  render() {
    const Cat = ({ item }) => {
      const navigation = useNavigation();
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
            <Text style={styles.notes}>Course Name:{item.name_co}</Text>
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
            title="Search"
            titleStyle={{ color: "black", padding: 20 }}
          />
        </Appbar.Header>
        <View style={{ marginHorizontal: 10 }}>
          <Searchbar
            onChangeText={this.handleSearcheChange}
            value={this.state.searchQuery}
            placeholder="Search"
            style={{
              borderWidth: 1,
              borderColor: "white",
              elevation: 15,
              margin: 20,
            }}
          />
        </View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          keyExtractor={(item) => item.id.toString()}
          data={this.state.filtredData}
          renderItem={({ item }) => <Cat item={item} />}
        />
      </View>
    );
  }
}
const { height, width } = Dimensions.get("screen");
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffa500",
    marginTop: 20,

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
});
export default Search;
