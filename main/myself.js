import React, { Component } from 'react';
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
    Picker,
    Item,
    Modal,
    DatePickerIOS,
    DatePickerAndroid,
    Alert
} from 'react-native';
import NavBar from '../component/navbar';
import SelectList from '../component/myself_component';
import MyselfInformation from '../component/myself_information';
import CustomSync from '../sync';
import Button from '../component/button';
import Attention from './attention';
import Youquan from './youquan';
import recharge from './recharge';
import NewYouJi from './newYouji';
import reward from '../RewardLog/Reward';
import product from '../ProductView/Product';
import impression from '../Impression/Impression';
import ChatView from '../chat/ChatView';
import choosebg from '../Chooseuserinfobg/ChooseUserinfoBg';

//调用相册与摄像头
import ImagePicker from 'react-native-image-picker';
import GetHead from '../login/getHead';
import Swiper from 'react-native-swiper';

var Dimensions = require('Dimensions');//设备信息获取

var Back = require('../img/back.png');
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var lorem = '这是超长一段乱七八糟的各种都有的文字，貌似还不够长，在长一点.....................................................................我的天，很长了';
(function () {
    if (lorem.length >= 30) {
        lorem = lorem.substring(0, 30);
    }
})()
var alterinfo = new Object();
var alterstr = ''

var ImageList = [require('../img/touxiang/t1.jpg'),
require('../img/touxiang/t2.jpg'),
require('../img/touxiang/t3.jpg'),
require('../img/touxiang/t4.jpg'),
require('../img/touxiang/t5.jpg'),
require('../img/touxiang/t6.jpg'),
require('../img/touxiang/t7.jpg'),
require('../img/touxiang/t8.jpg'),
require('../img/touxiang/t9.jpg'),
require('../img/touxiang/t10.jpg')]
//调用相册摄像头
var options = {
    title: 'Select Avatar', // 选择器的标题，可以设置为空来不显示标题
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo...', // 调取摄像头的按钮，可以设置为空使用户不可选择拍照
    chooseFromLibraryButtonTitle: 'Choose from Library...', // 调取相册的按钮，可以设置为空使用户不可选择相册照片
    customButtons: {
        'Choose Photo from Facebook': 'fb', // [按钮文字] : [当选择这个按钮时返回的字符串]
    },
    mediaType: 'photo', // 'photo' or 'video'
    quality: .8,
    videoQuality: 'high', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 860, // photos only默认为手机屏幕的宽，高与宽一样，为正方形照片
    maxHeight: 480, // photos only
    allowsEditing: false, // 当用户选择过照片之后是否允许再次编辑图片
};

var BtnImage = [];
BtnImage['lcs'] = require('../img/myself/lcs.png')
BtnImage['gmcp'] = require('../img/myself/gmcp.png')
BtnImage['fensi'] = require('../img/myself/fensi.png')
BtnImage['guanzhu'] = require('../img/myself/guanzhu.png')
BtnImage['scj'] = require('../img/myself/scj.png')
BtnImage['skgw'] = require('../img/myself/skgw.png')
BtnImage['wdyj'] = require('../img/myself/wdyj.png')
BtnImage['yinxiang'] = require('../img/myself/yinxiang.png')

