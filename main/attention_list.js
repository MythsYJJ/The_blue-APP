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
    TouchableHighlight
} from 'react-native';
import { toastShort } from '../Toast/ToastUtil';
import CustomSync from '../sync';
import ChatView from '../chat/ChatView';
import PersonalCenter from './personalCenter';
import CacheImage from '../component/cacheImage';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

const HEAD = require('../img/default_head.png');

export default class AttentionList extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listdata: []

        }
    }
    static PropTypes = {
        listtype: PropTypes.number,  //listname
        Image: PropTypes.node,   //头像
        Name: PropTypes.string,  //名字
        GradientImage: PropTypes.node,   //性别图
        // Age:PropTypes.number,   //年龄
        // LoginTime:PropTypes,    //登录时间
        // Distance:PropTypes,     //距离
        // RightBtn:PropTypes.func,    //右侧按钮函数
        // RightBtnTitle:PropTypes.string  //右侧按钮标题

    }

    componentWillMount() {
    }

    //跳转个人信息
    _gotherself(rowData) {
        let objdata = new Object()
        objdata.userid = rowData.userid
        objdata.avatar = rowData.avatar
        const {navigator} = this.props;
        if (navigator && objdata) {
            navigator.push({
                name: 'PersonalCenter',
                component: PersonalCenter,
                params: {
                    navigator: navigator,
                    userId: objdata.userid,
                }
            })
        }
    }

    //单行数据-样式
    _renderRow(rowData, rowId) {
        console.log('row', rowData, rowId)
        let headImage = global.common.fileurl.imgavatar + rowData.avatar;
        return (
            <TouchableOpacity activeOpacity={0.8}
                onPress={() => { this._gotherself(this.state.listdata[rowId]) }}>
                <View style={styles.container}>
                    <View style={{ justifyContent: 'center' }}>
                        {<Image source={{ uri: headImage }} style={styles.leftHead} />}
                        {/*<CacheImage cacheType='head'
                            envUrl={global.common.fileurl.imgavatar}
                            url={rowData.avatar}
                            style={styles.leftHead}
                            resizeMode='cover' />*/}
                    </View>
                    <View style={styles.middleMain}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            {this.props.showblack ?
                                <Image source={this.getRelationShip(this.state.listdata[rowId].relationship, 0)}
                                    style={{ width: Width * .1, resizeMode: 'contain' }}
                                /> : <View />
                            }
                            <Text style={styles.Name}>{rowData.nickname}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{backgroundColor:'transparent'}}>关注数：</Text>
                                <Text style={styles.numberData}>{rowData.followed}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{backgroundColor:'transparent'}}>粉丝数：</Text>
                                <Text style={styles.numberData}>{rowData.befollowed}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{backgroundColor:'transparent'}}>里程数：</Text>
                                <Text style={styles.numberData}>{rowData.mileage}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{backgroundColor:'transparent'}}>资料完整度：</Text>
                                <Text style={styles.numberData}>{rowData.completeness + '%'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',width:Width*.25,justifyContent:"space-between",alignItems:'center',
                                    marginLeft:Width*.02}}>
                        {this.props.showblack ?
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => { this.changeRelationShip(this.state.listdata[rowId], rowId) }}>
                                    <Image source={this.getRelationShip(this.state.listdata[rowId].relationship, 1)}
                                        style={[styles.btnImage,{width:Width*.11,height:Width*.11}]} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View />}
                        {this.props.listtype != 2 ? 
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => { this.pushChatView(rowData) }}>
                                    <Image source={this.props.listtype != 2 ? require('../img/youquan/sendMessage.png') : require('../img/youquan/response.png')}
                                        style={[styles.btnImage,{top:6}]} />
                                </TouchableOpacity>
                            </View>
                          : 
                            <Text style={{ justifyContent: 'center', alignItems: 'center',marginRight:Width*.01,
                                           fontSize:15,color:'#fff',backgroundColor:'#1596fe',borderRadius:5,
                                           padding:3,paddingLeft:6,paddingRight:6 }}
                            onPress={() => {this.OnBlackList(rowData,rowId)}} >
                                移除
                            </Text>}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    async OnBlackList(rowData,rowid) {
        let responseJson = await CustomSync.fetch(this,
            global.httpURL +
            'ignoreusers/' +
            rowData.userid +
            '?sid=' + global.sessionID,
            'DELETE'
            );
        if(responseJson.status == 1)
        {
            this.state.listdata.splice(rowid, 1)
            this.setState({ listdata: this.state.listdata })
        }
    }
    //关注和取消关注
    async changeRelationShip(data, rowid) {
        let b = data.relationship == 1 ? true : false
        if (b) {
            try {
                let responseJson = await CustomSync.fetch(this,
                                                global.httpURL + 'follow',
                                                'POST',
                                                {'Content-Type': 'application/x-www-form-urlencoded'},
                                                'sid=' + global.sessionID + '&id=' + data.userid)
                if (responseJson) {
                    alert('关注完毕：' + responseJson.status)
                    data.relationship = data.relationship == 1 ? 257 : 1
                    this.state.listdata[rowid] = data
                    this.setState({ listdata: this.state.listdata })
                    global.userInformation.followed = this.state.listdata.length
                }
            } catch (err) {
                console.log(err)
            }
        }
        else {
            let responseJson = await CustomSync.fetch(this,
                                            global.httpURL +
                                                'follow/' +
                                                data.userid +
                                                '?sid=' + global.sessionID,
                                            'DELETE');
            alert('取消关注：' + responseJson.status);
            data.relationship = data.relationship == 1 ? 257 : 1;
            this.state.listdata[rowid] = data;
            this.setState({ listdata: this.state.listdata });
            global.userInformation.followed = this.state.listdata.length - 1;
        }
    }

    //跳转到聊天界面
    async pushChatView(rowdata) {
        if (this.props.listtype != 2) {
            if (this.props.navigator) {
                console.log('navigator ')
                this.props.navigator.push({
                    name: 'ChatView',
                    component: ChatView,
                    params: {
                        targetUserId: rowdata.userid,
                        targetUserName: rowdata.nickname,
                        sex: rowdata.sex,
                        userinfo:rowdata
                    }
                })
            }
        }
        else {
            let responseJson = await CustomSync.fetch(this,
                                            global.httpURL +
                                                'ignoreusers/' +
                                                data.userid +
                                                '?sid=' +
                                                global.sessionID,
                                            'DELETE');
            alert('移除黑名单：' + responseJson.status);
            data.relationship = data.relationship == 1 ? 257 : 1;
            this.state.listData[rowid] = data;
            this.state.listData.splice(rowid, 1);
            this.setState({ listdata: this.state.listData });
        }

    }

    getRelationShip(relationship, type) {
        console.log('关系数据：', relationship, type);

        if (type == 1) {
            switch (relationship) {
                case 0:
                case 1:
                    return require('../img/youquan/noAttention.png')
                case 256:
                case 257:
                    return require('../img/youquan/payAttention.png')
                default:
            }
        } else {
            switch (relationship) {
                case 0:

                case 1:
                    return require('../img/youquan/isAttention.png')
                case 256:
                    return require('../img/youquan/attentionOther.png')
                case 257:
                    return require('../img/youquan/attentionEach.png')
                default:
            }
        }

    }

    _onEndRefresh() {
        console.log('触发底部刷新')
    }

    _onTopRefresh() {
        console.log('触发顶部刷新')
    }
    
    _renderList() {
        console.log(this.state.listdata)
        this.state.listdata = this.props.listdata
        if (this.state.listdata && this.state.listdata.length > 0) {
            return (
                <ListView style={{}}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                    showsVerticalScrollIndicator={false}
                    initialListSize={8}
                    onEndReachedThreshold={0}
                    onEndReached={this._onEndRefresh}
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl onRefresh={this._onTopRefresh}
                            refreshing={false} />
                    } />
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {}}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center',justifyContent:'center' }}>
                        <Text style={{ fontSize: 16,textAlign:'center',backgroundColor:'transparent' }}>
                            目前什么都没有哟{'\n'}小编并没法给您呈现东西啦
                    </Text>
                    </View>
                </ScrollView>
            );
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {this._renderList()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Width,
        marginBottom: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    leftHead: {
        width: Width * 0.15,
        height: Width * 0.15,
        borderRadius: Width * 0.075,
        resizeMode: 'cover'
    },
    Name: {
        fontSize: 18,
        paddingLeft: 3,
        fontWeight: 'bold',
        backgroundColor:'transparent'
        // marginLeft: 5
    },
    smallImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover'
    },
    middleMain: {
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        width: Width * 0.55,
        paddingLeft: Width * 0.01
    },
    btnImage: {
        resizeMode: "contain",
        width: Width * 0.095,
        height: Height * 0.095
    },
    rightBtn: {
        backgroundColor: '#1596fe',
        width: Width * 0.28,
        height: Width * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    rightBtnText: {
        color: '#fff',
        fontSize: 16
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    numberData: {
        color: '#F90',
        backgroundColor:'transparent'
    }
})