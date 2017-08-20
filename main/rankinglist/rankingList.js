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
    TouchableHighlight,
    Alert
} from 'react-native';
import { toastShort } from '../../Toast/ToastUtil';
import CustomSync from '../../sync';
import chatView from '../../chat/ChatView';
import LinearGradient from 'react-native-linear-gradient';
import PersonalCenter from '../personalCenter';
import CacheImage from '../../component/cacheImage';
import LoadingView from '../../component/loadingView';
var Spinner = require('react-native-spinkit');

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var sexArr = [
    require('../../img/myself/u826.png'),
    require('../../img/myself/u808.png')
];

var TopArr = [
    require('../../img/ranking/1.png'),
    require('../../img/ranking/2.png'),
    require('../../img/ranking/3.png')
];

var LinearColorArr = [
    ['#fff', 'rgba(254,189,1,.95)'],
    ['#fff', '#9e9e9e'],
    ['#fff', '#a46846']
]

export default class AttentionList extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listdata: [],
            myindex: 0,
            isRefresh:false
        }
    }

    componentWillMount() {
    }

    _onTopRefresh() {
        this.setState({
            isRefresh:true
        },async ()=>{
            await this.props.onTopRefresh(this.props.listtype);
            this.setState({
                isRefresh:false
            })
        })
    }

    _onEndRefresh() {
        console.log('底部刷新')
    }

    getRelationShip(relationship) {
        console.log('关系数据：', relationship);
        switch (relationship) {
            case 0:
            case 1:
                return require('../../img/youquan/noAttention.png')
            case 256:
            case 257:
                return require('../../img/youquan/payAttention.png')
            default:
        }
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

    //关注和取消关注
    async changeRelationShip(data, rowid) {
        console.log(data.relationship)
        let b = data.relationship == 0 ? true : false
        if (b) {
            try {
                let responseJson = await CustomSync.fetch(this,global.httpURL + 'follow',
                                                            'POST',
                                                            {'Content-Type': 'application/x-www-form-urlencoded'},
                                                            'sid=' + global.sessionID + '&id=' + data.userid);
                if (responseJson) {
                    Alert.alert('','关注完成')
                    data.relationship = 256
                    this.state.listdata[rowid] = data
                    this.setState({ listdata: this.state.listdata })
                    global.userInformation.followed += 1
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
                                                '?sid=' +
                                                global.sessionID,
                                            'DELETE');
            Alert.alert('','取消关注完成');
            data.relationship = 0;
            this.state.listdata[rowid] = data;
            this.setState({ listdata: this.state.listdata });
            global.userInformation.followed -= 1;
        }
    }

    _renderHead() {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                backgroundColor: '#fff', padding: 5
            }}>
                <Text style={{backgroundColor:"transparent"}}>{this.props.titlename}</Text>
                <Text style={{ color: '#1596fe',backgroundColor:"transparent" }}>
                    我的排名：
                    {/*判断我的排名，20+'#999' 20-'#e4393c'*/}
                    <Text style={{ color: '#999',backgroundColor:"transparent" }}>
                        {this.state.listdata ? this.state.myindex : '未入榜'}
                    </Text>
                </Text>
            </View>
        )
    }

    goChatView(rowdata) {
        console.log('asd', rowdata)
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ChatView',
                component: chatView,
                params: {
                    targetUserId: rowdata.userid,
                    targetUserName: rowdata.nickname,
                    sex: rowdata.sex,
                    userinfo:rowdata
                }
            })
        }
    }
    
    _renderRow(rowData, rowId) {
        console.log('排行榜rowData')
        let Rank = parseInt(rowId) + 1;
        let linearArr = [];
        if (parseInt(rowId) <= 2) {
            linearArr = LinearColorArr[parseInt(rowId)]
        } else {
            linearArr = ['#fff', '#1596fe']
        }
        let headImage = global.common.fileurl.imgavatar + rowData.avatar;
        console.log(rowData.avatar,rowData.nickname)
        return (
            <View style={{ padding: 10 }}>
                <LinearGradient style={{ padding: 5, borderRadius: 5,backgroundColor:'#fff' }}
                        colors={linearArr}
                        start={{ x: 0.0, y: 0.0 }}
                        end={{ x: 1.0, y: 0.0 }}
                        locations={[0.3, 1]}>
                    {/*TOP图标*/}
                    {
                        parseInt(rowId) <= 2 ?
                            <Image source={TopArr[parseInt(rowId)]}
                                style={{
                                    resizeMode: 'contain', position: 'absolute', top: 0, left: -5,
                                    zIndex: 999
                                }} />
                            :
                            <View style={{
                                width: 35, height: 35, borderRadius: 3,
                                backgroundColor: '#1596fe', justifyContent: 'center',
                                alignItems: 'center', position: 'absolute', left: 5, top: 0, zIndex: 999
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff',backgroundColor:"transparent" }}>
                                    {parseInt(rowId) + 1}
                                </Text>
                            </View>
                    }

                    <TouchableOpacity activeOpacity={0.8}
                        onPress={this._gotherself.bind(this, rowData)}
                        style={{}}>
                        <View>
                            <Text style={{
                                textAlign: 'right', textAlignVertical: 'center',
                                color: '#e21586',marginRight:5,backgroundColor:"transparent"
                            }}>
                                {this.props.mainText}
                                <Text style={{ color: '#e4393c', fontWeight: 'bold', fontSize: 16,backgroundColor:"transparent" }}>
                                    {this.props.listtype != 3 ? rowData.num : rowData.mileage}
                                </Text>
                            </Text>
                            <LinearGradient style={{alignSelf: 'center', marginTop: 5,padding:5}}
                                            colors={['#fff','rgba(255,255,255,0)']}
                                            start={{ x: 0.0, y: 0.0 }}
                                            end={{ x: 1.0, y: 0.0 }}
                                            locations={[0, 0.6]}>
                                <View style={{ width: Width * .86, alignSelf: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={{ uri: headImage }}
                                            style={{
                                                resizeMode: 'cover', width: Width * .15,
                                                height: Width * .15, borderRadius: Width * .075,
                                                borderWidth: 2, borderColor: '#ffcc00'
                                            }} />
                                        <View style={{justifyContent:'space-between',height:Width*.12}}>
                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{
                                                    textAlignVertical: 'bottom',
                                                    marginLeft: Width * .03, fontSize: 18,
                                                    color: '#222', fontWeight: 'bold',
                                                    backgroundColor:"transparent"
                                                }}>
                                                    {rowData.nickname}
                                                </Text>
                                                {/*根据rowData.sex判断性别，sexArr[1]为男，2为女*/}
                                                <View style={{ justifyContent: 'flex-end' }}>
                                                    <Image source={sexArr[rowData.sex - 1]}
                                                        style={{
                                                            resizeMode: 'contain', width: Width * .08,
                                                            position: 'relative', bottom: -8
                                                        }} />
                                                </View>
                                            </View>
                                            <Text style={{
                                                textAlignVertical: 'center', textAlign: 'left',
                                                alignSelf: 'flex-start', color: '#999',
                                                fontWeight: 'bold', marginTop: 20,
                                                marginLeft: Width * .02,backgroundColor:"transparent"}}
                                                numberOfLines = {1}>
                                                {rowData.signature}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'flex-end',
                        marginTop: 5, alignItems: 'center',marginRight:5
                    }}>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.changeRelationShip(this.state.listdata[rowId], rowId) }}>
                            {/*<Image source={this.getRelationShip(this.state.listdata[rowId].relationship,1)}
                                   style={{}} />*/}
                            <Image source={this.getRelationShip(this.state.listdata[rowId].relationship)}
                                style={{ resizeMode: 'contain',width:Width*.055,height:Width*.055 }} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.goChatView(rowData) }}
                            style={{ marginLeft: Width * .02 }}>
                            <Image source={require('../../img/rank_u1740.png')}
                                style={{ resizeMode: 'contain' ,width:Width*.055,height:Width*.055}} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        )
    }

    render() {
        this.state.listdata = this.props.listdata
        this.state.myindex = this.props.myindex
        return (
            <View style={{ flex: 1, backgroundColor: '#ddd' }}>
                {this.state.listdata && this.state.listdata.length > 0 ?
                    <ListView dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                        renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                        renderHeader={this._renderHead.bind(this)}
                        showsVerticalScrollIndicator={false}
                        initialListSize={3}
                        enableEmptySections={true}
                        onEndReachedThreshold={0}
                        onEndReached={this._onEndRefresh}
                        refreshControl={
                            <RefreshControl onRefresh={this._onTopRefresh.bind(this)}
                                refreshing={this.state.isRefresh}
                                colors={['#1596fe','#e4393c']}/>
                        } />
                    :
                    <View style={{
                        flex: 1, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#fff', width: Width, height: Height - 120
                    }}>
                        <Spinner style={{}}
                        isVisible={true}
                        size={100}
                        type={'ChasingDots'} color={'#1596fe'}/>
                    </View>}
            </View>
            
        )
    }
}