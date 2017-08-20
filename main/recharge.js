import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    ListView,
    Alert,
    TouchableOpacity
} from 'react-native';
import NavBar from '../component/navbar';
import Button from '../component/button';
import PaymentUtil from '../Utils/paymentUtil';
import CustomSync from '../sync';
import CacheImage from '../component/cacheImage';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
const Back = require('../img/back.png');
const ticket = require('../img/youji/u505.png');
//充值页面
export default class Recharge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curtCoin: global.userInformation.coins,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }

        this._renderItem = this._renderItem.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._onIapCallBack = this._onIapCallBack.bind(this);
        this._rechargeByAlipay = this._rechargeByAlipay.bind(this);
    }

    componentWillMount() {
        CustomSync.registerComponent(this);
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    clickItem(data) {
        console.log('click item data = ', data);
        if (Platform.OS == 'ios') {
            if (global.common.payment.usealipay) {
                this._rechargeByAlipay(data.rmb);
            } else {
                PaymentUtil.iapPay(data.id, this._onIapCallBack);
            }
        } else {
            this._rechargeByAlipay(data.rmb);
        }
    }

    onReceiveNotification(notification) {
        console.log('notification = ', notification);
        if (notification && notification.noticeType == 3) {
            let curtCoin = notification.parameters;
            console.log('receive_coin = ' + curtCoin);
            global.userInformation.coins = curtCoin;
            this.setState({ curtCoin: curtCoin });
            alert('notification = ', notification);
        }
    }

    async _onIapCallBack(ticket) {
        let params = 'sid=' + global.sessionID + '&ticket=' + encodeURIComponent(ticket);
        console.log(params);
        let resultJson = await CustomSync.fetch(this,global.httpURL + 'appstorepay',
                                                    'POST',
                                                    {'Content-Type': 'application/x-www-form-urlencoded'},
                                                    params);
        console.log(resultJson);
        if (resultJson.status == 1) {
            Alert.alert('支付成功，可能需要花费几分钟时间来确认您的付款，请耐心等待');
        }
    }

    async _rechargeByAlipay(amount) {
        let params = 'sid=' + global.sessionID + '&amount=' + amount;
        let result = await PaymentUtil.AlipayByUrl('recharge', params);
        if (result.status == 1) {
            Alert.alert('支付成功，可能需要花费几分钟时间来确认您的付款，请耐心等待');
        }
    }

    _renderItem(rowData, rowId) {
        return (
            <TouchableOpacity onPress={this.clickItem.bind(this, rowData)}>
                <View style={styles.listItem}>
                    <View style={styles.listItem_header}>
                        <Image
                            source={ticket}
                            resizeMode={'cover'}
                            style={styles.ticketImage}
                        />
                        <Text style={styles.descText}>{rowData.name}</Text>
                    </View>
                    <Text style={styles.descText}>
                        {'¥' + rowData.rmb}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    _renderHeader() {
        return (
            <View style={{ height: Height * 0.05, flexDirection: 'column' }}>
                <View
                    style={{
                        height: 5,
                        backgroundColor: '#ddd',
                    }}
                />
                <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <View style={{ width: Width * 0.25, borderBottomColor: '#aaa', borderBottomWidth: 2 }}>
                        <Text style={{ fontSize: 15,backgroundColor:"transparent" }}>
                            充值金额
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 5,
                    backgroundColor: '#ddd',
                }}
            />
        );
    }

    render() {
        const avatar = { uri: global.common.fileurl.imgavatar + global.userInformation.avatar };
        return (
            <View style={styles.container}>
                <NavBar title={'充值'}
                    leftItemFunc={this.goBack.bind(this)}
                    leftImageSource={Back}
                />
                <View style={styles.header}>
                    {/*<Image source={avatar} style={styles.avatar} />*/}
                    <CacheImage cacheType='head'
                                envUrl={global.common.fileurl.imgavatar}
                                url={global.userInformation.avatar}
                                style={styles.avatar}
                                resizeMode='cover' />
                    <View style={styles.container}>
                        <Text style={styles.nickname}>
                            {global.userInformation.nickname}
                        </Text>
                        <View style={styles.coinContent}>
                            <Image
                                source={ticket}
                                resizeMode={'cover'}
                                style={styles.ticketImage}
                            />
                            <Text style={{ color: 'rgba(0,0,0,0.8)', fontSize: 15,backgroundColor:"transparent" }}>余额:</Text>
                            <Text style={styles.coinText}>{this.state.curtCoin}</Text>
                        </View>
                    </View>
                </View>
                <ListView
                    renderSeparator={this._renderSeperator.bind(this)}
                    renderHeader={this._renderHeader.bind(this)}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource.cloneWithRows(global.common.payment.products)}
                    renderRow={(rowData, sectionId, rowId) => this._renderItem(rowData, rowId)}
                    showsVerticalScrollIndicator={false}
                    initialListSize={50} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#fff'
    },
    header: {
        width: Width,
        height: Height * 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: Height * 0.16,
        height: Height * 0.16,
        borderRadius: Height * 0.08,
        borderWidth: 2,
        borderColor: '#030303',
        marginLeft: 10,
        resizeMode: 'cover'
    },
    nickname: {
        height: Height * 0.1,
        textAlign: 'left',
        marginLeft: 10,
        marginTop: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        backgroundColor:"transparent"
    },
    coinContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 30,
        alignItems: 'center'
    },
    coinText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffcd31',
        paddingLeft: 5,
        alignSelf: 'center',
        backgroundColor:"transparent"
    },
    descText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 10,
        backgroundColor:"transparent"
    },
    ticketImage: {
        width: Width * 0.08,
        height: Width * 0.08,
        resizeMode: 'contain'
    },
    listItem: {
        width: Width,
        height: Height * 0.07,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    listItem_header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        justifyContent: 'center'
    },
})