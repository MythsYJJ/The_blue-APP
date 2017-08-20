import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    ListView,
    RefreshControl,
    TouchableHighlight,
    BackAndroid
} from 'react-native';

import NavBar from '../component/navbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomSync from '../sync';
import Productlist from './Product_list';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');


//已买到的产品
export default class Product extends React.Component{

    constructor(props){
        super(props);
        this.state={
            listdata:[]

        }
        // this.loadProductList()
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        const {navigator} = this.props;
        if(navigator){
            var routes = navigator.state.routeStack;
            for (var i = routes.length - 1; i >= 0; i--) {
                if (routes[i].name === "Main") {
                    var destinationRoute = navigator.getCurrentRoutes()[i]
                    navigator.popToRoute(destinationRoute);
                }
            }
            return true;
        }
        return false;
    };

    render(){
        return (
            <View style={styles.container}>
                <NavBar title={'我的订单'}
                    rightItemvisible={false}
                    leftitemvisible={true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                <Productlist navigator={this.props.navigator}/>
            </View>
        )
    }
   
    backView() {
        const {navigator}=this.props;
        if(navigator){
            var routes = navigator.state.routeStack;
            for (var i = routes.length - 1; i >= 0; i--) {
                if (routes[i].name === "Main") {
                    var destinationRoute = navigator.getCurrentRoutes()[i]
                    navigator.popToRoute(destinationRoute);
                }
            }
        }
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#fff'
    },
      Name:{
        fontSize:18,
        paddingLeft:3
        // marginLeft: 5
    },
})
