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
    BackAndroid,
    Platform
} from 'react-native';
import NavBar from '../../component/navbar';
import Button from '../../component/button';
import Main from '../main';
import MessageCenter from '../messageCenter';
import ImageViewer from 'react-native-image-zoom-viewer';
import Comment from '../Youquan/comment';
import LikeList from './like_list';
import NearGrantList from './near_grant_list';
import PayReadModal from './payReadModal';
import GrantModal from './grant';
import { toastShort } from '../../Toast/ToastUtil';
import TopGrantList from './top_grant_list';
import Report from './report';
import SettingXingcheng from './settingXingcheng';
import EditWarningModal from './EditWarningModal';
import CreateYouji from './createYouji';
import CreateYoujiSetting from './createYoujiSetting';
import CustomSync from '../../sync';
import CacheImage from '../../component/cacheImage';
import PersonalCenter from '../personalCenter';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// MaterialCommunityIcons
// crown star account-off share


var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

var Back = require('../../img/back.png');
var WeChat = require('react-native-wechat');
const images = []
var noteSid, xingchengID, xingchengRowId, youjiID, allYouji, youjiRowId, grant;

export default class TravelNoteContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelf: false,
            editMode: false,
            modalVisible: false,
            swiperIndex: 0,
            listData: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            //付费阅读
            payReadShow: false,
            grantShow: false,
            isCollect: null,
            //提示框
            warningDeleteYouji: false,
            warningDeleteXingcheng: false
        }
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        const { navigator } = this.props;
        if (this.state.editMode) {
            this.setState({ editMode: false });
            return true;
        }
        if (navigator) {
            if (this.props.collectView) {
                navigator.pop();
                return true;
            }
            var routes = navigator.state.routeStack;
            for (var i = routes.length - 1; i >= 0; i--) {
                if (routes[i].name === "Main") {
                    var destinationRoute = navigator.getCurrentRoutes()[i]
                    navigator.popToRoute(destinationRoute);
                    return true;
                }
            }
        }
        return false;
    };

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        if (this.props.allYouji) {
            allYouji = this.props.allYouji;
        }
        this.setState({
            sessionID: global.sessionID
        })
        console.log('赋值完毕')
        console.log(this.props.allData)
        //editMode编辑状态:true
        if (this.props.editMode) {
            this.setState({
                editMode: this.props.editMode
            })
        }
        //isSelf是否为自己游记
        if (this.props.isSelf) {
            this.setState({
                isSelf: true
            })
        }
        //进入浏览状态时，请求参数
        if (this.props.notesid) { noteSid = this.props.notesid; }
        if (this.props.allData) { noteSid = this.props.allData.id; }
        console.log(noteSid)
        if (noteSid) {
            this.loadXingchengList(noteSid);
        }
        if (this.props.allData) {
            console.log(global.userInformation);
            this.setState({
                indexAllData: this.props.allData,
                isCollect: this.props.allData.icollected,
            })
            if (global.sessionID) {
                this.setState({
                    isSelf: this.props.allData.userid == global.userInformation.userid ? true : false
                })
            }
        } else {
            this.LoadData(noteSid);
        }
    }

    async loadXingchengList(noteSid) {
        let responseJson = await CustomSync.fetch(this, global.httpURL + 'notesrecords?sid='
            + global.sessionID
            + '&notesid=' + noteSid)
        console.log('调取协议')
        console.log('行程列表')
        console.log(responseJson)
        responseJson.data ?
            this.setState({
                listData: responseJson.data,
            })
            :
            this.setState({
                listData: []
            })
    }

    async LoadData(noteSid) {
        let responseJson = await CustomSync.fetch(this, global.httpURL + 'travelnotes/' + noteSid
            + '?sid=' + global.sessionID)
        console.log('单条游记数据')
        console.log(responseJson)
        if (responseJson.data) {
            let allData = responseJson.data;
            let nickName = global.userInformation.nickname;
            let avatarHead = global.userInformation.avatar;
            allData.nickname = nickName;
            allData.avatar = avatarHead;
            console.log(allData)
            this.setState({ indexAllData: allData })
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps')
        console.log(nextProps)
        if (global.updataYoujidata) {
            if (nextProps.editNoteSid) {
                console.log('触发编辑游记状态数据更新')
                this.LoadData(nextProps.editNoteSid);
                global.updataYoujidata = false;
            }
        }
        if (global.updateXingchengId) {
            this._getOnceXingchengData(global.updateXingchengId)
        }
    }


    async _getOnceXingchengData(obj) {
        let responseJson = await CustomSync.fetch(this, global.httpURL + 'notesrecords/' + obj.data +
            '?sid=' + global.sessionID);
        console.log('刷新单条行程')
        console.log(responseJson)
        if (responseJson.status == 1) {
            let rowData = responseJson.data;
            let listData = this.state.listData;
            switch (obj.status) {
                case 1:
                    //新建
                    listData.splice(obj.rowId, 0, rowData);
                    break
                case 2:
                    //编辑
                    listData.splice(obj.rowId, 1, rowData);
                    break
            }
            this.setState({
                listData: listData
            }, () => {
                global.updateXingchengId = null;
            })
        } else {
            console.log(responseJson.status)
        }
    }

    setModalVisible(visible, index, rowId) {
        console.log(images);
        this.setState({
            rowImage: rowId,
            swiperIndex: index,
            modalVisible: visible,
        }, function () { console.log(images[this.state.rowImage]) });
    }
    //付费阅读modal
    _showPayReadModal = () => {
        let isPayReadShow = this.state.payReadShow
        this.setState({
            payReadShow: !isPayReadShow
        })
    }

    componentDidMount() {
        this._getNumberOne();
    }

    async _getNumberOne() {
        if (this.props.indexAllData) {
            let URL = global.httpURL + 'rewardrank/1/'
                + this.props.indexAllData.id
                + '?sid=' + global.sessionID
                + '&num=1';
            let responseJson = await CustomSync.fetch(this, URL);
            if (responseJson.status == 1 && responseJson.data) {
                grant = responseJson.data[0];
            }
        }
    }

    _showGrantModal() {
        let isGrantShow = this.state.grantShow
        this.setState({
            grantShow: !isGrantShow
        })
    }

    _goComment() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'Comment',
                component: Comment,
                params: {
                    indexAllData: this.state.indexAllData
                }
            })
        }
    }
    _goLikeList() {
        const { navigator } = this.props;
        if (navigator && this.props.allData) {
            navigator.push({
                name: 'LikeList',
                component: LikeList,
                params: {
                    travelID: this.props.allData.id,
                }
            })
        }
    }
    _goNearGrant() {
        console.log('去最近打赏', this.props.allData);
        const { navigator } = this.props;
        if (navigator && this.props.allData) {
            navigator.push({
                name: 'NearGrantList',
                component: NearGrantList,
                params: {
                    travelID: this.props.allData.id,
                }
            })
        }
    }
    _goTopGrant() {
        const { navigator } = this.props;
        if (navigator && this.state.indexAllData) {
            navigator.push({
                name: 'TopGrantList',
                component: TopGrantList,
                params: {
                    indexAllData: this.state.indexAllData
                }
            })
        }
    }

    GoEdit(enabled) {
        this.setState({ editMode: enabled })
    }
    //跳转发布设置
    _goYoujiSetting(data) {
        console.log('跳转到发布设置中')
        console.log(data);
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateYoujiSetting',
                component: CreateYoujiSetting,
                params: {
                    editYoujiData: data,
                    status: 2,
                    onlySetting: true
                }
            })
        }
    }
    //举报
    _goReport() {
        console.log('举报')
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'Report',
                component: Report,
                params: {
                    notesid: noteSid
                }
            })
        }
    }

    onClickBack() {
        const { navigator } = this.props;
        if (navigator) {
            if (this.props.collectView) {
                navigator.pop();
                return
            }
            var routes = navigator.state.routeStack;
            for (var i = routes.length - 1; i >= 0; i--) {
                if (routes[i].name === "Main") {
                    var destinationRoute = navigator.getCurrentRoutes()[i]
                    navigator.popToRoute(destinationRoute);
                }
            }
        }
    }

    async clickLike() {
        let youjiData = this.state.indexAllData;
        if (!youjiData) {
            return;
        }
        console.log(youjiData);
        if (youjiData.ipraised) {
            //取消点赞
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'praise/1/' + youjiData.id + '/0', 'POST',
                { 'Content-Type': 'application/x-www-form-urlencoded' },
                'sid=' + global.sessionID);
            console.log(responseJson);
            youjiData.ipraised = false;
            youjiData.praise--;
            this.setState({
                indexAllData: youjiData
            });
            toastShort('取消成功')
        } else {
            //点赞
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'praise/1/' + youjiData.id + '/1', 'POST',
                { 'Content-Type': 'application/x-www-form-urlencoded' },
                'sid=' + global.sessionID)
            console.log('点赞', global.sessionID)
            /*let response = await fetch(global.httpURL+'praise/1/'+youjiData.id+'/1',{
                method:'POST',
                body:'sid='+global.sessionID
            })
            let responseJson = await response.json();*/
            console.log(responseJson);
            youjiData.ipraised = true;
            youjiData.praise++;
            this.setState({
                indexAllData: youjiData
            });
            toastShort('点赞成功')
        }

    }

    onEndReached() {
        console.log('触发底部刷新');
        //判断是否收费游记并且是否支付(debugger默认显示)
        if (!this.state.isSelf
            && this.state.indexAllData.recordsnum >= 4
            && this.state.indexAllData.unitprice > 0
            && this.state.listData.length <= 3) {
            if (!global.sessionID) {
                toastShort('该游记已设置付费阅读\n您当前没有登录，请登录');
                return
            }
            this.setState({
                payReadShow: true
            })
        }
    }
    _getTime(data) {
        data = new Date(data * 1000);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        return year + '-' + month + '-' + date;
    }

    //跳转个人信息
    _gotherself() {
        let objdata = new Object()
        objdata.userid = this.props.allData.userid
        objdata.avatar = this.props.allData.avatar
        objdata.averagespending = this.props.allData.averagespending
        objdata.nickname = this.props.allData.nickname
        objdata.location = this.props.allData.location
        objdata.ipraised = this.props.allData.ipraised
        objdata.views = this.props.allData.views
        objdata.readersnum = this.props.allData.readersnum
        const { navigator } = this.props;
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

    renderHeader() {
        let youjiData = this.state.indexAllData;
        let xingchengData = this.state.listData;
        let headImage = global.common.fileurl.imgavatar + youjiData.avatar
        //图片地址判定
        let backgroundImage;
        if (youjiData.isCreate) {
            backgroundImage = youjiData.coverphotos[0]
        } else {
            backgroundImage = global.common.fileurl.imgtravel + youjiData.coverphotos[0];
        }
        console.log('游记信息')
        console.log(backgroundImage);
        console.log(youjiData)
        let location = youjiData.location;
        if (location.length >= 10) {
            location = location.substring(0, 10) + '...';
        }
        return (
            <View style={{ width: Width, flexDirection: 'column' }}>
                {
                    this.props.backgroundImage ?
                        <Image
                            source={{ uri: this.props.backgroundImage }}
                            resizeMode={'cover'}
                            style={{ width: Width, height: Width / 1.775, position: 'absolute', top: 0 }}
                        />
                        :
                        <Image
                            source={{ uri: backgroundImage }}
                            resizeMode={'cover'}
                            style={{ width: Width, height: Width / 1.775, position: 'absolute', top: 0 }}
                        />
                }
                <View style={{ backgroundColor: 'rgba(0,0,0,.7)', width: Width, position: 'absolute', top: 0, paddingTop: 3, paddingBottom: 3, paddingLeft: 5, paddingRight: 5 }}>
                    <Text style={{ fontSize: 18, color: '#fff' }}>
                        {youjiData.title}
                    </Text>
                </View>
                <View style={{ width: Width, flexDirection: 'row', marginTop: Width / 1.725 }}>
                    <View style={{ paddingLeft: 5, width: Width * 0.25, alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => { this._gotherself() }}>
                            {/*<Image
                                source={{uri:headImage}}
                                resizeMode={'cover'} 
                                style={{width:75,height:75,borderRadius:38,
                                        alignSelf:'center', borderWidth:2, borderColor:'#eee'}}
                            />*/}
                            <CacheImage cacheType='head'
                                envUrl={global.common.fileurl.imgavatar}
                                url={youjiData.avatar}
                                style={{
                                    width: Width * .2, height: Width * .2, borderRadius: Width * .1,
                                    alignSelf: 'center', borderWidth: 2, borderColor: '#eee'
                                }}
                                resizeMode='cover' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: Width * 0.5, flexDirection: 'column', alignSelf: 'center', paddingLeft: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', backgroundColor: 'transparent' }}
                            onPress={() => { }}
                        >
                            {/*global.sessionID ? CustomSync.getRemark(youjiData.userid, youjiData.nickname) : ()=>{}*/
                                youjiData.nickname}
                        </Text>
                    </View>
                    <View style={{ alignSelf: 'flex-end', position: 'absolute', right: 5, bottom: 0 }}>
                        {/*<Text style={{fontSize:10, color:'#1596fe', paddingBottom:15, alignSelf:'flex-end',backgroundColor:'transparent'}}>
                            {youjiData.recordsnum}条行程
                        </Text>*/}
                        <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'flex-end', backgroundColor: 'transparent' }}>
                            目的地：{location}
                        </Text>
                    </View>
                </View>
                {/*<View style={{width:Width*.8,alignSelf:'center',flexDirection: 'row',justifyContent:'flex-end',borderBottomWidth:0,borderRightColor:'rgba(0,0,0,.3)',paddingLeft:10, paddingBottom: 10, paddingTop:10}}>
                    <Text style={styles.text_content}>
                        观看数：{youjiData.views>=1000 ? '999+' : youjiData.views}
                    </Text>
                    <Text style={styles.text_content}>
                        点赞：{youjiData.praise>=1000 ? '999+' : youjiData.praise}
                    </Text>
                    <Text style={styles.text_content}>
                        打赏：{youjiData.awards}
                    </Text>
                    <Text style={styles.text_content}>
                        图片数：
                        {youjiData.imagesnum ? youjiData.imagesnum-1 : youjiData.imagesnum}
                    </Text>
                </View>*/}
                <View style={{ width: Width, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}>
                    <Text style={styles.text_content}>
                        出发时间：
                        {
                            youjiData.eventtime ?
                                this._getTime(youjiData.eventtime)
                                :
                                '--'
                        }
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: Width * .4 }}>
                        <Text style={styles.text_content}>
                            人均：
                        </Text>
                        <Text style={styles.text_content}>
                            {
                                youjiData.averagespending ?
                                    youjiData.averagespending
                                    :
                                    '--'
                            }
                        </Text>
                    </View>
                </View>
                <Text style={{ fontSize: 15, paddingTop: 20, paddingLeft: 10, paddingRight: 10, paddingBottom: 10, backgroundColor: 'transparent', color: '#333' }}>
                    {youjiData.content}
                </Text>
                {
                    this.state.isSelf ?
                        <View style={{
                            flexDirection: 'row-reverse',
                            alignSelf: 'center',
                            alignItems: 'center',
                            height: 50,
                            borderTopWidth: 0,
                            width: Width - 20,
                            paddingRight: 10,
                            paddingLeft: 10,
                            borderColor: '#CCCCCC'
                        }}>
                            {
                                this.state.editMode ?
                                    <View style={{
                                        flexDirection: 'row-reverse',
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'space-around',
                                        width: Width * 0.6
                                    }}>
                                        <Button text='删除'
                                            color='#fff'
                                            backgroundColor='#1596fe'
                                            width={50}
                                            height={30}
                                            style={{ paddingTop: 10, paddingLeft: 5 }}
                                            click={this._deleteYouji.bind(this, youjiData.id)} />
                                        <Button text='插入'
                                            color='#fff'
                                            backgroundColor='#1596fe'
                                            width={50}
                                            height={30}
                                            style={{ paddingTop: 10, paddingLeft: 5 }}
                                            click={this._insertXingcheng.bind(this, -1)} />
                                        <Button text='编辑'
                                            color='#fff'
                                            backgroundColor='#1596fe'
                                            width={50}
                                            height={30}
                                            style={{ paddingTop: 10, paddingLeft: 5 }}
                                            click={this._editYouji.bind(this, youjiData)} />
                                    </View>
                                    :
                                    <View />
                            }
                        </View>
                        :
                        <View />
                }
                <View style={{ height: 3, backgroundColor: '#ddd' }} />
                {
                    this.state.listData.length == 0 &&
                    <Text style={{ alignSelf: 'center', backgroundColor: 'transparent' }}>主人没有编写任何行程</Text>
                }
            </View>
        );
    }
    _renderImageList(item, i) {
        let Img = global.common.fileurl.imgtravel + item.uri
        if (Img) {
            return (
                <TouchableHighlight style={{
                    width: Width * 0.25, height: Width * 0.25, margin: 3,
                    alignItems: 'center', justifyContent: 'center'
                }}
                    underlayColor={'#ddd'}
                    onPress={() => { this.setModalVisible(true, item.index, item.rowId) }}
                    key={i}>
                    {/*<Image
                             source={{uri:Img}}
                             resizeMode={'cover'}
                             style={{width:Width*0.24,height:Width*0.24}}
                         />*/}
                    <CacheImage envUrl={global.common.fileurl.imgtravel}
                        url={item.uri}
                        style={{ width: Width * 0.24, height: Width * 0.24 }}
                        resizeMode='cover' />
                </TouchableHighlight>
            )
        }
    }
    /*_renderImageListFileImage(item){
        /*let Img;
        //判断图片路径
            if(item.uri){
                Img = item.uri;
            }else{
                Img = global.common.fileurl.imgtravel + item;
            }
        if(Img){
            return (
                <TouchableHighlight style={{width:Width*0.25,height:Width*0.25,margin:3,
                                            alignItems:'center',justifyContent:'center',}}
                                    underlayColor = {'#ddd'}
                                    onPress={()=>{this.setModalVisible(true,item.index,item.rowId)}}>
                     <CacheImage defaultSource={require('../../img/The_blue.png')}
                               envUrl= {global.common.fileurl.imgtravel}
                               url= {item}
                               resizeMode='cover'
                               style={{ width:Width*0.24,height:Width*0.24 }} />
                </TouchableHighlight>
            )
        }
    }*/
    _renderImage(article, rowId) {
        let rowIndex = parseInt(rowId);
        images[rowIndex] = [];
        console.log('coverphotos', article.coverphotos)
        for (var key in article.coverphotos) {
            images[rowIndex].push({ url: global.common.fileurl.imgtravel + article.coverphotos[key] });
        }
        if (article.coverphotos) {
            let arr = article.coverphotos;
            let arr1 = [];
            arr.map(item => arr1.push({ uri: item, index: arr1.length, rowId: rowId }))
            return arr1.map((item, i) => this._renderImageList(item, i))
        }
        /*let Img=this.state.environmentVariable.travalurl+article.coverphotos[0]
        return(
            <TouchableHighlight style={{width:Width*0.25,height:Width*0.25,margin:5,backgroundColor:'#e4393c'}}
                                >
                 <Image
                         source={{uri:Img}}
                         resizeMode={'cover'}
                         style={{width:Width*0.25,height:Width*0.25}}
                     />
             </TouchableHighlight>
        )*/
    }

    //增删改游记
    _deleteYouji(id) {
        console.log('删除游记')
        youjiID = id;
        this._deleteYoujiModal();
    }
    _editYouji(data) {
        console.log('编辑游记')
        console.log(data);
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'CreateYouji',
                component: CreateYouji,
                params: {
                    status: 2,
                    editYoujiData: data
                }
            })
        }
    }
    _deleteYoujiModal() {
        let isShow = this.state.warningDeleteYouji
        this.setState({
            warningDeleteYouji: !isShow
        })
    }
    async _confirmDeleteYouji() {
        if (youjiID) {
            let ID = youjiID;
            let responseJson = await CustomSync.fetch(this,
                global.httpURL + 'travelnotes/' + ID + '?sid=' + global.sessionID,
                'DELETE')
            console.log(responseJson)
            if (responseJson.status == 1) {
                toastShort('删除成功')
                this.setState({
                    warningDeleteYouji: false
                }, () => {
                    global.updateSuibi = true;
                    const { navigator } = this.props;
                    if (navigator) {
                        global.updataMyList = true;
                        global.userInformation.travelnotes--;
                        navigator.pop();
                    }
                })
            } else {
                toastShort('master...网络被汪星人破坏了，请稍后再试')
            }
        }
    }

    //增删改行程
    //编辑行程
    _editXingcheng(rowData, rowId) {
        console.log('编辑行程');
        console.log(rowData);
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'SettingXingcheng',
                component: SettingXingcheng,
                params: {
                    status: 2,
                    notesid: noteSid,
                    //编辑行程参数
                    rowData: rowData,
                    rowId: rowId
                }
            })
        }
    }
    //新建，插入行程
    _insertXingcheng(number) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'SettingXingcheng',
                component: SettingXingcheng,
                params: {
                    notesid: noteSid,
                    //排序num
                    preordernum: parseInt(number) + 1,
                    status: 1
                }
            })
        }
    }
    //删除行程
    _deleteXingcheng(id, rowId) {
        xingchengID = id;
        xingchengRowId = rowId;
        console.log(xingchengID)
        this._deleteXingchengModal();
    }
    _deleteXingchengModal() {
        let isShow = this.state.warningDeleteXingcheng
        this.setState({
            warningDeleteXingcheng: !isShow
        })
    }
    async _confirmDeleteXingcheng() {
        if (xingchengID) {
            let ID = xingchengID;
            console.log('确认删除' + ID)
            let responseJson = await CustomSync.fetch(this,
                global.httpURL + 'notesrecords/' + ID + '?sid=' + global.sessionID,
                'DELETE')
            if (responseJson.status == 1) {
                let rowId = xingchengRowId;
                let listData = this.state.listData;
                listData.splice(rowId, 1);
                this.setState({
                    listData: listData
                })
                this._deleteXingchengModal();
                toastShort('删除成功')
                global.updataMyList = true;
            } else {
                toastShort('master...网络被汪星人破坏了，请稍后再试')
            }

        }
    }

    renderItem(article, sectionId, rowId) {
        let loc = '';
        if (article.location) {
            loc = article.location.substring(parseInt(article.location.lastIndexOf('-')) + 1);
            console.log('位置', loc);
        }
        return (
            <View style={styles.containerItemBottom} key={rowId}>
                {article.title ?
                    <Text style={styles.text_content_title}>
                        {article.title ?
                            article.title
                            :
                            ''}
                    </Text>
                    :
                    <View />
                }
                <View style={{
                    width: Width - 20,
                    borderBottomWidth: 0,
                    borderColor: '#000',
                    alignSelf: 'center',
                    paddingTop: 10
                }} />
                <View style={styles.containerItemBottomText}>
                    <Text style={styles.text_content}
                    >
                        {` ${article.location ? '发布于:' + loc : '           '}`}
                    </Text>
                    <Text style={styles.text_content}
                    >
                        更新时间：{this._getTime(article.createtime)}
                    </Text>
                </View>
                <Text style={{ fontSize: 15, paddingTop: 20, alignSelf: 'center', width: Width * 0.9, backgroundColor: 'transparent', color: '#333' }}
                >
                    {article.content}
                </Text>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginLeft: 10,
                    marginTop: 5,
                    marginRight: 10,
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}>
                        {this._renderImage(article, rowId)}
                    </View>
                </View>
                {this.state.isSelf ?
                    <View style={{
                        flexDirection: 'row-reverse',
                        alignSelf: 'center',
                        alignItems: 'center',
                        height: 50,
                        borderTopWidth: 2,
                        width: Width - 20,
                        paddingRight: 10,
                        paddingLeft: 10,
                        borderColor: '#CCCCCC'
                    }}>
                        {
                            this.state.editMode ?
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    width: Width * 0.6
                                }}>
                                    <Button text='删除'
                                        color='#fff'
                                        backgroundColor='#1596fe'
                                        width={50}
                                        height={30}
                                        style={{ paddingTop: 10, paddingLeft: 5 }}
                                        click={this._deleteXingcheng.bind(this, article.id, rowId)} />
                                    <Button text='插入'
                                        color='#fff'
                                        backgroundColor='#1596fe'
                                        width={50}
                                        height={30}
                                        style={{ paddingTop: 10, paddingLeft: 5 }}
                                        click={this._insertXingcheng.bind(this, rowId)} />
                                    <Button text='编辑'
                                        color='#fff'
                                        backgroundColor='#1596fe'
                                        width={50}
                                        height={30}
                                        style={{ paddingTop: 10, paddingLeft: 5 }}
                                        click={this._editXingcheng.bind(this, article, rowId)} />
                                </View>
                                :
                                <View />
                        }
                    </View>
                    :
                    <View />
                }
            </View>
        );
    }

    _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 2,
                    backgroundColor: '#CCCCCC',
                }}
            />
        );
    }

    renderBottomView() {
        if (this.state.isSelf) {
            return (
                this.state.editMode ?
                    <View style={{ width: Width, height: Height * 0.063, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Button text='新增一篇行程'
                            color='#fff'
                            backgroundColor='#1596fe'
                            width={Width}
                            height={Height * 0.06}
                            click={this._insertXingcheng.bind(this, this.state.listData.length - 1)} />
                    </View>
                    :
                    <View style={{
                        width: Width, height: Height * 0.063,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <Button text='评论'
                            color='#fff'
                            backgroundColor='#1596fe'
                            width={Width * 0.33}
                            height={Height * 0.06}
                            click={this._goComment.bind(this)} />
                        <Button text='谁赞过我'
                            color='#fff'
                            backgroundColor='#1596fe'
                            width={Width * 0.33}
                            height={Height * 0.06}
                            click={this._goLikeList.bind(this)} />
                        <Button text='最近打赏'
                            color='#fff'
                            backgroundColor='#1596fe'
                            width={Width * 0.33}
                            height={Height * 0.06}
                            click={this._goNearGrant.bind(this)} />
                    </View>
            );
        }
        else {
            return (
                <View style={{
                    width: Width, height: Height * 0.063,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <Button text='评论'
                        color='#fff'
                        backgroundColor='#1596fe'
                        width={Width * 0.33}
                        height={Height * 0.06}
                        click={this._goComment.bind(this)} />
                    <Button text={this.state.indexAllData.ipraised ?
                        '取消点赞'
                        //('+parseInt(this.state.indexAllData.praise)+')
                        :
                        '点赞'
                        //('+this.state.indexAllData.praise+')
                    }
                        color='#fff'
                        backgroundColor='#1596fe'
                        width={Width * 0.33}
                        height={Height * 0.06}
                        click={this.clickLike.bind(this)} />
                    <Button text='打赏'
                        color='#fff'
                        backgroundColor='#1596fe'
                        width={Width * 0.33}
                        height={Height * 0.06}
                        click={this._showGrantModal.bind(this)} />
                </View>
            );
        }
    }
    //收藏游记
    async _collectYouji() {
        console.log(this.props.allData.id)
        let youjiId = this.props.allData.id;
        let Sid = global.sessionID;
        let responseJson = await CustomSync.fetch(this,
            global.httpURL + 'collects/1/' + youjiId,
            'POST',
            { 'Content-Type': 'application/x-www-form-urlencoded' },
            'sid=' + Sid)
        console.log(responseJson);
        if (responseJson.status == 1) {
            toastShort('收藏成功')
            this.setState({
                isCollect: true
            })
        } else {
            toastShort('收藏失败：' + global.errorcode[responseJson.status].msg)
        };
    }
    async _deleteCollectYouji() {
        let youjiId = this.props.allData.id;
        let Sid = global.sessionID;
        let responseJson = await CustomSync.fetch(this,
            global.httpURL + 'collects/1/' + youjiId + '?sid=' + Sid,
            'DELETE')
        console.log(responseJson);
        if (responseJson.status == 1) {
            toastShort('取消收藏：' + responseJson.status);
            this.setState({
                isCollect: false
            });
        } else {
            toastShort('操作失败：' + global.errorcode[responseJson.status].msg);
        };
    }

    _wechatFriend() {
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    let youjiData = this.state.indexAllData;
                    try {
                        if (global.wechatIn) {
                            WeChat.shareToTimeline({
                                type: 'news',
                                thumbImage: global.common.fileurl.imgtravel + youjiData.coverphotos[0],
                                title: 'Theblue_APP 旅行必备',
                                webpageUrl: global.httpURL + 'static/DownloadAPP/',
                                description: youjiData.title
                            }).catch((err) => {
                                toastShort(err.message)
                            })
                        } else {
                            if (!global.wechatIn) {
                                if (Platform.OS == 'ios') {
                                    WeChat.registerApp(global.wechatIos).then(res => {
                                        global.wechatIn = true;
                                    });
                                } else {
                                    WeChat.registerApp(global.wechatAndroid).then(res => {
                                        global.wechatIn = true;
                                    });
                                }
                            }
                            toastShort('网络异常，请稍后尝试')
                        }
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    toastShort('没有安装微信软件，请您安装微信之后再试');
                }
            })
    }

    render() {
        if (this.state.indexAllData) {
            return (
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({
                                modalVisible: false
                            })
                        }}>
                        <ImageViewer imageUrls={images[this.state.rowImage]}
                            index={this.state.swiperIndex}
                            onClick={() => {
                                this.setModalVisible(false, 0)
                            }}
                            failImageSource={'../../img/default_photo.png'}
                        />
                    </Modal>
                    <View style={styles.container}>
                        {/*<NavBar title={''}
                            leftImageSource={Back}
                            leftItemFunc={this.onClickBack.bind(this)}
                            rightItemTitle={this.state.editMode?'完成':'编辑'}
                            rightTextColor='#fff'
                            rightItemFunc={()=>{this.GoEdit(!this.state.editMode)}}
                            />*/}
                        {/*多图navbar*/}
                        <View style={styles.moreImageNavbar}>
                            {/*左边返回*/}
                            {
                                this.state.editMode ?
                                    <View />
                                    :
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={this.onClickBack.bind(this)}>
                                            <Image source={Back} style={{ height: 22, resizeMode: 'contain' }} />
                                        </TouchableOpacity>
                                    </View>
                            }
                            {/*右边多图*/}
                            {this.state.editMode ?
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TouchableOpacity onPress={() => { this.GoEdit(!this.state.editMode) }}>
                                        <Text style={{ color: '#fff', fontSize: 18, backgroundColor: 'transparent' }}>保存</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                this.state.isSelf ?
                                    <View style={{
                                        width: Width * 0.35,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <TouchableOpacity onPress={this._goTopGrant.bind(this)}>
                                            <MaterialCommunityIcons name='crown' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { this.GoEdit(!this.state.editMode) }}>
                                            <MaterialCommunityIcons name='border-color' style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }} size={30} color='rgba(255,255,255,1)' />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this._goYoujiSetting.bind(this, this.state.indexAllData)}>
                                            <MaterialCommunityIcons name='settings' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <TouchableOpacity activeOpacity={0.8}
                                            onPress={this._goTopGrant.bind(this)}>
                                            <MaterialCommunityIcons name='crown' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                        </TouchableOpacity>
                                        {
                                            this.state.isCollect ?
                                                <TouchableOpacity activeOpacity={0.8}
                                                    onPress={this._deleteCollectYouji.bind(this)}>
                                                    <MaterialCommunityIcons name='star' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity activeOpacity={0.8}
                                                    onPress={this._collectYouji.bind(this)}>
                                                    <MaterialCommunityIcons name='star-outline' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                                </TouchableOpacity>
                                        }
                                        <TouchableOpacity activeOpacity={0.8}
                                            onPress={this._goReport.bind(this)}>
                                            <MaterialCommunityIcons name='account-off' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.8}
                                            onPress={this._wechatFriend.bind(this)}>
                                            <MaterialCommunityIcons name='share' style={{ padding: 5 }} size={30} color='rgba(255,255,255,1)' />
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                        {
                            <ListView
                                initialListSize={3}
                                dataSource={this.state.dataSource.cloneWithRows(this.state.listData)}
                                renderRow={this.renderItem.bind(this)}
                                renderHeader={this.renderHeader.bind(this)}
                                style={styles.listView}
                                onEndReached={() => this.onEndReached()}
                                onEndReachedThreshold={10}
                                onScroll={this.onScroll}
                                renderSeparator={this._renderSeperator.bind(this)}
                                pageSize={3}
                                enableEmptySections={true}
                            /*refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={()=>{alert('刷新了')}}
                                title="Loading..."
                                colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                            />
                            }*/
                            />
                        }
                        {
                            this.renderBottomView()
                        }
                    </View>
                    {/*是否付费modal*/}
                    {this.state.isSelf ?
                        <Modal visible={false}
                            onRequestClose={() => { }}></Modal>
                        :
                        <Modal animationType='fade'
                            transparent={true}
                            visible={this.state.payReadShow}
                            onRequestClose={this._showPayReadModal.bind(this)}>
                            <PayReadModal cancelBtn={this._showPayReadModal.bind(this)}
                                indexAllData={this.state.indexAllData}
                                navigator={this.props.navigator}
                                loadXingchengList={this.loadXingchengList.bind(this)} />
                        </Modal>
                    }
                    {/*是否打赏modal*/}
                    <Modal animationType='fade'
                        transparent={true}
                        visible={this.state.grantShow}
                        onRequestClose={this._showGrantModal.bind(this)}>
                        <GrantModal cancelBtn={this._showGrantModal.bind(this)}
                            grant={grant}
                            indexAllData={this.state.indexAllData}
                            setData={(data) => { this.setState({ indexAllData: data }) }}
                            navigator={this.props.navigator} />
                    </Modal>
                    {/*提示用户删除游记OR行程*/}
                    <Modal animationType='fade'
                        transparent={true}
                        visible={this.state.warningDeleteYouji}
                        onRequestClose={this._deleteYoujiModal.bind(this)}>
                        <EditWarningModal cancel={this._deleteYoujiModal.bind(this)}
                            confirm={this._confirmDeleteYouji.bind(this)}
                            title={'提示'}
                            mainText={'确认后将删除该游记及其全部行程\n'}
                            warning={'\n是否确认删除？'} />
                    </Modal>
                    <Modal animationType='fade'
                        transparent={true}
                        visible={this.state.warningDeleteXingcheng}
                        onRequestClose={this._deleteXingchengModal.bind(this)}>
                        <EditWarningModal cancel={this._deleteXingchengModal.bind(this)}
                            confirm={this._confirmDeleteXingcheng.bind(this)}
                            title={'提示'}
                            mainText={'确认后将删除该条行程\n'}
                            warning={'\n是否确认删除？'} />
                    </Modal>
                </View>
            )
        } else {
            return (<View><Text style={{ backgroundColor: 'transparent' }}>加载中...</Text></View>)
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
        justifyContent: 'center'
    },
    row: {
        flex: 1
    },
    moreImageNavbar: {
        width: Width,
        height: 70,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 15,
        backgroundColor: '#1596fe',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    moreImage: {
        width: Width * 0.1,
        resizeMode: 'contain'
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
        backgroundColor: '#eee'
    },
    containerItemTop: {
        flexDirection: 'row',
        width: Width,
    },
    containerItemBottom: {
        flexDirection: 'column',
        paddingTop: 10
    },
    containerItemBottomText: {
        width: Width * .9,
        flexDirection: 'row',
        marginBottom: 5,
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    text_name: {
        fontSize: 21,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 15
    },
    text_item: {
        marginLeft: 10,
        fontSize: 12,
        marginTop: 15,
    },
    text_content_title: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    text_content: {
        fontSize: 12,
        color: '#555',
        backgroundColor: 'transparent'
    }
})