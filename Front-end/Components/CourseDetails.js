import * as React from "react";

import { Card, Divider, Text } from "react-native-elements";
import { Dimensions, ScrollView } from "react-native";
import { Image, StyleSheet, ToastAndroid, TouchableOpacity, View } from "react-native";

import { Appbar } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import Moment from "moment";
import accesClient from "./config/accesClient";
import { courseImgUrl } from "./config/imghttp";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("screen");

class CourseDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      CoursesData: {},
    };
  }

  async getcourse(idCourse) {
    await accesClient.get("/course/"+idCourse).then((res) => {
      console.log(res.data.course[0]);

      this.setState({
        CoursesData: res.data.course[0],
      });
    });
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
          this.showToast("Course has been aded to cart !") 


    }else{
      let addCourse= [course]
      console.log('addCourse');
      console.log(addCourse);
      let final=JSON.stringify(addCourse)
      AsyncStorage.setItem('Cart',final);
      this.showToast("Course added to cart !") 

    }
   }
  componentDidMount() {
    this.getcourse(this.props.route.params.id);
    console.log(this.state.CoursesData);
  }
/**/ 
  render() {
    const { navigation, route } = this.props;
    const { nom,id } = route.params;
    return (
      <ScrollView>
      <View>
        <Appbar.Header style={{ backgroundColor: "#FFFFFF", elevation: 0 }}>
          <Appbar.Content
            title={nom}
            titleStyle={{ color: "black", padding: 20 }}
          />
        </Appbar.Header>
        <Card containerStyle={styles.card}>
        <Image
            style={styles.image}
            source={{ uri: courseImgUrl + id }}
          />
          <Divider style={{ backgroundColor: "#dfe6e9", marginVertical: 15 }} />
          <Text style={styles.notes}>
            Center Name:{this.state.CoursesData.center}
          </Text>
          <Text style={styles.notes}>
            Course Name: {this.state.CoursesData.name_co}
          </Text>
          <Text style={styles.notes}>
            Category:{this.state.CoursesData.category}
          </Text>

          <Text style={styles.notes}>
            Description: {this.state.CoursesData.description}
          </Text>
          <Divider style={{ backgroundColor: "#dfe6e9", marginVertical: 20 }} />
          <Text style={styles.notes}>
            date:{Moment(this.state.CoursesData.date).format("DD/MM/Y")}
          </Text>
          <Text style={styles.notes}>
            time:{Moment(this.state.CoursesData.date).format("HH:mm")}
          </Text>
          <Text style={styles.notes}>
            Duration:{this.state.CoursesData.duration}H
          </Text>
          <Text style={styles.notes}>
            Rating: {this.state.CoursesData.rating}
          </Text>

          <Divider style={{ backgroundColor: "#dfe6e9", marginVertical: 25 }} />

          <TouchableOpacity onPress={()=>this.addCourse(this.state.CoursesData)} style={styles.button}>
            <Text style={styles.time}>
              {" "}
              <Ionicons name="cart" size={25} color="black" /> Price:
              {this.state.CoursesData.price}$
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffa500",
    marginTop: 10,
    marginBottom:10,
    borderWidth: 0,
    borderRadius: 20,
    justifyContent:"center",
  },
  time: {
    alignSelf:"center",

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
    alignSelf:"center",
    borderWidth: 4,
    borderColor: "black",
    width: 350,
    height: 200,
    borderRadius:25,

    backgroundColor: "#ffa500",
  },button:{
    backgroundColor: "#dfe6e9",
     borderRadius:25,
  }
  //============
});

export default function (props) {
  const Navigation = useNavigation();

  return <CourseDetails {...props} Navigation={Navigation} />;
}
