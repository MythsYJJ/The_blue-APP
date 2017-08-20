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
    TouchableHighlight
} from 'react-native';

import NavBar from '../component/navbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomSync from '../sync';
import Rewardloglist from './RewardLog_List';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');


//我的里程数
export default class Reward extends React.Component{

    constructor(props){
        super(props);
        this.state={
            listdata:[]
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <NavBar title={'我的里程数'}
                    rightItemvisible={false}
                    leftitemvisible={true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                <ScrollableTabView locked={true} renderTabBar={false}>
                    <View style={{ flex: 1 }}>
                        <Rewardloglist navigator={this.props.navigator}/>
                    </View>
                </ScrollableTabView>
            </View>
        )
    }
   
    backView() {
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
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
