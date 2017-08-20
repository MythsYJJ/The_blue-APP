import React, { Component, PropTypes } from 'react';
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
} from 'react-native';
import NavBar from '../component/navbar';
import Button from '../component/button';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomSync from '../sync';
import ChatView from '../chat/ChatView';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
//推送&聊天页面
export default class MessageCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainNotifications: [],
            otherNotifications: [],
            chatMessages: {},
            mainDataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            otherDataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            chatDataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }

        this._renderChatMessage = this._renderChatMessage.bind(this);
        this._renderNotification = this._renderNotification.bind(this);
        this.loadData = this.loadData.bind(this);
        this._getTime = this._getTime.bind(this);
    }

    async loadData() {
        try {
            let notifications = CustomSync.notifications;
            console.log('CustomSync.chatMessages = ', CustomSync.chatMessages);
            let chatList = [];
            for (let k in CustomSync.chatMessages) {
                chatList.push(CustomSync.chatMessages[k]);
            }
            let mainNtf = [];
            let otherNtf = [];
            if (!notifications) {
                notifications = [];
            }
            // console.log(notifications);
            // for (let i = 1; i <= 10; i++) {
            //     notifications.push({ 'noticeType': i < 4 ? i : 96 + i, 'title': '常常设计费iOS的金佛撒娇的覅哦啊接收到浪费静安寺哦打飞机阿斯蒂芬静安寺低筋粉阿萨德龙卷风' + i, 'content': 'content' + i, 'createTime': 'createTime' + i });
            // }

            notifications.map(notification => {
                if (notification && notification.noticeType < 100) {
                    mainNtf.push(notification);
                } else {
                    otherNtf.push(notification);
                }
            })
            this.setState({
                mainNotifications: mainNtf,
                otherNotifications: otherNtf,
                chatMessages: chatList
            })
        } catch (err) {
            console.log(err);
        }
    }

    componentWillMount() {
        this.loadData();

    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _renderNotificationItem(rowData, rowId) {
        /*
        活动中抽奖 1    #f7b84e
        购买产品 2     #2ed007
        现金券变化 3

        聊天男 4100f9
        聊天女 ee9af6

        游记被评论 100   f40014
        游记被浏览 101
        游记被收藏 102
        游记被点赞 103
        游记被打赏 104
        游记被举报 105
        游记有更新 106

        Notification param
            noticeType
            content
            parameters
            createTime
         */
        let titleColor = '';
        switch (rowData.noticeType) {
            case 1:
                titleColor = '#f7b84e';
                break;
            case 2:
            case 3:
                titleColor = '#2ed007';
                break;
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
                titleColor = '#f40014';
                break;
            default:
                titleColor = '#f40014';
                break;
        }
        return (
            <View style={styles.notification}>
                <View style={{ backgroundColor: titleColor, justifyContent: 'center', height: Height * 0.04, }}>
                    <Text style={styles.title}
                        numberOfLines={1}>{rowData.title}</Text>
                </View>
                <Text style={styles.content}
                    numberOfLines={3}>{rowData.content}</Text>
                <View style={styles.notifyBottom}>
                    {
                        rowData.noticeType == 100 ?
                            <Button text='回复'
                                color='#fff'
                                backgroundColor='#1596fe'
                                width={50}
                                height={Height * 0.03}
                                style={{ paddingTop: 10, paddingLeft: 5 }}
                                click={() => { console.log('click Reply') }} />
                            :
                            <View style={{ backgroundColor: '#FFFFFF' }} />
                    }
                    <Text style={styles.createtime}//textAlign right
                        numberOfLines={1}>{this._getTime(rowData.createTime)}</Text>
                </View>
            </View>
        );
    }

    _getTime(data) {
        data = new Date(data * 1000);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        return year + '-' + month + '-' + date;
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

    _renderNotification(tabTitle) {
        let notifications = tabTitle === '公告' ? this.state.mainNotifications : this.state.otherNotifications;
        let ds = tabTitle === '公告' ? this.state.mainDataSource : this.state.otherDataSource;
        console.log('_renderNotification', notifications);
        if (notifications.length > 0) {
            return (
                <View tabLabel={tabTitle.toString()}
                    style={{ backgroundColor: '#ddd', flex: 1 }}>
                    <ListView
                        renderSeparator={this._renderSeperator.bind(this)}
                        dataSource={ds.cloneWithRows(notifications)}
                        enableEmptySections={true}
                        renderRow={(rowData, sectionId, rowId) => this._renderNotificationItem(rowData, rowId)}
                        showsVerticalScrollIndicator={false}
                        initialListSize={50} />
                </View>
            )
        } else {
            return (
                <ScrollView
                    tabLabel={tabTitle.toString()}
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {  }}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                            {'您还没有收到任何' + tabTitle + '消息，请刷新重试……'}
                        </Text>
                    </View>
                </ScrollView>
            );
        }
    }

    _renderChatMessage(tabTitle) {
        if (this.state.chatMessages.length > 0) {
            return (
                <View tabLabel={tabTitle.toString()}
                    style={{ backgroundColor: '#ddd', flex: 1 }}>
                    <ListView
                        renderSeparator={this._renderSeperator.bind(this)}
                        enableEmptySections={true}
                        dataSource={this.state.chatDataSource.cloneWithRows(this.state.chatMessages)}
                        renderRow={(rowData, sectionId, rowId) => this._renderChatMessageItem(rowData, rowId)}
                        showsVerticalScrollIndicator={false}
                        initialListSize={50} />
                </View>
            )
        } else {
            return (
                <ScrollView
                    tabLabel={tabTitle.toString()}
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {  }}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                            {'天知，地知，你知，我... ...出于对用户的隐私性负责，TheBlue不会保存您的任何聊天记录如有重要信息，记得自行保存哟~'}
                        </Text>
                    </View>
                </ScrollView>
            );
        }
    }

    _renderChatMessageItem(rowData, sectionId, rowId) {
        let titleColor = '#ddd';
        switch (rowData.sex) {
            case 1:
                titleColor = '#4200fe'
                break;
            case 2:
                titleColor = '#f19cf9'
                break;
            default:
                titleColor = '#ddd'
                break;
        }
        const lastObject = rowData.chatList[0];
        const lastWord = lastObject ? lastObject.text : "";
        let createTime = '';
        if (lastObject && lastObject.createdAt) {
            let date = new Date(lastObject.createdAt)
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            createTime = year + '-' + month + '-' + day;
        }
        return (
            <TouchableOpacity onPress={this._goChatView.bind(this, rowData)}>
                <View style={styles.notification}>
                    <View style={{ backgroundColor: titleColor, justifyContent: 'center', height: Height * 0.04, }}>
                        <Text style={styles.title}
                            numberOfLines={1}>{'和' + rowData.targetNickname + '的聊天'}</Text>
                    </View>
                    <Text style={styles.content}
                        numberOfLines={3}>{lastWord}</Text>
                    <View style={styles.notifyBottom}>
                        <View style={{ backgroundColor: '#FFFFFF' }} />
                        <Text style={styles.createtime}//textAlign right
                            numberOfLines={1}>{createTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _goChatView(rowData) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ChatView',
                component: ChatView,
                params: {
                    targetUserId: rowData.targetId,
                    targetUserName: rowData.targetNickname,
                    sex: rowData.sex,
                    userinfo:rowData
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={'消息'}
                    leftItemFunc={this.goBack.bind(this)}
                    leftImageSource={Back}
                />
                <ScrollableTabView locked={true}
                    tabBarUnderlineStyle={{ backgroundColor: '#1596fe' }}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#1596fe'
                    tabBarInactiveTextColor='rgba(0,0,0,.7)'
                    tabBarTextStyle={{ fontSize: 17 }}>
                    {this._renderNotification('公告')}
                    {this._renderChatMessage('聊天')}
                    {this._renderNotification('其他')}
                </ScrollableTabView>
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
    listDataView: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    notification: {
        margin: 5,
        backgroundColor: '#FFFFFF'
    },
    title: {
        height: Height * 0.03,
        textAlign: 'left',
        marginLeft: 5,
        marginRight: 5,
        fontSize: 15,
        color: '#fff',
        backgroundColor:'transparent'
    },
    content: {
        height: Height * 0.09,
        fontSize: 10,
        margin: 5,
        backgroundColor: '#FFFFFF'
    },
    notifyBottom: {
        height: Height * 0.03,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    createtime: {
        height: Height * 0.03,
        fontSize: 10,
        backgroundColor: '#FFFFFF',
        marginRight: 10
    }
})