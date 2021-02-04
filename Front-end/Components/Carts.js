import * as React from "react";

import { Appbar, Avatar, Searchbar } from "react-native-paper";
import { Button, Input } from "react-native-elements";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
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

const { height, width } = Dimensions.get("screen");

class Cart extends React.Component {
  
  constructor(props) {
   
    super(props);
    this.state = {
      user:{},
      cart: [],
      total: 0,
    };
    this.focusListener =this.props.navigation.addListener("focus", async () => {
      this.getData();
    });
  }
  showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  doCheckout=async()=>{
    const jsonValue = await AsyncStorage.getItem('user')
    const user=JSON.parse(jsonValue)

    await accesClient.post("/user/checkout",{
      id:user[0].id,
      courses:this.state.cart,
    }).then(result=>{
        this.showToast(result.data.message)
        AsyncStorage.removeItem("Cart");
        this.setState({ cart: [], total: 0 });
    }).catch(err=>{
      this.showToast(  err.response.data.message)
    })
  }
  clearCart = () => {
    AsyncStorage.removeItem("Cart");
    this.setState({ cart: [], total: 0 });
  };
  removeCours=async(id)=>{
    const cart = this.state.cart.filter((item) => item.id !== id);
    await  this.setState({cart});
    let final=JSON.stringify(this.state.cart)
    await AsyncStorage.setItem('Cart',final);
    this.getData()
  }
  

  getData = async () => {
    const jsonValue = await AsyncStorage.getItem("Cart");
    this.setState({
      cart: jsonValue !== null ? JSON.parse(jsonValue) : [],
    });
    let total =this.state.cart.map((course) => course.price?course.price:0).reduce((previousValue, course) => course + previousValue);
    this.setState({
      total,
    });
  };
  async componentDidMount() {
    this.getData();
  }
  componentWillUnmount = () => {
    this.focusListener();
}

  render() {
    const Cat = ({ item }) => {
      const navigation = useNavigation();

      return (
        <View style={styles.item}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CourseDetails", {
                id: item.id,
                nom: item.name_co,
              })
            }
          >
            <View style={{   flexDirection: "row", justifyContent: "space-between"   }}>
              <View
                style={{
                  backgroundColor: "white",
                  height: 130,
                  width: "99%",
                  position: "absolute",

                  left: "10%",
                  borderTopLeftRadius: 30,
                  borderBottomLeftRadius: 30,
                  borderTopRightRadius: 20,
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      position: "absolute",

                      left: "25%",
                      fontSize: 23,
                      fontWeight: "bold",
                    }}
                  >
                    {item.name_co}
                  </Text>
                  <Text style={styles.text}>{item.price}$</Text>
                </View>
              </View>
              <View style={{ justifyContent: "center", elevation: 6 }}>
                <Image
                  source={{ uri: courseImgUrl + item.id }}
                  style={{ width: 100, height: 100, borderRadius: 5 }}
                  resizeMode="cover"
                />
                <Text style={styles.title}>{item.name}</Text>
              </View>
              <Button
                title=""
                onPress={()=>this.removeCours(item.id)}
                icon={<Ionicons name="close-outline" size={20} color="white" />}
                buttonStyle={{
                  marginLeft:40,
                  backgroundColor: "red",
                  borderRadius: 30,
                  alignSelf: "flex-end",
                
                }}
                titleStyle={{ color: "white", alignSelf: "center" }}
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View>
        <Appbar.Header style={{ backgroundColor: "#FFFFFF", elevation: 0 }}>
          <Appbar.Content
            title="Cart"
            titleStyle={{ color: "black", padding: 20 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Total:</Text>
          <Text style={{ color: "orange", fontSize: 20 }}>
            {this.state.total}$
          </Text>
        </Appbar.Header>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            onPress={this.doCheckout}
            disabled={this.state.cart.length == 0}
            title="checkout"
            icon={{
              name: "shopping-cart",
              size: 35,
              color: "orange",
            }}
            buttonStyle={{
              width: width * 0.65,
              marginLeft: width * 0.04,
              backgroundColor: "white",
              borderRadius: 30,
              borderColor: "orange",
              borderWidth: 2,
            }}
            titleStyle={{ color: "orange", alignSelf: "center" }}
          />
          <Button
            title=""
            onPress={this.clearCart}
            icon={<Ionicons name="trash" size={35} color="white" />}
            buttonStyle={{
              width: width * 0.2,
              marginRight: width * 0.04,
              backgroundColor: "red",
              borderRadius: 30,
              alignSelf: "flex-end",
            }}
            titleStyle={{ color: "white", alignSelf: "center" }}
          />
        </View>
        {this.state.cart.length === 0 ? null : (
          <FlatList
            style={{ marginBottom: 100 }}
            data={this.state.cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Cat item={item} />}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  item: {
    flex: 1,

    height: height * 0.2,
    width: width * 0.8,
    resizeMode: "contain",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: width * 0.1,
  },
  text: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
  },
});
export default Cart;
