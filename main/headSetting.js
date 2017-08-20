import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Alert,
    ScrollView
} from 'react-native';

import { Radio } from 'native-base';


import SettingsList from 'react-native-settings-list';
import NavBar from '../component/navbar';
import SettingDetail from './settingDetail';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');

export default class HeadSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInformation: global.userInformation,
        };

        this._goBack = this._goBack.bind(this);
        this._changed = false;
    }

    _goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillUnmount(){
        const {onSettingFinish} = this.props;
        if (onSettingFinish) {
            onSettingFinish(this._changed ? global.userInformation : null);
        }
    }

    render() {
        console.log(global.userInformation)
        var bgColor = '#DCE3F4';
        return (
            <View style={styles.container}>
                <NavBar title={'编辑资料'}
                    leftImageSource={Back}
                    leftItemFunc={this._goBack}
                    leftImageHeight={22}
                />
                <ScrollView style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    {/*昵称：this.state.userInformation.nickname*/}
                    {/*个性签名：this.state.userInformation.signature*/}
                    <View style={styles.rowView}>
                        <View style={styles.rowLeftView}>
                            <Text style={styles.rowLeftText}>
                                昵称
                            </Text>
                        </View>
                        <View style={styles.rowRightView}>
                            <TextInput style={styles.rowRightTextInput}
                                       maxLength={8}
                                       value={global.userInformation.nickname}
                                       underlineColorAndroid={'transparent'}
                                       onChangeText={(text)=>{
                                            let userInfo = global.userInformation;
                                            userInfo.nickname = text;
                                            this.setState({
                                                userInformation:userInfo
                                            },()=>{this._changed=true})
                                        }}/>
                        </View>
                    </View>
                    <View style={styles.rowView}>
                        <View style={styles.rowLeftView}>
                            <Text style={styles.rowLeftText}>
                                性别
                            </Text>
                        </View>
                        <View style={[styles.rowRightView,{borderColor:'transparent',flexDirection:'row'}]}>
                            <View style={{width:Width*.4,justifyContent:'space-between',flexDirection:'row'}}>
                                <View style={{flexDirection:"row",alignItems:'center',justifyContent:'center'}}>
                                    <Radio selected={global.userInformation.sex == 1}
                                           onPress={()=>{
                                                let userInfo = global.userInformation;
                                                userInfo.sex = 1;
                                                this.setState({
                                                    userInformation:userInfo
                                                },()=>{this._changed=true});
                                           }}/>
                                    <Text style={{backgroundColor:'transparent'}}>男</Text>
                                </View>
                                <View style={{flexDirection:"row",alignItems:'center',justifyContent:'center'}}>
                                    <Radio selected={global.userInformation.sex == 2}
                                           onPress={()=>{
                                                let userInfo = global.userInformation;
                                                userInfo.sex = 2;
                                                this.setState({
                                                    userInformation:userInfo
                                                },()=>{this._changed=true});
                                           }}/>
                                    <Text style={{backgroundColor:'transparent'}}>女</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.rowView,{flexDirection:'column',alignItems:'flex-start',
                                                  justifyContent:'flex-start'}]}>
                        <View style={[styles.rowLeftView,{alignSelf:'flex-start',marginTop:5}]}>
                            <Text style={styles.rowLeftText}>
                                个性签名
                            </Text>
                        </View>
                        <TextInput style={{width:Width*.8,height:90,borderWidth:1,borderColor:'#000',
                                           alignSelf:'center',textAlignVertical:'top',margin:10}}
                                   value={global.userInformation.signature}
                                   multiline={true}
                                   maxLength={40}
                                   placeholder={'请输入个性签名（最多40个字）'}
                                   underlineColorAndroid={'transparent'}
                                   onChangeText={(text)=>{
                                       let userInfo = global.userInformation;
                                       userInfo.signature = text;
                                       this.setState({
                                           userInformation:userInfo
                                       },()=>{this._changed=true})
                                   }}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    titleInfoStyle: {
        fontSize: 16,
        color: '#8e8e93'
    },
    rowView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5,
        backgroundColor:"#fff",
    },
    rowLeftView:{
        width:Width*.3,
        justifyContent:'center',
        alignItems:'center'
    },
    rowLeftText:{
        color:'#222',
        backgroundColor:'transparent',
        fontSize:16
    },
    rowRightView:{
        width:Width*.6,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#000',
        marginTop:10,
        marginBottom:10,
        marginRight:Width*.1
    },
    rowRightTextInput:{
        width:Width*.5,
        textAlign:'center',
        padding:0
    }
});