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

import SettingsList from 'react-native-settings-list';
import NavBar from '../component/navbar';
import SettingDetail from './settingDetail';
import DatePicker from 'react-native-datepicker';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');

export default class BirthdaySetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInformation: this.props.userInformation,
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

    componentWillUnmount() {
        const {onBirthdaySelect} = this.props;
        if (onBirthdaySelect) {
            onBirthdaySelect(this._changed ? this.state.userInformation.birthdate : null);
        }
    }

    datePicker(birthdate = null) {
        let date = birthdate ? new Date(parseInt(birthdate) * 1000) : new Date();
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    render() {
        var bgColor = '#DCE3F4';
        return (
            <View style={styles.container}>
                <NavBar title={'出生日期'}
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
                                出生年月
                            </Text>
                        </View>
                        <View style={[styles.rowRightView, { borderColor: 'transparent', height: 50 }]}>
                            <DatePicker
                                style={{ width: 200 }}
                                date={this.datePicker(this.state.userInformation.birthdate)}
                                mode="date"
                                placeholder="请选择您的生日"
                                format="YYYY-MM-DD"
                                minDate="1900-01-01"
                                maxDate={this.datePicker()}
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                }}
                                onDateChange={(date) => {
                                    let dateArray = date.split('-');
                                    console.log(dateArray);
                                    let DATE = Date.parse(new Date(dateArray[0],dateArray[1],dateArray[2])) / 1000;
                                    console.log('Date.parse = ',DATE);
                                    let userInfo = this.state.userInformation;
                                    userInfo.birthdate = DATE;
                                    this.setState({
                                        userInformation: userInfo
                                    }, () => { this._changed = true });
                                }}
                            />
                        </View>
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
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: "#fff",
    },
    rowLeftView: {
        width: Width * .3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowLeftText: {
        color: '#222',
        backgroundColor: 'transparent',
        fontSize: 16
    },
    rowRightView: {
        width: Width * .6,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 10,
        marginBottom: 10,
        marginRight: Width * .1
    }
});