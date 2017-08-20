import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ListView,
    Platform,
    RefreshControl,
    InteractionManager,
    Navigator,
    ScrollView
} from 'react-native';
import Navbar from '../component/navbar';
import { toastShort } from '../Toast/ToastUtil';
import CreateYouji from './Youji/createYouji';
import TravelNoteContent from './Youji/travel_note_content';
import CustomSync from '../sync';
import CacheImage from '../component/cacheImage';
import LoadingView from '../component/loadingView';
import Register from '../login/register';
var Spinner = require('react-native-spinkit');

var Back = require('../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class NewYouJi extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listData: [],
            refresh: false,
            sessionID: global.sessionID,
            userId: global.userInformation ? global.userInformation.userid : null
        }
    }
    componentWillReceiveProps(nextProps) {
        if (global.updataMyList) {
            this.setState({
                refresh: true
            }, () => {
                this.LoadData();
                global.updataMyList = false;
                this.setState({
                    refresh: false
                })
            })
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(
            () => {
                this.setState({
                    refresh: true
                }, async () => {
                    await this.LoadData();
                    this.setState({ refresh: false })
                    console.log('顶部刷新')
                })
            }
        )
    }

    async LoadData() {
        CustomSync.visitor(this);
        this.setState({
            sessionID: global.sessionID
        })
        let userInformation = global.userInformation;
        let nickName = userInformation.nickname;
        let avatarHead = userInformation.avatar;
        await this.setState({
            userId: userInformation.userid,
            nickname: userInformation.nickname,
            avatar: userInformation.avatar,
            isSelf: userInformation.userid == this.props.userid
        })
        console.log('个人信息')
        console.log(userInformation)

        let loaduserid = this.props.userid ? this.props.userid : this.state.userId
        console.log(loaduserid)
        console.log(global.httpURL + 'travelnotes?sid='
            + global.sessionID
            + '&offset=0'
            + '&num=50'
            + '&userid=' + loaduserid)
        let responseJson = await CustomSync.fetch(this, global.httpURL + 'travelnotes?sid='
            + global.sessionID
            + '&offset=0'
            + '&num=50'
            + '&userid=' + loaduserid)
        console.log('游记管理')
        console.log(responseJson)
        if (responseJson.list) {
            let myList = responseJson.list;
            this.setState({ listData: responseJson.list })
        } else {
            this.setState({ listData: [] })
        }
    }

    _goTravelNote(rowData, rowId) {
        const { navigator } = this.props;
        let allDataList = rowData;
        let nickName = this.state.nickname;
        let avatarHead = this.state.avatar;
        let backgroundImage = global.common.fileurl.imgtravel + rowData.coverphotos[0];
        allDataList.nickname = nickName;
        allDataList.avatar = avatarHead;
        if (navigator) {
            navigator.push({
                name: 'TravelNoteContent',
                component: TravelNoteContent,
                params: {
                    allData: allDataList,
                    backgroundImage: backgroundImage,
                    isSelf: true,
                }
            })
        }
    }

    _onEndRefresh() {
        console.log('底部刷新')
    }

    _onTopRefresh() {
        this.setState({
            refresh: true,
            listData: []
        }, () => {
            setTimeout(async () => {
                await this.LoadData();
                this.setState({ refresh: false })
                console.log('顶部刷新')
            }, 1000)
        })
    }
    _renderRow(rowData, sectionId, rowId) {
        console.log(rowData)
        let Img = rowData.coverphotos[0];
        let ImageURL;
        //新建游记显示本地图片
        /*if (rowData.isCreate) {
            ImageURL = Img;
        } else {
            ImageURL = global.common.fileurl.imgtravel + Img;
        }
        console.log(ImageURL)*/
        return (
            <TouchableOpacity style={styles.listDataView}
                activeOpacity={0.8}
                onPress={() => { this._goTravelNote(rowData, rowId) }}>
                <View style={styles.dataTitle}>
                    <Text style={styles.title}
                        numberOfLines={1}>{rowData.title}</Text>
                    <Text style={styles.cycleNum}>{rowData.recordsnum}条行程</Text>
                </View>
                <View style={styles.dataBody}>
                    <Text numberOfLines={2}
                        style={styles.dataBodyText}>{rowData.content}</Text>
                </View>
                {/*测试用图片*/}
                <View style={styles.dataTitleImageView}>
                    <Image source={{ uri: global.common.fileurl.imgtravel + Img }} style={styles.dataTitleImage} />
                    {/*<CacheImage envUrl={global.common.fileurl.imgtravel}
                                url={Img}
                                style={styles.dataTitleImage}
                                resizeMode='cover' />*/}
                </View>
                <View style={styles.opinionView}>
                    <Text style={styles.opinionText}>观看数：{rowData.views}</Text>
                    <Text style={styles.opinionText}>点赞数：{rowData.praise}</Text>
                    <Text style={styles.opinionText}>打赏数：{rowData.awards}</Text>
                    <Text style={styles.opinionText}>
                        图片数：
                        {rowData.imagesnum ? rowData.imagesnum - 1 : rowData.imagesnum}
                    </Text>
                </View>
                <View style={styles.hrLine} />
                <View style={styles.locationView}>
                    <Text style={styles.locationTitle}>游记地点</Text>
                    <Text style={styles.locationText}>{rowData.location}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    _renderList() {
        const isEmpty = this.state.listData === undefined || this.state.listData.length === 0;
        if (isEmpty) {
            /*return(
                <LoadingView/>
            )*/
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this._onTopRefresh.bind(this)}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center' }}>
                        {this.state.isSelf ?
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 16, textAlign: 'center', backgroundColor: "transparent" }}>
                                    master，您还没有发布过游记......
                                </Text>
                                <Text style={{
                                    fontSize: 16, alignSelf: 'center', textDecorationLine: 'underline', color: 'rgba(20,150,255,1)',
                                    textAlign: 'center', backgroundColor: 'transparent', paddingTop: 10
                                }} onPress={this._rightBtn.bind(this)}>
                                    赶紧发布一篇游记吧
                                </Text>
                            </View>
                            :
                            <Text style={{ fontSize: 16, textAlign: 'center', backgroundColor: "transparent" }}>
                                master，TA还没有发布过游记.....
                            </Text>
                        }
                    </View>
                </ScrollView>
            );
        }
        return (
            <ListView style={{ flex: 1 }}
                dataSource={this.state.dataSource.cloneWithRows(this.state.listData)}
                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                initialListSize={3}
                onEndReachedThreshold={0}
                enableEmptySections={true}
                onEndReached={this._onEndRefresh}
                refreshControl={
                    <RefreshControl onRefresh={this._onTopRefresh.bind(this)}
                        refreshing={this.state.refresh}
                        colors={['#1596fe', '#e4393c']} />
                } />
        )
    }
    _rightBtn() {
        //新建游记
        const { navigator } = this.props;
        console.log(navigator)
        if (navigator) {
            navigator.push({
                name: 'CreateYouji',
                component: CreateYouji,
                //1新建，2编辑
                params: {
                    status: 1
                }
            })
        }
    }
    backView() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render() {
        console.log('268', this.props.userid, this.state.userId)
        let navtitle = this.props.userid == this.state.userId ? '游记管理' : '他的游记'
        let showrightbtn = this.props.userid == this.state.userId ? true : false
        return (
            <View style={styles.container}>
                <Navbar title={navtitle}
                    rightItemTitle={'新增'}
                    rightTextColor={'#fff'}
                    rightItemvisible={showrightbtn}
                    rightItemFunc={this._rightBtn.bind(this)}
                    leftitemvisible={this.props.showback}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back} />
                {this.state.refresh ?
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',
                                    backgroundColor:'#fff'}}>
                        <Spinner style={{}}
                        isVisible={true}
                        size={100}
                        type={'ChasingDots'} color={'#1596fe'}/>
                    </View>
                  :
                    this._renderList()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    //container
    container: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    //单挑数据结构
    listDataView: {
        width: Width,
        backgroundColor: '#fff',
        marginBottom: 10,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    dataTitle: {
        width: Width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    title: {
        fontSize: 20,
        color: '#000',
        width: Width * 0.6,
        backgroundColor: 'transparent'
    },
    cycleNum: {
        color: '#169BD5',
        backgroundColor: 'transparent'
    },
    dataBody: {
        width: Width * 0.9,
        marginBottom: 5
    },
    dataBodyText: {
        width: Width * 0.7,
        color: '#000',
        fontSize: 15,
        backgroundColor: 'transparent'
    },
    dataTitleImageView: {
        width: Width * 0.9,
        marginBottom: 5
    },
    dataTitleImage: {
        resizeMode: 'cover',
        height: Height * 0.2,
        width: Width * 0.9
    },
    opinionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Width * 0.92,
        flexWrap: 'wrap',
        marginBottom: 10
    },
    hrLine: {
        width: Width * 0.9,
        height: 1,
        backgroundColor: '#bbb',
        marginBottom: 3
    },
    locationView: {
        width: Width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    locationText: {
        fontSize: 20,
        color: '#000',
        backgroundColor: "transparent"
    },
    locationTitle: {
        color: '#000',
        backgroundColor: "transparent"
    },
    opinionText: {
        backgroundColor: "transparent"
    }
})