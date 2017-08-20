import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert
} from 'react-native';

import SettingsList from 'react-native-settings-list';
import NavBar from '../component/navbar';
import SettingDetail from './settingDetail';
import Remark from '../Remarks/Remark';
import Report from './Youji/report';
import CustomSync from '../sync';

var Back = require('../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class OtherSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: this.props.userInfo,
            remark: this.props.remark ? this.props.remark : '',
            switchValue: this.props.userInfo.isignoreuser
        };

        this._changed = false;
        this._goBack = this._goBack.bind(this);
        this._goRemark = this._goRemark.bind(this);
        this._goReport = this._goReport.bind(this);
        this._remarkFinish = this._remarkFinish.bind(this);
        this._onValueChange = this._onValueChange.bind(this);
        this._changeBlackList = this._changeBlackList.bind(this);
    }

    _goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillUnmount() {
        const {onSettingFinish} = this.props;
        if (onSettingFinish) {
            onSettingFinish(this._changed ? this.state.userInfo : null);
        }
    }

    _goRemark() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'Remark',
                component: Remark,
                params: {
                    navigator: this.props.navigator,
                    userid: this.state.userInfo.userid,
                    remarkFinish: this._remarkFinish,
                    remark: global.userdefined.get(this.state.userInfo.userid)
                }
            })
        }
    }

    _goReport() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'Report',
                component: Report,
                params: {
                    target: 2,
                    targetId: this.props.userInfo.userid
                }
            })
        }
    }

    _remarkFinish() {
        let remark = global.userdefined.get(this.state.userInfo.userid);
        console.log('_remarkFinish = ' + remark);
        this.setState({ remark: remark ? remark : '' });
    }

    _onValueChange(value) {
        if(value) {
            Alert.alert(null,`您是否要将${this.props.userInfo.nickname}加入黑名单，加入黑名单后您将无法收到其对您的聊天，也无法看到其发的游记`, [
                                    {
                                        text: '确定', onPress: () => {
                                            this._changeBlackList(value);
                                        }
                                    },
                                    { text: '取消', onPress: () => console.log('custom refuse recharge') },
                                ]);
            return;
        }
        this._changeBlackList(value);
    }

    async _changeBlackList(value) {
        console.log(value,this.props.userInfo)
         let params = 'sid=' + global.sessionID;
         let responsejson;
         if(value){
            responseJson = await CustomSync.fetch(this,
                global.httpURL +
                'ignoreusers/' +
                this.props.userInfo.userid,
                'POST',
                { 'Content-Type': 'application/x-www-form-urlencoded' },
                params);
            this.setState({ switchValue: value });
         }else{
             this.setState({ switchValue: value });
             responseJson = await CustomSync.fetch(this,
                global.httpURL +
                'ignoreusers/' +
                this.props.userInfo.userid + 
                '?'+params,
                'DELETE');
            if(responseJson.status != 1){
                this.setState({switchValue: !value});
                Alert.alert('','移除失败，请重试')
            }
         }
         let otherUser = this.props.userInfo;
         otherUser.isignoreuser = value;
         this.props.changeUserInfo(otherUser);
         console.log('返回值',responseJson)
    }

    render() {
        var bgColor = '#DCE3F4';
        return (
            <View style={styles.container}>
                <NavBar title={'资料设置'}
                    leftImageSource={Back}
                    leftItemFunc={this._goBack}
                    leftImageHeight={22}
                />
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                        <Image source={require('../img/create_Avatar.jpg')}
                            style={{ resizeMode: 'cover', width: Width, height: Height * .3 }} />
                        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                            <SettingsList.Item
                                hasNavArrow={true}
                                title={'设置备注'}
                                titleInfo={this.state.remark}
                                titleInfoStyle={styles.titleInfoStyle}
                                onPress={() => this._goRemark()}
                            />
                            <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                            <SettingsList.Item
                                hasNavArrow={false}
                                title={'加入黑名单'}
                                hasSwitch={true}
                                switchState={this.state.switchValue}
                                switchOnValueChange={this._onValueChange}
                                hasNavArrow={false}
                            />
                            <SettingsList.Item
                                hasNavArrow={true}
                                title={'举报'}
                                onPress={() => this._goReport()}
                            />
                        </SettingsList>
                    </View>
                </View>
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
    }
});