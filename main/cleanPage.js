import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import NavBar from '../component/navbar';
import FileUtil from '../Utils/fileUtil';
import Storage from 'react-native-storage';
import CustomSync from '../sync';
import Login from '../login/login';
import {toastShort} from '../Toast/ToastUtil';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

const Back = require('../img/back.png');

export default class HeadSetting extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }

    _goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    async _cleanCache(){
        Alert.alert(
            '清理缓存',
            '是否要清理所有缓存数据？',
            [
                { text: '取消', onPress: () => console.log('Foo Pressed!') },
                {
                    text: '确认', onPress: async () => {
                        if(await FileUtil.deleteCacheImage()){
                            toastShort('清理完毕')
                        }
                    }
                },
            ]
        )
    }

    async _logout(){
        Alert.alert(
            '退出登录',
            '是否要退出当前帐号？',
            [
                { text: '取消', onPress: () => console.log('Foo Pressed!') },
                {
                    text: '确认', onPress: async () => {
                        global.sessionID = null;
                        await CustomSync.removeKey('sessionID');
                        global.userInformation = null;
                        await CustomSync.removeKey('userInformation');
                        const {navigator} = this.props;
                        if(navigator){
                            navigator.resetTo({
                                name:'Login',
                                component:Login
                            })
                        }
                    }
                },
            ]
        )
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:'#eee'}}>
                <NavBar title={'设置'}
                    leftImageSource={Back}
                    leftItemFunc={this._goBack.bind(this)}
                    leftImageHeight={22}
                />
                <View style={{flex:1}}>
                    <Image source={require('../img/create_Avatar.jpg')}
                           style={{resizeMode:'cover',width:Width,height:Height*.3}}/>
                    <View style={{justifyContent:'space-between',alignItems:'center',
                                  marginTop:Height*.08,height:Height*.16}}>
                        <TouchableOpacity activeOpacity={.8}
                                          style={{backgroundColor:'#1596fe',justifyContent:'center',
                                                  alignItems:'center',width:Width*.9,height:Height*.07,
                                                  borderRadius:5}}
                                          onPress={this._cleanCache.bind(this)}>
                            <Text style={{fontSize:17,color:'#fff',fontWeight:'bold',backgroundColor:'transparent'}}>清理缓存</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.8}
                                          style={{backgroundColor:'#e4393c',justifyContent:'center',
                                                  alignItems:'center',width:Width*.9,height:Height*.07,
                                                  borderRadius:5}}
                                          onPress={this._logout.bind(this)}>
                            <Text style={{fontSize:17,color:'#fff',fontWeight:'bold',backgroundColor:'transparent'}}>注销</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}