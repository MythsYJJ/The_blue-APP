import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    ListView,
    RefreshControl,
    Modal,
    CameraRoll
} from 'react-native';
import NavBar from '../component/navbar';
import Button from '../component/button';
import ImageViewer from 'react-native-image-zoom-viewer';
import TravelNoteContent from './Youji/travel_note_content';
import { toastShort } from '../Toast/ToastUtil';
import CustomSync from '../sync';
import CacheImage from '../component/cacheImage';
import LoadingView from '../component/loadingView';
import PersonalCenter from './personalCenter';
import CreateYouji from './Youji/createYouji';
import Register from '../login/register';
import CreateSuibi from './Suibi/createSuibi';
import SuibiContent from './Suibi/Suibi_content';
import Entypo from 'react-native-vector-icons/Entypo';
var Spinner = require('react-native-spinkit');

const images = [{
    url: 'http://192.168.1.169/img/t1.png'
}, {
    url: 'http://192.168.1.169/img/t2.png'
}, {
    url: 'http://192.168.1.169/img/t3.png'
}, {
    url: 'http://192.168.1.169/img/t4.jpg'
}]

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
var btnMore = require('../img/youquan/btnMore.png');
const hambar = require('../img/hambar.png');

export default class Youquan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionID: global.sessionID,
            modalVisible: false,
            swiperIndex: 0,
            listData: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            showBtn: false,
            refresh: false,
            stateYouquan: false,
            menu: false
        }
    }

    componentWillMount() {
        this.setState({
            refresh: true
        }, async () => {
            await this._loadData();
            this.setState({ refresh: false })
            console.log('顶部刷新')
        })
    }

    componentWillReceiveProps(nextProps) {
        if (global.updateSuibi) {
            this._loadData();
        }
    }

    async _loadData() {
        if (global.sessionID) {
            let userInformation = global.userInformation;
            this.setState({
                userInformation: userInformation,
                sessionID: global.sessionID
            })
            //判定是收藏协议还是游圈协议
            let str = this.props.youquan ? global.httpURL + 'travelnotesfollowers?sid='
                + global.sessionID
                + '&offset=0'
                + '&num=50'
                + '&userid=' + userInformation.userid
                :
                this.props.suibi ?
                    global.httpURL + 'essays?sid='
                    + global.sessionID
                    + '&offset=0'
                    + '&num=50'
                    + '&userid=' + this.props.userId
                    :
                    global.httpURL + 'collects/1?sid='
                    + global.sessionID
                    + '&offset=0'
                    + '&num=50'
                    + '&userid=' + userInformation.userId;
            console.log('youquan', str)
            let responseJson = await CustomSync.fetch(this, str);
            console.log('youquandata', responseJson)
            if (responseJson.data) {
                this.setState({ listData: responseJson.data, refresh: false })
                console.log(responseJson.data);
                return
            }
            if (responseJson.list) {
                this.setState({ listData: responseJson.list, refresh: false })
                console.log(responseJson.list);
                return
            }
            this.setState({ listData: [], refresh: false })
            global.updateSuibi = false;
        } else {
            CustomSync.visitor(this);
        }
    }

    setModalVisible(visible, index) {
        this.setState({
            swiperIndex: index,
            modalVisible: visible
        });
    }

    GoCollection() {
        let list = this.state.listData;
        list.map(item => {
            item.showBtn = false;
        })
        this.setState({
            listData: list,
            menu: false
        })
        let { navigator } = this.props;
        if (navigator) {
            this._showMenu();
            navigator.push({
                name: 'StateYouquan',
                component: Youquan,
                params: {
                    youquan: false
                }
            })
        }
        /*Image.getSize(require('../img/1.jpg'), (width, height) => {
                            sizeLoaded = true;
                    console.log('width = '+width+' height = '+height)
                        }, (error) => {
                    console.log('fail3')
                        });*/
    }

    _goTravelNote(rowData) {
        if (this.state.menu) {
            this.setState({ menu: false });
            return
        }
        if (this.state.listData) {
            let list = this.state.listData;
            list.map(item => {
                item.showBtn = false;
            })
            this.setState({
                listData: list,
                menu: false
            })
        }
        const { navigator } = this.props;
        let allDataList = rowData;
        let backgroundImage = global.common.fileurl.imgtravel + allDataList.coverphotos[0];
        let isMySelf = false;
        console.log(allDataList)
        if (allDataList.userid == global.userInformation.userid) {
            isMySelf = true;
        }
        console.log(rowData)
        console.log(backgroundImage)
        if (navigator) {
            if (rowData.category == 0) {
                navigator.push({
                    name: 'TravelNoteContent',
                    component: TravelNoteContent,
                    params: {
                        allData: allDataList,
                        backgroundImage: backgroundImage,
                        isSelf: isMySelf,
                        collectView: true
                    }
                })
            } else {
                let userInfo = new Object();
                userInfo.avatar = rowData.avatar;
                userInfo.nickname = rowData.nickname;
                userInfo.befollowed = rowData.befollowed;
                userInfo.ipraised = rowData.ipraised;
                navigator.push({
                    name: 'SuibiContent',
                    component: SuibiContent,
                    params: {
                        id: rowData.id,
                        viewtye: this.props.viewtye == 2 ? 2 : 1,
                        userinfo: userInfo
                    }
                })
            }
        }
    }

    _onTopRefresh() {
        this.setState({
            refresh: true
        }, () => {
            setTimeout(async () => {
                await this._loadData();
                this.setState({ refresh: false })
                console.log('顶部刷新')
            }, 1000);
        })
    }

    onEndReached() {
        console.log('触发底部刷新')
    }

    _getTime(data) {
        data = new Date(data * 1000);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        return year + '-' + month + '-' + date;
    }

    _showBtn(article, rowId) {
        let showBtn = article.showBtn ? article.showBtn : false;
        article.showBtn = !showBtn;
        this.state.listData[rowId] = article;
        this.setState({
            listData: this.state.listData
        })
    }

    //跳转个人信息
    _gotherself(article) {
        // let objdata = new Object()
        // objdata.userid = this.props.allData.userid
        // objdata.avatar = this.props.allData.avatar
        // objdata.averagespending =  this.props.allData.averagespending
        // objdata.nickname =  this.props.allData.nickname
        // objdata.location =  this.props.allData.location
        // objdata.ipraised = this.props.allData.ipraised
        // objdata.views = this.props.allData.views
        // objdata.readersnum =  this.props.allData.readersnum
        const { navigator } = this.props;
        if (navigator && article) {
            navigator.push({
                name: 'PersonalCenter',
                component: PersonalCenter,
                params: {
                    navigator: navigator,
                    userId: article.userid,
                }
            })
        }
    }

    renderItem(article, sectionId, rowId) {
        let backgroundImage = global.common.fileurl.imgtravel + article.coverphotos[0];
        let HeadImage = global.common.fileurl.imgavatar + article.avatar;
        //判断随笔与游记
        let status = article.category;//暂时写死
        return (
            <TouchableOpacity onPress={() => { this._goTravelNote(article) }} activeOpacity={1}>
                <View style={styles.containerItem}>
                    {/*右上角row类型*/}
                    <View style={{
                        position: "absolute", top: -Width * .115, right: -Width * .115,
                        backgroundColor: status == 0 ? '#1596fe' : '#e4393c',
                        width: Width * .23, height: Width * .23, zIndex: 999,
                        justifyContent: "center", alignItems: 'center',
                        transform: [{ rotate: '45deg' }]
                    }}>
                        <Text style={{
                            transform: [{ rotate: "-45deg" }, { translateX: -Width * .045 }, { translateY: Width * .045 }], color: '#fff',
                            fontSize: 16, backgroundColor: 'transparent'
                        }}>
                            {status == 0 ? '游记' : '随笔'}
                        </Text>
                    </View>
                    <View style={styles.containerItemTop}>
                        <View style={{ paddingLeft: 5, width: Width * 0.18, alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => { this._gotherself(article) }}
                                activeOpacity={.9}>
                                {/*<Image
                                    source={{ uri: HeadImage }}
                                    resizeMode={'cover'}
                                    style={{ width: 50, height: 50, borderRadius: 25 }}
                                />*/}
                                <CacheImage cacheType='head'
                                    envUrl={global.common.fileurl.imgavatar}
                                    url={article.avatar}
                                    style={{ width: Width * .15, height: Width * .15, borderRadius: Width * .075 }}
                                    resizeMode='cover' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: Width * 0.62, flexDirection: 'column' }}>
                            <View style={{ width: Width * 0.62, alignSelf: 'flex-start' }}>
                                <Text style={styles.text_name}
                                    onPress={() => { this._gotherself(article) }}
                                >
                                    {article.nickname}
                                </Text>
                            </View>
                            <View style={{ width: Width * 0.62, alignSelf: 'flex-start', marginBottom: 10 }}>
                                <Text style={styles.text_item}
                                >
                                    {/*粉丝：{article.befollowed}*/}
                                </Text>
                            </View>
                        </View>
                        {(article.userid != global.userInformation.userid) ?
                            <TouchableHighlight style={{
                                width: Width * .08, height: Width * .06, position: "absolute",
                                right: Width * .1, bottom: 0, alignItems: 'center',
                                justifyContent: 'center', padding: 8
                            }}
                                onPress={() => { this._showBtn(article, rowId) }}
                                underlayColor={'transparent'}>
                                <Image source={btnMore} style={{ resizeMode: 'contain', width: Width * .07, height: Width * .05 }}
                                />
                            </TouchableHighlight>
                            :
                            <View />}
                        {this.state.listData[rowId].showBtn ?
                            <View style={{
                                flexDirection: 'row', position: "absolute",
                                right: Width * 0.17, bottom: 0, borderRadius: 3, backgroundColor: '#444'
                            }}>
                                <TouchableHighlight onPress={() => { this._ipraised(article, rowId) }}>
                                    <View style={{
                                        flexDirection: 'row', justifyContent: "center",
                                        alignItems: 'center', width: Width * .2, height: Width * .06
                                    }}>
                                        <Image source={require('../img/youquan/zan.png')}
                                            style={{
                                                resizeMode: 'contain', width: Width * .05,
                                                height: Width * .05, marginRight: Width * .01
                                            }} />
                                        <Text style={{ color: '#fff', fontSize: 16, backgroundColor: 'transparent' }}>
                                            {this.showBtnTitle(rowId, false)}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                                {
                                    status == 0 ?
                                        <TouchableHighlight onPress={() => { this.collectyouji(article, rowId) }}>
                                            <View style={{
                                                flexDirection: 'row', justifyContent: "center",
                                                alignItems: 'center', width: Width * .2, height: Width * .06
                                            }}>
                                                <Image source={require('../img/youquan/collect.png')}
                                                    style={{
                                                        resizeMode: 'contain', width: Width * .05,
                                                        height: Width * .05, marginRight: Width * .01
                                                    }} />
                                                <Text style={{ color: '#fff', fontSize: 16, backgroundColor: 'transparent' }}>
                                                    {this.showBtnTitle(rowId, true)}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                        :
                                        <View />
                                }
                            </View>
                            :
                            <View />
                        }
                    </View>
                    {
                        status == 0 ?
                            /*游记展示*/
                            <View style={styles.containerItemBottom}>
                                <View style={styles.dataTitle}>
                                    <Text style={styles.title}
                                        numberOfLines={1}>
                                        {article.title}
                                    </Text>
                                    {/*<Text style={styles.cycleNum}>{article.recordsnum}条行程</Text>*/}
                                </View>
                                <View style={styles.dataBody}>
                                    <Text numberOfLines={2}
                                        style={styles.dataBodyText}>{article.content}</Text>
                                </View>
                                {/*测试用图片*/}
                                <View style={styles.dataTitleImageView}>
                                    {/*<Image source={{ uri: backgroundImage }}
                                            style={styles.dataTitleImage} />*/}
                                    <CacheImage envUrl={global.common.fileurl.imgtravel}
                                        url={article.coverphotos[0]}
                                        style={styles.dataTitleImage}
                                        resizeMode='cover' />
                                </View>
                                {/*<View style={styles.opinionView}>
                                    <Text style={styles.opinionText}>观看数：{article.views}</Text>
                                    <Text style={styles.opinionText}>点赞数：{article.praise}</Text>
                                    <Text style={styles.opinionText}>打赏数：{article.awards}</Text>
                                    <Text style={styles.opinionText}>
                                        图片数：
                                    {article.imagesnum ? article.imagesnum - 1 : article.imagesnum}
                                    </Text>
                                </View>
                                <View style={styles.hrLine} />*/}
                                <View style={styles.locationView}>
                                    <Text style={styles.locationTitle}>游记地点</Text>
                                    <Text style={styles.locationText}>{article.location}</Text>
                                </View>
                            </View>
                            :
                            /* 随笔展示 */
                            <View style={styles.containerItemBottom}>
                                <Text numberOfLines={3}
                                    style={{ width: Width * .9, color: '#222', fontSize: 15, backgroundColor: 'transparent' }}>
                                    {article.content}
                                </Text>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', flexWrap: 'wrap' }}>
                                    {this._suibiImage.bind(this, article.coverphotos)()}
                                </View>
                                {/*<View style={[styles.opinionView, { width: Width * .6 }]}>
                                    <Text style={styles.opinionText}>点赞数：{article.praise}</Text>
                                    <Text style={styles.opinionText}>评论数：{article.comments}</Text>
                                </View>*/}
                            </View>
                    }
                    <View style={styles.containerItemBottomText}>
                        <Text style={styles.text_content}
                        >
                            {article.postlocation ? '发布于:'+article.postlocation : `          `}
                        </Text>
                        <Text style={styles.text_content}
                        >
                            最后修改时间：{this._getTime(article.lastupdatetime)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _suibiImage(images) {
        /*let rowIndex=parseInt(rowId);
        images[rowIndex]=[];
        console.log('coverphotos',article.coverphotos)
        for(var key in article.coverphotos){
            images[rowIndex].push({url:global.common.fileurl.imgtravel+article.coverphotos[key]});
        }
        if(article.coverphotos){
            let arr=article.coverphotos;
            let arr1=[];
            arr.map(item=> arr1.push({uri:item,index:arr1.length,rowId:rowId}))
            return arr1.map( (item,i) => this._renderImageList(item,i))
        }*/
        let leng = images.length;
        return images.map((item, i) => this._suibiImageList(item, i, leng));
    }

    _suibiImageList(item, i, leng) {
        let Img = global.common.fileurl.imgtravel + item;
        let len = leng - 3;
        if (i > 2) {
            return
        }
        if (i == 2) {
            return (
                <View style={{
                    width: Width * 0.28, height: Width * 0.28, margin: 3,
                    alignItems: 'center', justifyContent: 'center'
                }}
                    key={i}>
                    <Image source={{ uri: Img }}
                        style={{
                            width: Width * 0.28, height: Width * 0.28, resizeMode: 'cover',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                        {leng > 3 ?
                            <View style={{
                                width: Width * 0.28, height: Width * 0.28,
                                alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,.3)'
                            }}>
                                <Text style={{ fontSize: 30, color: '#fff', fontWeight: 'bold', backgroundColor: 'transparent' }}>
                                    +{len}
                                </Text>
                            </View>
                            :
                            <View />
                        }
                    </Image>
                    {/*<CacheImage envUrl={global.common.fileurl.imgtravel}
                                url={item.uri}
                                style={{width:Width*0.24,height:Width*0.24}}
                                resizeMode='cover' />*/}
                </View>
            )
        }
        return (
            <View style={{
                width: Width * 0.28, height: Width * 0.28, margin: 3,
                alignItems: 'center', justifyContent: 'center'
            }}
                key={i}>
                <Image source={{ uri: Img }}
                    style={{ width: Width * 0.28, height: Width * 0.28, resizeMode: 'cover' }} />
                {/*<CacheImage envUrl={global.common.fileurl.imgtravel}
                            url={item.uri}
                            style={{width:Width*0.24,height:Width*0.24}}
                            resizeMode='cover' />*/}
            </View>
        )
    }

    showBtnTitle(rowId, collect) {
        if (collect) {
            if (this.state.listData != undefined && this.state.listData.length > 0) {
                console.log(rowId)
                if (this.state.listData[rowId].icollected ||
                    this.state.listData[rowId].icollected == undefined) {
                    this.state.listData[rowId]['icollected'] = true
                    return '取消'
                }
                else {
                    return '收藏'
                }
            }
        }
        else {
            if (this.state.listData != undefined && this.state.listData.length > 0) {
                return this.state.listData[rowId].ipraised ? '取消' : '点赞'
            }
        }
    }

    async _ipraised(article, rowId) {
        console.log(article.ipraised);
        if (article.ipraised == undefined || article.ipraised) {
            try {
                let responseJson = await CustomSync.fetch(this, global.httpURL + 'praise/1/' + article.id + '/0',
                    'POST',
                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                    'sid=' + global.sessionID);
                if (responseJson.status == 1) {
                    toastShort('取消点赞完毕')
                    article.ipraised = false;
                    this.state.listData[rowId] = article
                    this.setState({ listData: this.state.listData })
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                let responseJson = await CustomSync.fetch(this, global.httpURL + 'praise/1/' + article.id + '/1',
                    'POST',
                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                    'sid=' + global.sessionID);
                if (responseJson.status == 1) {
                    toastShort('点赞完毕')
                    article.ipraised = true
                    this.state.listData[rowId] = article
                    this.setState({ listData: this.state.listData })
                }
            } catch (err) { console.log(err) }
        }
    }

    async collectyouji(article, rowId) {
        console.log(article.icollected)
        if (article.icollected == undefined || article.icollected) {
            article['icollected'] = true
            try {
                let responseJson = await CustomSync.fetch(this,
                    global.httpURL +
                    'collects/1/' +
                    article.id +
                    '?sid=' +
                    global.sessionID,
                    'DELETE');
                if (responseJson.status == 1) {
                    toastShort('取消收藏完毕')
                    article.icollected = false
                    this.state.listData[rowId] = article
                    this.setState({ listData: this.state.listData })
                }
            } catch (err) {
                console.log(err)
            }
        }
        else {
            try {
                let responseJson = await CustomSync.fetch(this,
                    global.httpURL + 'collects/1/' + article.id,
                    'POST',
                    { 'Content-Type': 'application/x-www-form-urlencoded' },
                    'sid=' + global.sessionID)
                console.log(global.httpURL + 'collects/1' + article.id)
                if (responseJson.status == 1) {
                    toastShort('收藏完毕')
                    article.icollected = true
                    this.state.listData[rowId] = article
                    this.setState({ listdata: this.state.listdata })
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
    _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 5,
                    backgroundColor: adjacentRowHighlighted ? '#ddd' : '#ddd',
                }}
            />
        );
    }

    renderContent(dataSource) {
        const isEmpty = this.state.listData === undefined || this.state.listData.length === 0;
        console.log(isEmpty)
        if (isEmpty) {
            /*return (
                <LoadingView/>
            )*/
            return (
                <View style={{ flex: 1 }}>
                    {
                        this.state.menu ?
                            <View style={{
                                backgroundColor: '#fff', position: 'absolute', top: 0, right: 0, zIndex: 999,
                                borderWidth: 1, borderColor: '#ddd', padding: 3
                            }}>
                                <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this.GoCollection.bind(this)}>
                                    <View style={{
                                        flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start',
                                        padding: 5
                                    }}>
                                        <Entypo name='folder' size={30} color='rgba(20,150,255,1)'/>
                                        <Text style={{ backgroundColor: 'transparent', fontSize: 18 }}>收藏夹</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ height: 1, width: Width * .3, backgroundColor: '#ddd', alignSelf: 'center' }} />
                                <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this._rightBtn.bind(this)}>
                                    <View style={{
                                        flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start',
                                        padding: 5
                                    }}>
                                        <Entypo name='book' size={30} color='rgba(20,150,255,1)'/>
                                        <Text style={{ backgroundColor: 'transparent', fontSize: 18 }}>新建游记</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ height: 1, width: Width * .3, backgroundColor: '#ddd', alignSelf: 'center' }} />
                                <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this._createSuibi.bind(this)}>
                                    <View style={{
                                        flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start',
                                        padding: 5
                                    }}>
                                        <Entypo name='new-message' size={30} color='rgba(20,150,255,1)'/>
                                        <Text style={{ backgroundColor: 'transparent', fontSize: 18 }}>新建随笔</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            :
                            <View />
                    }
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        horizontal={false}
                        contentContainerStyle={styles.no_data}
                        style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl onRefresh={this._onTopRefresh.bind(this)}
                                refreshing={this.state.refresh}
                                colors={['#1596fe', '#e4393c']}
                                title="Loading..." />
                        }>
                        <TouchableOpacity activeOpacity={1}
                                          onPress={()=>{
                                              if(this.state.menu){
                                                  this.setState({
                                                      menu:false
                                                  })
                                              }
                                          }}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                {
                                    this.props.suibi ? 
                                        this.props.userId == global.userInformation.userid ? 
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', backgroundColor: 'transparent' }}>
                                                    master，您还没有发布过随笔...
                                                </Text>
                                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                    <Text style={{
                                                            fontSize: 16, alignSelf: 'center', textDecorationLine: 'underline', color: 'rgba(20,150,255,1)',
                                                            textAlign: 'center', backgroundColor: 'transparent'
                                                        }} onPress={this._createSuibi.bind(this)}>
                                                            赶紧发布一篇随笔吧
                                                    </Text>
                                                </View>
                                            </View>
                                        :
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', backgroundColor: 'transparent' }}>
                                                    master，TA还没有发布过随笔...
                                                </Text>
                                            </View>
                                    :
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', backgroundColor: 'transparent' }}>
                                                master，游记圈空空的....
                                        </Text>
                                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                                <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', backgroundColor: 'transparent' }}>
                                                    赶紧去
                                            </Text>
                                                <Text style={{
                                                    fontSize: 16, alignSelf: 'center', textDecorationLine: 'underline', color: 'rgba(20,150,255,1)',
                                                    textAlign: 'center', backgroundColor: 'transparent'
                                                }} onPress={this._rightBtn.bind(this)}>
                                                    发布一篇游记
                                            </Text>
                                                <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', backgroundColor: 'transparent' }}>
                                                    或
                                            </Text>
                                                <Text style={{
                                                    fontSize: 16, alignSelf: 'center', textDecorationLine: 'underline', color: 'rgba(20,150,255,1)',
                                                    textAlign: 'center', backgroundColor: 'transparent'
                                                }} onPress={this._createSuibi.bind(this)}>
                                                    发布一篇随笔
                                            </Text>
                                            </View>
                                        </View>
                                }
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={1}
                                onPress={()=>{
                                    if(this.state.menu){
                                        this.setState({
                                            menu:false
                                        })
                                    }
                                }}
                                style={{flex:1}}>
                    <View style={{flex:1}}>
                        {
                            this.state.menu ?
                                <View style={{
                                    backgroundColor: '#fff', position: 'absolute', top: 0, right: 0, zIndex: 999,
                                    borderWidth: 1, borderColor: '#ddd', padding: 3
                                }}>
                                    
                                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                            onPress={this.GoCollection.bind(this)}>
                                            <View style={{
                                                flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start',
                                                padding: 5
                                            }}>
                                                <Entypo name='folder' size={30} color='rgba(20,150,255,1)'/>
                                                <Text style={{ backgroundColor: 'transparent', fontSize: 18 }}>收藏夹</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <View style={{ height: 1, width: Width * .3, backgroundColor: '#ddd', alignSelf: 'center' }} />
                                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                            onPress={this._rightBtn.bind(this)}>
                                            <View style={{
                                                flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start',
                                                padding: 5
                                            }}>
                                                <Entypo name='book' size={30} color='rgba(20,150,255,1)'/>
                                                <Text style={{ backgroundColor: 'transparent', fontSize: 18 }}>新建游记</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <View style={{ height: 1, width: Width * .3, backgroundColor: '#ddd', alignSelf: 'center' }} />
                                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                            onPress={this._createSuibi.bind(this)}>
                                            <View style={{
                                                flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start',
                                                padding: 5
                                            }}>
                                                <Entypo name='new-message' size={30} color='rgba(20,150,255,1)'/>
                                                <Text style={{ backgroundColor: 'transparent', fontSize: 18 }}>新建随笔</Text>
                                            </View>
                                        </TouchableHighlight>
                                </View>
                                :
                                <View />
                        }
                        <ListView
                            initialListSize={1}
                            dataSource={dataSource}
                            renderRow={(rowData, sectionId, rowId) => this.renderItem(rowData, sectionId, rowId)}
                            style={styles.listView}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={10}
                            enableEmptySections={true}
                            onScroll={this.onScroll.bind(this)}
                            renderSeparator={this._renderSeperator}
                            pageSize={3}
                            refreshControl={
                                <RefreshControl onRefresh={this._onTopRefresh.bind(this)}
                                    refreshing={this.state.refresh}
                                    colors={['#1596fe', '#e4393c']}
                                    title="Loading..." />
                            }
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    onScroll() {
        if (this.state.menu) {
            this.setState({
                menu: false
            })
        }
        
    }

    _showMenu() {
        if (this.props.suibi) {
            this._createSuibi();
            return
        }
        let menu = this.state.menu;
        this.setState({
            menu: !menu
        })
    }

    _rightBtn() {
        //新建游记
        const { navigator } = this.props;
        console.log(navigator)
        if (navigator) {
            this.setState({
                menu: false
            })
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

    _createSuibi() {
        //新建随笔
        const { navigator } = this.props;
        console.log(navigator)
        if (navigator) {
            this.setState({
                menu: false
            })
            navigator.push({
                name: 'CreateSuibi',
                component: CreateSuibi,
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={this.props.youquan ?
                    '游记圈'
                    :
                    this.props.suibi ?
                        this.props.userId == global.userInformation.userid ?
                            '我的随笔'
                            :
                            'TA的随笔'
                        :
                        '收藏夹'}
                    rightImageSource={this.props.youquan ? hambar : ''}
                    rightItemTitle={this.props.suibi ? '新增' : ''}
                    rightTextColor={'#fff'}
                    rightItemFunc={this._showMenu.bind(this)}
                    leftitemvisible={this.props.youquan ? false : true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                    rightImageHeight={40}
                />
                {this.state.refresh ?
                    <View style={{
                        flex: 1, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#fff'
                    }}>
                        <Spinner style={{}}
                            isVisible={true}
                            size={100}
                            type={'ChasingDots'} color={'#1596fe'} />
                    </View>
                    :
                    this.renderContent(this.state.dataSource.cloneWithRows(this.state.listData))
                }
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {  }}
                >
                    <ImageViewer imageUrls={images}
                        index={this.state.swiperIndex}
                        onClick={() => {
                            this.setModalVisible(false, 0)
                        }}
                        failImageSource={'../img/default_photo.png'}
                    />
                </Modal>
            </View>
        )
    }
    backView() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
}

const absoluteLay = {
    position: 'absolute',
    bottom: 0,
    right: Width * 0.6,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ddd'
    },
    row: {
        flex: 1
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    listView: {
    },
    containerItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff',
        zIndex: 2,
        overflow: 'hidden'
    },
    containerItemTop: {
        flexDirection: 'row',
        width: Width,
    },
    containerItemBottom: {
        flexDirection: 'column',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        backgroundColor: 'rgba(0,0,0,.08)',
        padding: 5,
        alignItems: 'center'
    },
    containerItemBottomText: {
        backgroundColor: '#fff',
        width: Width * .9,
        alignSelf:'center',
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: 'space-between'
    },
    text_name: {
        fontSize: 21,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 15,
        backgroundColor: 'transparent'
    },
    text_item: {
        marginLeft: 10,
        fontSize: 12,
        marginTop: 15,
        backgroundColor: 'transparent'
    },
    text_content_title: {
        marginLeft: 10,
        fontSize: 18,
        marginTop: 5
    },
    text_content: {
        marginLeft: 10,
        marginRight: 30,
        marginTop: 5,
        fontSize: 12,
        backgroundColor: 'transparent'
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
        height: 2,
        backgroundColor: '#fff',
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
        backgroundColor: 'transparent'
    },
    locationTitle: {
        color: '#000',
        backgroundColor: 'transparent'
    },
    opinionText: {
        backgroundColor: 'transparent'
    }
})