import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert,
    RefreshControl,
    TouchableHighlight,
    ScrollView
} from 'react-native';

import NavBar from '../component/navbar';
import CustomSync from '../sync';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');


//修改备注
export default class Remark extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Remark: this.props.remark ? this.props.remark : ''
        }

        this.Remarkcomplete = this.Remarkcomplete.bind(this);
    }

    async Remarkcomplete() {
        let {remarkFinish} = this.props;
        let params = 'sid=' + global.sessionID
            + '&userid=' + this.props.userid
            + '&remarks=' + this.state.Remark
        try {
            let responseJson = await CustomSync.fetch(this,
                                                global.httpURL + 'userdefined',
                                                'PUT',
                                                {'Content-Type': 'application/x-www-form-urlencoded'},
                                                params)
            console.log(responseJson)
            if (responseJson.status == 1) {
                global.userdefined.set(this.props.userid, this.state.Remark);
                Alert.alert('修改备注成功');
                remarkFinish();
            }
        } catch (err) {
            console.log(err)
        }
    }

    backView() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={'编辑备注'}
                    rightItemTitle={'保存'}
                    rightTextColor={'#fff'}
                    rightItemFunc={this.Remarkcomplete.bind(this)}
                    leftitemvisible={true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#fff', paddingTop: 10, paddingBottom: 10 }}>
                        <Text style={styles.Name}>备注名</Text>
                        <View style={styles.textItem}>
                            <TextInput placeholder={'请输入备注'}
                                placeholderTextColor={'rgba(0,0,0,.4)'}
                                value={this.state.Remark}
                                autoCapitalize={'none'}
                                maxLength={16}
                                underlineColorAndroid={'transparent'}
                                style={{ height: 40, fontSize: 14 }}
                                selectTextOnFocus={true}
                                onChangeText={(Remark) => this.setState({ Remark })}
                            />
                        </View>
                        <Text style={styles.desc}>{'最多输入16个字符'}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#CCCCCC',
    },
    middleMain: {
        flexDirection: 'column',
        width: Width * .9,
        alignSelf: 'center',
    },
    Name: {
        width: Width * .9,
        fontSize: 18,
        textAlign: 'left',
        alignSelf: 'center',
        backgroundColor:'transparent'
        // marginLeft: 5
    },
    desc: {
        width: Width * 0.9,
        fontSize: 12,
        paddingLeft: 3,
        alignSelf: 'center',
        textAlign: 'right',
        color: '#999',
        backgroundColor:'transparent'
        // marginLeft: 5
    },
    btn: {
        height: 40,
        width: Width,
        alignSelf: 'center',
        backgroundColor: '#0099FF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    //分割线
    textItem: {
        borderWidth: 1,
        borderColor: '#999',
        backgroundColor: '#fff',
        width: Width * .9,
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5
    },
})
