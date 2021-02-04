import * as React from "react";
import { Card, Divider } from "react-native-elements";
import { userImgUrl } from "./config/imghttp";
import { courseImgUrl } from "./config/imghttp";

import {
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import accesClient from "./config/accesClient";
import { ScrollView } from "react-native-gesture-handler";
import Moment from "moment";

const { height, width } = Dimensions.get("screen");

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      courses: [],
    };
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        this.getCourses();
      }
    );
  }

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  };

  doSignout = async () => {
    await AsyncStorage.removeItem("user");
    //this.props.navigation.navigate("Login");
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "LoginSelection" }],
    });
  };
  getCourses = async () => {
    console.log(this.state.user.id);
    this.state.user.id
      ? await accesClient
          .get(`/course/user/${this.state.user.id}`)
          .then((res) => {
            this.setState({
              courses: res.data.course,
            });
            console.log(this.state.courses);
          })
          .catch((err) => {
            console.log(err);
          })
      : null;
  };

  async componentDidMount() {
    var logged = await this.getData("user");
    logged ? null : this.props.navigation.navigate("Login");
    console.log(logged);
    await this.setState({ user: logged[0] });
    await this.getCourses();
  }
  list = () => {
    return this.state.courses.map((item) => {
      return (
        <Card key={item.id} containerStyle={styles.card}>
          <View style={{ justifyContent: "center", elevation: 6 }}>
            <Image
              style={styles.image}
              source={{ uri: courseImgUrl + item.id }}
            />
          </View>

          <Text style={styles.notes}>Center Name:{item.center}</Text>
          <Text style={styles.notes}>Course Name: {item.name_co}</Text>
          <Text style={styles.notes}>Category:{item.category}</Text>
          <Text style={styles.notes}>
            Description: {item.description}
          </Text>
          <Divider style={{ backgroundColor: "#dfe6e9", marginVertical: 20 }} />
          <Text style={styles.notes}>
            date:{Moment(item.date).format("DD/MM/Y")}
          </Text>
          <Text style={styles.notes}>
            time:{Moment(item.date).format("HH:mm")}
          </Text>
          <Text style={styles.notes}>
            Duration:{item.duration}H
          </Text>
          <Text style={styles.notes}>
            Rating: {item.rating}
          </Text>
          <Divider style={{ backgroundColor: "#dfe6e9", marginVertical: 15 }} />
        </Card>
      );
    });
  };
  componentWillUnmount = async () => {
    this.focusListener();
  };
  render(props) {
    return (
      <ScrollView>
        <View>
          <View style={styles.container}>
            <View style={styles.header}></View>

            <Image
              style={styles.avatar}
              source={{
                uri: userImgUrl + this.state.user.id,
              }}
            />
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{this.state.user.first_name}</Text>
                <Text style={styles.name}>{this.state.user.last_name}</Text>
                <Text style={styles.info}>{this.state.user.mail}</Text>
                <Text style={styles.info}>{this.state.user.profession}</Text>

                <TouchableOpacity
                  onPress={this.doSignout}
                  style={styles.buttonContainer}
                >
                  <Text>Disconnect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          <Text style={styles.name}>My Courses</Text>
          {this.list()}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#000000",
    height: 200,
    borderBottomWidth: 5,
    borderBottomColor: "orange",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
    borderColor: "orange",
  },

  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "orange",
    fontWeight: "600",
  },
  info: {
    fontSize: 16,
    color: "#3c3c3c",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#3c3c3c",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "orange",
  },
  card: {
    backgroundColor: "#ffa500",
    marginTop: 20,
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
  },

  notes: {
    fontSize: 20,
    color: "#fff",
    textTransform: "capitalize",
    textAlignVertical: "top",
  },
  image: {
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "black",
    width: 250,
    height: 150,
    borderRadius: 5,
    backgroundColor: "#ffa500",
  },
});
export default Profile;