export default class Myself extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            PickerShow: false,
            pickeritem: [],
            pickeridx: 0,
            selectedValue: '',
            Pickerdate: new Date(),
            datepickshow: false,
            nowdate: new Date(),
            isself: false,
            bpayinfo: [],
            birthyear: '',
            birthmonth: '',
            //模态框数据
            show: false,
            show1: false,
            fileImage: null,
            ImageIndex: 0,
            showImage: 0,
        }

    }
    async _loadData() {
        let userInformation = global.userInformation
        let sessionID = global.sessionID
        if (this.props.allData) {
            if (this.props.allData.userid == userInformation.userid) {

                this.state.isself = true
                this.state.Pickerdate = new Date(parseInt(userInformation.birthdate) * 1000)
            }
            else {

                // 获取别人信息
                let uid = this.props.allData.userid
                let response = await fetch(global.httpURL + 'profile/' + uid + '?sid=' + sessionID);
                responseJson = await response.json();
                userInformation = responseJson.data;
                console.log('other user information', userInformation);
                let birth = userInformation.birthdate > 0 ? userInformation.birthdate : 0
                responseJson.data.birthdate <= 0 ? null : this.state.Pickerdate = new Date(parseInt(userInformation.birthdate) * 1000)
                this.state.isself = false
            }
        }
        else {
            this.state.Pickerdate = new Date(parseInt(userInformation.birthdate) * 1000)
            this.state.isself = true
        }
        lorem = userInformation.signature
        this.setState({ userInformation: userInformation
                        //personalinfo: environmentVariable.personalinfo,
                        /*envi: environmentVariable*/ })
    }

    componentWillMount() {
        this._loadData();
    }

    _Settxinfo() {
        if (!this.state.editMode && this.state.userInformation) {
            let headImage = this.state.envi.avatarurl + this.state.userInformation.avatar
            console.log(headImage)
            return (
                <View style={{
                    width: Width, alignSelf: 'center',
                    paddingLeft: Width * 0.025, paddingRight: Width * 0.025
                }}>
                    <View style={styles.ImageView}>
                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                            onPress={() => {  }}
                            style={styles.ImageHead}>
                            <CacheImage cacheType='head'
                                        envUrl={this.state.envi.avatarurl}
                                        url={this.state.userInformation.avatar}
                                        style={styles.ImageHead}
                                        resizeMode='cover'/>
                        </TouchableHighlight>
                        <View style={{ width: Width * .65, flexDirection: 'row' }}>
                            <Text style={[styles.ImageText, { fontSize: 20 }]}>
                                {this.state.userInformation.nickname}
                            </Text>
                            {this.state.userInformation.sex == 1 ?
                                <Image source={require('../img/myself/u112.png')}
                                    style={{ resizeMode: 'contain', height: 18, marginLeft: 5 }} />
                                :
                                <Image source={require('../img/myself/u109.png')}
                                    style={{ resizeMode: 'contain', height: 18, marginLeft: 5 }} />

                            }
                        </View>
                    </View>
                    <Text style={[styles.ImageText, { marginTop: 10 }]}>
                        {this.state.userInformation.signature ?
                            this.state.userInformation.signature
                            :
                            '主人很懒，没有写个性签名\n小编也无能为力'}
                    </Text>
                </View>
            )
        } else {
            <View />
        }
    }

    _BtnFunc(img, main, title, func) {
        return (<TouchableHighlight underlayColor={'rgba(0,0,0,.3)'}
            onPress={func}
            style={{}}>
            <View style={{
                width: Width * .325, alignItems: 'center', backgroundColor: '#fff',
                borderWidth: 3, borderColor: '#ddd'
            }}>
                <Image source={img}
                    style={{ resizeMode: 'contain', width: Width * .17 }} />
                <Text style={{ color: '#f89901', fontSize: 17,backgroundColor:'transparent' }}>{main}</Text>
                <Text style={{ color: '#222', fontSize: 16,backgroundColor:'transparent' }}>{title}</Text>
            </View>
        </TouchableHighlight>)
    }

    _SeteditMode() {
        let btnname = this.state.isself ?
            '我'
            :
            (this.state.userInformation && this.state.userInformation.sex == 1) ?
                '他' : '她'
        if (this.state.userInformation) {
            let headImage = this.state.envi.avatarurl + this.state.userInformation.avatar
            if (!this.state.editMode) {
                //自己的个人资料浏览状态
                return (
                    <View>
                        <View style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            alignItems: 'center', width: Width * .9, alignSelf: 'center'
                        }}>
                            <View style={{ flexDirection: 'row', width: Width * .5, justifyContent: 'space-between' }}>
                                <Image source={require('../img/myself/djq.png')}
                                    style={{
                                        resizeMode: 'contain',
                                        height: 30,
                                        width: 30,
                                        position: 'relative',
                                        top: -2
                                    }} />
                                <Text style={{ fontSize: 20, color: '#000',backgroundColor:'transparent' }}>{this.state.isself ? '我的现金券' : btnname + '的里程数'}</Text>
                                <Text style={{ fontSize: 20, color: '#f89901',backgroundColor:'transparent' }}>{this.state.isself ? this.state.userInformation.coins : this.state.userInformation.mileage}</Text>
                            </View>
                            {this.state.isself ?
                                <TouchableOpacity activeOpacity={.8}
                                    onPress={() => { this.goRecharge() }}>
                                    <Image source={require('../img/myself/pay.png')}
                                        style={{
                                            resizeMode: "contain", width: Width * .3, justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                        <Text style={{ fontSize: 18, color: '#fff', position: 'relative', top: -2, backgroundColor: 'transparent' }}>充值</Text>
                                    </Image>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                        <View style={{ alignItems: 'center', backgroundColor: '#ddd' }}>
                            <View style={{
                                flexDirection: 'row', padding: 3,
                                flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center'
                            }}>
                                {this.state.isself ?
                                    this._BtnFunc(BtnImage['lcs'], this.state.userInformation ? this.state.userInformation.mileage : '0', '我的里程数', this.goReward.bind(this))
                                    : null
                                }
                                {this.state.isself ?
                                    this._BtnFunc(BtnImage['gmcp'], this.state.userInformation ? this.state.userInformation.ordersnum : '0', '我购买的产品', this.goProduct.bind(this))
                                    : null
                                }
                                {this.state.isself ?
                                    this._BtnFunc(BtnImage['scj'], this.state.userInformation ? this.state.userInformation.collectnotes : '0', '收藏夹', this.goCollection.bind(this))
                                    : null
                                }
                                {this._BtnFunc(BtnImage['skgw'], this.state.userInformation ? this.state.userInformation.views : '0', '谁看过' + btnname, this.goWhoLookMe.bind(this))}
                                {this._BtnFunc(BtnImage['guanzhu'], this.state.userInformation ? this.state.userInformation.followed : '0', btnname + '的关注', this.goAttention.bind(this, 0))}
                                {this._BtnFunc(BtnImage['fensi'], this.state.userInformation ? this.state.userInformation.befollowed : '0', btnname + '的粉丝', this.goAttention.bind(this, 1))}
                                {this._BtnFunc(BtnImage['yinxiang'], this.state.userInformation ? this.state.userInformation.impressionsnum : '0', '对' + btnname + '的印象', this.goimpression.bind(this))}
                                {this._BtnFunc(BtnImage['wdyj'], this.state.userInformation ? this.state.userInformation.travelnotes : '0', btnname + '的游记', this.goNewYouJi.bind(this))}
                            </View>
                        </View>
                    </View>
                )
            } else {
                return (<View>
                    <SelectList tap={this.showModel.bind(this)}
                        number={'' + this.state.favorite}
                        title={'头像'}
                        /*{Image={require('../img/myself/scj.png')}}*/
                        Headimg={{ uri: headImage }}
                        rightImage={require('../img/myself/selectForward.png')} />
                    <SelectList tap={() => {  }}
                        number={this.state.userInformation.nickname}
                        title={'昵称'}
                        rightImage={require('../img/myself/selectForward.png')} />
                    <SelectList tap={() => {  }}
                        number={this.state.userInformation.sex}
                        title={'性别'}
                        rightImage={require('../img/myself/selectForward.png')} />
                    <SelectList tap={() => {  }}
                        number={'' + this.state.userInformation.signature}
                        title={'个性签名'}
                        rightImage={require('../img/myself/selectForward.png')} />
                </View>)
            }
        }
    }
    goRecharge() {
        if (!this.state.editMode) {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'recharge',
                    component: recharge,
                })
            }
        }
    }
    goChooseUserinfoBg() {
        if (this.state.editMode) {
            const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name: 'choosebg',
                    component: choosebg,
                    params: {
                        choosebg: true,
                        activity: false
                    }
                })
            }
        }
    }
    _boolshowinfo(key) {
        let b = false;
        let unlock = this.state.userInformation.unlockinfogroup
        if (unlock) {
            for (let uninfo of unlock) {
                if (key == uninfo.infogroupid) {
                    b = true
                    // return b
                }
            }
        }
        this.state.bpayinfo.push(b)
        return b
    }
    _SetInfoMation() {
        let infos = [];
        if (this.state.personalinfo) {
            let configInfo = this.state.personalinfo;
            let userInfo = this.state.userInformation.PersonalInfo;
            console.log(userInfo);
            for (let groupKey in configInfo) {
                let count = 0;
                let group = configInfo[groupKey];
                let infostemp = [];
                if (this.state.isself) {  //是自己的信息
                    if (groupKey == 1) {
                        if (!this.state.editMode) {
                            // console.log(groupKey)
                            let nowdate = this.state.nowdate;
                            let Pickerdate = new Date(-this.state.Pickerdate.getTime() / 1000);
                            console.log('个人中心崩坏点')
                            console.log(this.state.nowdate)
                            console.log(Pickerdate)
                            //修改点
                            let age = parseInt(nowdate.getFullYear()) - parseInt(Pickerdate.getFullYear())
                            //let age = parseInt(this.state.nowdate.toLocaleDateString().substring(0, 4)) - parseInt(this.state.Pickerdate.toLocaleDateString().substring(0, 4))
                            infostemp.push(<MyselfInformation
                                key={infos.length + infostemp.length + 1}
                                Title={'年龄'} Data={age.toString()} BgColor={'rgba(230,230,255,1)'} />)
                            count++;
                        } else {
                            infostemp.push(<TouchableHighlight key={infos.length + infostemp.length} underlayColor={'rgba(0,0,0,.5)'}
                                key={infos.length + infostemp.length + 1}
                                onPress={() => { this._showdatepicker.bind(this)() }}>
                                <View style={[styles.List, { backgroundColor: 'rgba(230,230,255,1)' }]}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ width: Width * .5,backgroundColor:'transparent' }}>{'出生时间'}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ width: 120, textAlign: 'center',backgroundColor:'transparent' }}>{this.state.Pickerdate.toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            )
                            count++;
                        }
                    }
                    for (let userItemKey in group.Items) {
                        let envItem = group.Items[userItemKey];
                        let data = "";
                        //let configItem = configInfo[Math.floor(Number(userItemKey)/100).toString()].Items[userItemKey]
                        if (userInfo[envItem.Id]) {
                            data = envItem.Options[userInfo[envItem.Id].selectedidx];
                            count++;
                        }
                        if (!this.state.editMode) {
                            infostemp.push(<MyselfInformation
                                key={infos.length + infostemp.length + 1}
                                Title={envItem.Name} Data={data} BgColor={'rgba(230,230,255,1)'} />)
                        } else {
                            infostemp.push(
                                <TouchableHighlight underlayColor={'rgba(0,0,0,.5)'}
                                    key={infos.length + infostemp.length + 1}
                                    onPress={() => { this.ShowPicker(envItem) }}>
                                    <View style={[styles.List, { backgroundColor: 'rgba(230,230,255,1)' }]}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ width: Width * .5,backgroundColor:'transparent' }}>{envItem.Name}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ width: 120, textAlign: 'center',backgroundColor:'transparent' }}>{data}</Text>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }
                    }
                } else {
                    this._boolshowinfo.bind(this)(groupKey)
                    let show = this.state.bpayinfo[groupKey - 1]
                    if (show) {
                        if (groupKey == 1) {
                            let age = parseInt(this.state.nowdate.toLocaleDateString().substring(0, 4))
                                - parseInt(this.state.Pickerdate.toLocaleDateString().substring(0, 4))
                            infostemp.push(<MyselfInformation Title={'年龄'}
                                key={infos.length + infostemp.length + 1}
                                Data={age.toString()}
                                BgColor={'rgba(230,230,255,1)'} />)
                            count++;
                        }

                        for (let userItemKey in group.Items) {
                            let envItem = group.Items[userItemKey];
                            let data = "";
                            if (userInfo[envItem.Id]) {
                                data = envItem.Options[userInfo[envItem.Id].selectedidx];
                                count++;
                            }
                            infostemp.push(<MyselfInformation
                                Title={envItem.Name} Data={data}
                                BgColor={'rgba(230,230,255,1)'} />)
                        }
                    } else {
                        //再走一次循环算完整度
                        if (groupKey == 1) {
                            count++;
                        }
                        for (let userItemKey in group.Items) {
                            let envItem = group.Items[userItemKey];
                            if (userInfo[envItem.Id]) {
                                count++;
                            }
                        }
                    }
                }
                let completeRate = (count / Object.keys(group.Items).length) * 100;
                completeRate = completeRate.toFixed(1)
                this.state.isself ?
                    infos.push(<MyselfInformation Title={group.Name}
                        key={infos.length}
                        Data={'完整度' + completeRate + '%'}
                        BgColor={'rgba(225,225,225,1)'} />)
                    : infos.push(
                        <TouchableHighlight underlayColor={'rgba(0,0,0,.5)'}
                            key={infos.length}
                            onPress={() => { this.showpayinfo(group) }}>
                            <View style={[styles.List, { backgroundColor: 'rgba(225,225,225,1)' }]}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ width: Width * .5,backgroundColor:'transparent' }}>{group.Name}</Text>
                                </View>
                                <View>
                                    <Text style={{ width: 120, textAlign: 'center',backgroundColor:'transparent' }}>{'完整度' + completeRate + '%'}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    );
                infos.push(...infostemp)
            }
        }
        return infos
    }
    getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }

    showpayinfo(group) {
        let balert = this.state.bpayinfo[group.Id - 1]
        if (!balert) {
            let unlock = this.state.userInformation.unlockinfogroup
            let obj = new Object()
            obj.infogroupid = 3
            Alert.alert(
                '确认购买',
                '购买成功后可查看他的' + '[' + group.Name + ']',
                [
                    { text: '取消', onPress: () => console.log('Foo Pressed!') },
                    {
                        text: '确认', onPress: () => {
                            this.payotherpeopleinfo.bind(this)(group.Id)
                        }
                    },
                ]
            )
        }
    }
    async payotherpeopleinfo(idx) {
        let userinfo = this.state.userInformation
        let params = 'sid=' + global.sessionID + '&userid=' + userinfo.userid
            + '&groups=' + idx
        try {
            let response = await fetch(global.httpURL + 'otherpeopleinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            })

            let responseJson = await response.json()
            if (responseJson.status == 1) {
                Alert.alert('','成功购买')
                this.state.unlockinfogroup = responseJson.data
                this.state.bpayinfo[idx - 1] = true
                this.setState({ bpayinfo: this.state.bpayinfo })
                // await CustomSync.setObjectForKey('userInformation', this.state.userInformation);
            }
        } catch (err) {
            console.log(err)
        }
    }
    ShowPicker(groupItems) {
        // console.log(groupItems);
        let picker = this.state.PickerShow
        this.setState({
            PickerShow: !picker,
            pickeritem: groupItems.Options,
            pickeridx: groupItems.Id
        })
    }
    _showdatepicker() {
        let picker = this.state.datepickshow
        this.setState({ datepickshow: !picker })

    }

    async putmyinfo(alterstr) {
        let userinfo = this.state.userInformation
        let params = 'sid=' + global.sessionID + '&nickname=' + userinfo.nickname
            + '&sex=' + userinfo.sex + '&info=' + alterstr + '&birthyear'
            + this.state.birthyear + '&birthmonth' + this.state.birthmonth
        try {
            let response = await fetch(global.httpURL + 'personalinfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },

                body: params
            })

            let responseJson = await response.json()

            if (responseJson.status == 1) {
                Alert.alert('','修改完成')
                let date = this.state.Pickerdate.toDateString();
                date = new Date(Date.parse(date.replace(/-/g, "/")));
                date = date.getTime();
                this.state.userInformation.birthdate = date / 1000
                await CustomSync.setObjectForKey('userInformation', this.state.userInformation);
            }
        } catch (err) {
            console.log(err)
        }
    }
    CreatePicker() {
        let infos = [];
        for (let item of this.state.pickeritem) {
            infos.push(item);
        }
        return infos.map((item, index) => this.CreatePickerItem(item, index));
    }

    CreatePickerItem(item, index) {
        return (<Picker.Item key={index} label={item.toString()} value={index.toString()} />)
    }

    goProduct() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'product',
                component: product,
            })
        }
    }

    goReward() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'reward',
                component: reward,
            })
        }
    }
    goimpression() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'impression',
                component: impression,
                params: {
                    userid: this.state.userInformation.userid
                }
            })
        }
    }
    goNewYouJi() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'newyouji',
                component: NewYouJi,
                params: {
                    showback: true,
                    userid: this.state.userInformation.userid
                }
            })
        }
    }
    goWhoLookMe() {
        console.log("别人的userid", this.state.userInformation.userid)
        // console.log("自己的userid",this.props.selfUserId)
        let userInformation = global.userInformation
        const {navigator} = this.props;
        let b = userInformation.userid == this.state.userInformation.userid ? true : false
        console.log("黑名单show？", b)
        if (navigator) {
            navigator.push({
                name: 'attention',
                component: Attention,
                params: {
                    userId: this.state.userInformation.userid,
                    showblack: b,
                    guanzhu: false,
                    guanzhuback: true
                }
            })
        }
    }
    goAttention(idx) {
        console.log("别人的userid", this.state.userInformation.userid)
        console.log("自己的userid", this.props.selfUserId)
        const {navigator} = this.props;
        let b = this.props.selfUserId == this.state.userInformation.userid ? true : false
        console.log("黑名单show？", b)
        if (navigator) {
            navigator.push({
                name: 'attention',
                component: Attention,
                params: {
                    userId: this.state.userInformation.userid,
                    showblack: b,
                    guanzhu: true,
                    guanzhuback: true,
                    listidx: idx
                }
            })
        }
    }

    goCollection() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'youquan',
                component: Youquan,
                params: {
                    userId: this.state.userInformation.userid,
                    youquan: false
                }
            })
        }
    }

    GoEdit(enabled) {

        if (enabled) {
            this._Handlealterinfo.bind(this)()
            this.setState({ editMode: !enabled })
        }
        else {
            this.setState({ editMode: !enabled })
        }

    }

    _showPickerModal() {
        let picker = this.state.PickerShow
        this.setState({
            PickerShow: !picker
        })
    }

    _setchooseinfo(value) {
        let userInfo = this.state.userInformation.PersonalInfo;
        if (userInfo[this.state.pickeridx]) {
            userInfo[this.state.pickeridx].selectedidx = value
        }
        else {
            let newinfo = new Object()
            newinfo.selectedidx = value
            userInfo[this.state.pickeridx] = newinfo
        }
        let idx = this.state.pickeridx
        alterinfo[idx] = value
        this.state.selectedValue = value
        this.setState({
            // PickerShow: !this.state.PickerShow,
            userInformation: this.state.userInformation
        })
    }

    _Handlealterinfo() {
        let str = ''
        let userInfo = this.state.userInformation.PersonalInfo;
        for (let alter in alterinfo) {
            str += (alter.toString() + '|' + userInfo[alter].selectedidx.toString() + ',')
        }
        str = str.substr(str, str.length - 1)
        alterstr = str
        this.putmyinfo.bind(this)(alterstr)
    }

    showDatePicker(date) {
        let arr = date.toLocaleDateString().split('/');
        this.setState({ Pickerdate: date, birthyear: arr[0], birthmonth: arr[1] });
    }

    backView() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _goChat() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ChatView',
                component: ChatView,
                params: {
                    targetUserId: this.state.userInformation.userid,
                    targetUserName: this.state.userInformation.nickname,
                    sex: this.state.userInformation.sex
                }
            })
        }
    }

    //控制modal按钮
    showModel = () => {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }
    //显示modal
    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
            showImage: this.state.ImageIndex,
            fileImage: null
        });
    }
    _CancelModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }
    setEnable(name) {
        this.state.userName ?
            this.setState({ fetchData: false }) :
            this.setState({ fetchData: true })
    }
    //显示选择相册modal
    _showCameraModal() {
        let isShow = this.state.show;
        let isShow1 = this.state.show1;
        this.setState({
            show: !isShow,
            show1: !isShow1
        })
    }
    //调用相册与摄像头
    getCamera() {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
            }
            else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                //console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either data...
                const source = { uri: response.uri, isStatic: false };

                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    const source = { uri: response.uri.replace('file://', ''), isStatic: false };
                } else {
                    const source = { uri: response.uri, isStatic: false };
                }

                const { navigator } = this.props;
                this.setState({
                    show1: false
                });
                if (navigator) {
                    navigator.push({
                        name: 'GetHead',
                        component: GetHead,
                        //参数传递
                        params: {
                            //要传递的参数
                            userImage: source,
                            popImage: (responseImage) => {
                                this.setState({
                                    fileImage: responseImage
                                })
                            }
                        }
                    })
                }
            }
        });
    }
    getGallery() {
        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                //console.log('User cancelled image picker');
            }
            else if (response.error) {
                //console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                //console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either data...
                const source = { uri: response.uri, isStatic: true };
                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    const source = { uri: response.uri.replace('file://', ''), isStatic: true };
                } else {
                    const source = { uri: response.uri, isStatic: true };
                }

                const { navigator } = this.props;
                this.setState({
                    show1: false
                });

                if (navigator) {
                    navigator.push({
                        name: 'GetHead',
                        component: GetHead,
                        //参数传递
                        params: {
                            //要传递的参数
                            userImage: source,
                            popImage: (responseImage) => {
                                this.setState({
                                    fileImage: responseImage
                                })
                            }
                        }
                    })
                }
            }
        });
    }

    render() {
        let datetime = this.state.datepickshow ?
            <View style={[styles.containerdatetime, { height: 300 }]}>
                {Platform.OS === 'ios' ?
                    <DatePickerIOS
                        date={this.state.Pickerdate}
                        mode="date"
                        maximumDate={new Date(parseInt(this.state.nowdate.toLocaleDateString().substring(0, 4) - 1), 11, 31)}
                        minimumDate={new Date(1900, 0, 1)}
                        onDateChange={this.showDatePicker.bind(this)}
                    /> : null}
                <Button text='完成'
                    color='#fff'
                    backgroundColor='#1596fe'
                    width={Width}
                    height={45}
                    click={this._showdatepicker.bind(this)} />
            </View>
            :
            <View />
        return (
            <View style={styles.container}>
                <NavBar title={'个人中心'}
                    rightItemvisible={(this.state.userInformation && this.state.isself) ? true : false}
                    rightItemTitle={!this.state.editMode ? '编辑资料' : '保存'}
                    rightTextColor={'#fff'}
                    rightItemFunc={() => { this.GoEdit(this.state.editMode) }}
                    leftImageSource={Back}
                    leftItemFunc={this.backView.bind(this)}
                    leftitemvisible={this.props.mainPush ? false : true}
                    leftImageHeight={22}
                />
                {datetime}
                <ScrollView style={styles.scroll}>
                    {/*别人的个人中心按钮*/}
                    {
                        this.state.userInformation &&
                            global.userInformation.userid !== this.state.userInformation.userid ?
                            <View style={{
                                backgroundColor: 'rgba(0,0,0,.4)', position: 'absolute',
                                top: 0, left: 0, borderRadius: 5, zIndex: 999,
                                flexDirection: "row"
                            }}>
                                <TouchableOpacity activeOpacity={.7}
                                    onPress={() => { }}>
                                    <Image source={require('../img/myself/noAttention.png')}
                                        style={styles.scrollViewTopBtn} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={.7} onPress={this._goChat.bind(this)}>
                                    <Image source={require('../img/myself/u3097.png')}
                                        style={styles.scrollViewTopBtn} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={.7}
                                    style={{
                                        backgroundColor: '#fff', borderRadius: Width * .05,
                                        width: Width * .1, height: Width * .1,
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                    onPress={() => { }}>
                                    <Image source={require('../img/myself/u3086.png')}
                                        style={styles.scrollViewTopBtn} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={.7}
                                    onPress={() => { }}>
                                    <Image source={require('../img/myself/u3095.png')}
                                        style={[styles.scrollViewTopBtn,
                                        { width: Width * .08, height: Width * .08 }]} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View />
                    }
                    {/*头像背景*/}
                    <TouchableOpacity activeOpacity={.95}
                        onPress={() => { this.goChooseUserinfoBg() }}>
                        <Image source={require('../img/myself/11-2.jpg')}
                            resizeMode={'cover'}
                            style={{ width: Width, height: Height * .27 }} >
                            <BlurView blurType="light" blurAmount={5} style={{ width: Width, height: Height * .27 }}/>
                        </Image>
                    </TouchableOpacity>
                    <View style={{ position: 'relative', top: -Width * .05 }}>
                        {this._Settxinfo.bind(this)()}
                        <View style={styles.line} />
                        {/*点击项*/}
                        {this._SeteditMode()}
                        {/*下拉菜单(VIP功能实现)*/}
                        {/*基本信息*/}
                        {this._SetInfoMation()}
                    </View>
                </ScrollView>
                <Modal animationType='fade'
                    transparent={true}
                    visible={this.state.PickerShow}
                    onRequestClose={this._showPickerModal.bind(this)}>
                    <TouchableOpacity
                        onPress={() => { this.setState({ PickerShow: !this.state.PickerShow }) }}
                        activeOpacity={1}
                        style={[styles.container, { backgroundColor: 'rgba(0,0,0,.3)' }]}>
                        <Picker
                            style={styles.picker}
                            //显示选择内容
                            selectedValue={this.state.selectedValue}
                            //选择内容时调用此方法
                            onValueChange={(value) => this._setchooseinfo.bind(this)(value)} >
                            {this.CreatePicker()}
                        </Picker>
                    </TouchableOpacity>
                </Modal>
                {/*modal*/}
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => { }}
                    onRequestClose={this._setModalVisible.bind(this)}>
                    <View style={[styles.modalStyle, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <View>
                            {/*主体*/}
                            <View style={styles.subView}>
                                {/*轮播图*/}
                                <Swiper loop={false} height={Height * 0.3} width={Width * 0.8}
                                    onMomentumScrollEnd={
                                        (e, state, context) => { this.setState({ ImageIndex: state.index }) }
                                    }
                                    index={this.state.ImageIndex}>
                                    {
                                        ImageList.map(function (index, i) {
                                            return <View style={styles.swiperView} key={i}>
                                                <Image source={index} style={styles.swiperViewImage} />
                                            </View>
                                        })
                                    }
                                </Swiper>
                                <View style={styles.horizontalLine} />
                                <View style={styles.buttonView}>
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={this._CancelModalVisible.bind(this)}>
                                        <Text style={styles.buttonText}>
                                            取消
                           </Text>
                                    </TouchableOpacity>
                                    <View style={styles.verticalLine} />
                                    <TouchableOpacity
                                        style={styles.buttonStyle}
                                        onPress={this._setModalVisible.bind(this)}>
                                        <Text style={styles.buttonText}>
                                            确定
                           </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/*点击自选*/}
                            <View style={styles.cameraLintView}>
                                <Image source={require('../img/cameraLint.png')} style={styles.cameraLint} />
                                <TouchableHighlight style={styles.cameraBtn}
                                    onPress={this._showCameraModal.bind(this)}
                                    underlayColor={'rgba(255,255,255,0.4)'}>
                                    <Text></Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/*选择相册*/}
                <Modal animationType='fade'
                    transparent={true}
                    visible={this.state.show1}
                    onShow={() => { }}
                    onRequestClose={this._showCameraModal.bind(this)}>
                    <View style={styles.chooseCameraModal}>
                        <View style={styles.chooseCameraView}>
                            <View style={styles.chooseCameraChoice}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this.getCamera.bind(this)}>
                                    <Text style={[styles.chooseCameraText, { color: '#e4393c' }]}>拍照</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this.getGallery.bind(this)}>
                                    <Text style={styles.chooseCameraText}>从手机相册选择</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.chooseCameraCancel}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this._showCameraModal.bind(this)}>
                                    <Text style={[styles.chooseCameraText, { borderTopWidth: 0, fontWeight: 'bold' }]}>取消</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    List: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 50,
        paddingRight: 36,
        paddingTop: 3,
        paddingBottom: 3,
        marginBottom: 3,
    },
    line: {
        width: Width,
        height: 3,
        backgroundColor: '#ddd'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    containerdatetime: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 20,
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
    },
    //头像背景view
    ImageView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ImageHead: {
        width: Width * .2,
        height: Width * .2,
        borderRadius: Width * .1,
    },
    ImageText: {
        color: '#000',
        fontSize: 17,
        backgroundColor: 'transparent',
        paddingLeft: 5,
        paddingRight: 5,
    },
    ImageAttention: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Width * 0.4
    },
    ImageAttentionIos: {
        width: Width * 0.5
    },

    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor:'transparent'
    },
    //选项框
    picker: {
        backgroundColor: '#fff'
    },

    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: Width,
        height: Height
    },
    // modal上子View的样式
    subView: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
        paddingTop: Height * 0.03
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 0,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 竖直的分割线
    verticalLine: {
        width: 0.5,
        height: 44,
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        textAlign: 'center',
    },
    swiperView: {
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        bottom: -20,
        zIndex: 10
    },
    swiperViewImage: {
        borderRadius: Height * 0.1,
        resizeMode: 'contain',
        height: Height * 0.2
    },
    //自选提示
    camera: {
        height: Height * 0.055,
        resizeMode: 'contain'
    },
    cameraBtn: {
        position: 'absolute',
        right: Width * 0.07,
        bottom: 1,
        width: Width * 0.12,
        height: Height * 0.05
    },
    cameraLintView: {
        position: 'absolute',
        top: -Height * 0.115,
        right: -Width * 0.05
    },
    cameraLint: {
        resizeMode: 'contain',
        height: Height * 0.18
    },
    //选择图片modal
    chooseCameraModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    chooseCameraView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: Height * 0.02
    },
    chooseCameraChoice: {
        width: Width * 0.9,
        height: Height * 0.25,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Height * 0.05,
        paddingBottom: Height * 0.05,
    },
    chooseCameraCancel: {
        width: Width * 0.9,
        height: Height * 0.1,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: Height * 0.02,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chooseCameraBtn: {
        width: Width,
        height: Height * 0.1,
        borderTopWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
    },
    chooseCameraText: {
        textAlign: 'center',
        fontSize: 24,
        color: '#1596fe',
        textAlignVertical: 'center',
        backgroundColor:'transparent'
    },
    scrollViewTopBtn: {
        resizeMode: 'contain',
        width: Width * .07,
        height: Width * .07,
        margin: 5
    }
})