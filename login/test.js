import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    TouchableHighlight,
    Platform,
    Navigator
} from 'react-native';
var Back = require('../img/back.png');
import NavBar from '../component/navbar';

export default class Test extends React.Component{
    static PropTypes={
        userImage:PropTypes,
        popImage:PropTypes.func
    }
    constructor(props){
        super(props);
        this.state={
            Image:this.props.userImage
        }
    }
    backLogin= ()=>{
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    completeChoice= ()=>{
        const {navigator}=this.props;
        let copyImage=this.state.Image
        this.props.popImage(copyImage)
        if(navigator){
            navigator.pop();
        }
    }
    render (){
        return (
            <View style={{flex:1}}>
                {/*导航栏*/}
                <NavBar leftItemFunc={this.backLogin}
                        leftImageSource={Back}
                        barBGColor='#1596fe'
                        titleTextColor='#fff'
                        rightTextColor='#fff'
                        rightItemTitle={'保存'}
                        rightItemFunc={this.completeChoice.bind(this)}
                />
                <Image source={this.state.Image} style={{flex:1,resizeMode:'contain'}}/>
            </View>
        )
    }
}