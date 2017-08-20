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

export default class GetHead extends React.Component{
    constructor(props){
        super(props);
        this.state={
            fileImage:this.props.fileImage,
            fileImageName:this.props.fileImageName
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
        let fileImage = new Object();
        fileImage.uri = this.state.fileImage;
        fileImage.fileImageName = this.state.fileImageName;
        this.props.choiceFileImage(fileImage);
        console.log(fileImage);
        if(navigator){
            navigator.pop();
        }
    }
    render (){
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                {/*导航栏*/}
                <NavBar leftItemFunc={this.backLogin}
                        leftImageSource={Back}
                        barBGColor='#1596fe'
                        titleTextColor='#fff'
                        rightTextColor='#fff'
                        rightItemTitle={'保存'}
                        rightItemFunc={this.completeChoice.bind(this)}
                />
                <Image source={this.props.fileImage} style={{flex:1,resizeMode:'contain'}}/>
            </View>
        )
    }
}