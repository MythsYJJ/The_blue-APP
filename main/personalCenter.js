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
    Alert
} from 'react-native';
import NavBar from '../component/navbar';
import CacheImage from '../component/cacheImage';
import MyselfInformation from '../component/myself_information';
import CustomSync from '../sync';
import FileUtil from '../Utils/fileUtil';
import Button from '../component/button';
import Attention from './attention';
import Youquan from './youquan';
import Recharge from './recharge';
import NewYouJi from './newYouji';
import reward from '../RewardLog/Reward';
import product from '../ProductView/Product';
import impression from '../Impression/Impression';
import ChatView from '../chat/ChatView';
import choosebg from '../Chooseuserinfobg/ChooseUserinfoBg';
import PersonalSetting from './personalSetting';
import HeadSetting from './headSetting';
import DefaultHeadImage from '../component/defaultHeadImage';
import CleanPage from './cleanPage';
import OtherConfig from './otherConfig';
import Register from '../login/register';
import ParallaxView from 'react-native-parallax-view'
//日期选择组件
import DatePicker from 'react-native-datepicker'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

const Back = require('../img/back.png');
const Setting = require('../img/myself/setting.png');
const Forward = require('../img/forward.png');
const hambar = require('../img/hambar.png');

const btnImages = [
    { name: 'globe', color: 'rgba(20,150,255,1)' },
    { name: 'shopping-cart', color: 'rgba(20,150,255,1)' },
    { name: 'folder', color: 'rgba(20,150,255,1)' },
    { name: 'light-bulb', color: 'rgba(20,150,255,1)' },
    { name: 'eye', color: 'rgba(20,150,255,1)' },
    { name: 'slideshare', color: 'rgba(20,150,255,1)' },
    { name: 'pin', color: 'rgba(20,150,255,1)' },
    { name: 'book', color: 'rgba(20,150,255,1)' },
    { name: 'info-with-circle', color: 'rgba(20,150,255,1)' },
    { name: 'feather', color: 'rgba(20,150,255,1)' },
    { name: 'feather', color: 'rgba(255,90,170,1)' },
    { name: 'heart', color: 'rgba(20,150,255,1)' },
    { name: 'new-message', color: 'rgba(20,150,255,1)' }
]

var ImageList = [];
var avatarList = [];

export default class PersonalCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelf: false,
            needUpdate: false,
            userInformation: null,
            unlockMap: {},
            showImage: 0,
            show: false,
            fileImage: null,
            pecArray: []
        }
        this._changed = false;
        this._waitChangehandle = -1;

        this._goBack = this._goBack.bind(this);
        this._loadData = this._loadData.bind(this);
        this._renderCash = this._renderCash.bind(this);
        this._goRecharge = this._goRecharge.bind(this);
        this._renderSlot = this._renderSlot.bind(this);
        this._unlockInfo = this._unlockInfo.bind(this);
        this._uploadInfo = this._uploadInfo.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._calcComplete = this._calcComplete.bind(this);
        this._renderImageBtn = this._renderImageBtn.bind(this);
        this._onChangeFinish = this._onChangeFinish.bind(this);
        this._onSettingFinish = this._onSettingFinish.bind(this);
        this._getRelationShip = this._getRelationShip.bind(this);
        this._selectHeadImage = this._selectHeadImage.bind(this);
        this._goChooseBackground = this._goChooseBackground.bind(this);
        this._changeRelationShip = this._changeRelationShip.bind(this);
    }

    async _loadData() {
        try {
            let userInformation = global.userInformation
            let sessionID = global.sessionID
            let userId = this.props.userId;
            if (!userId) {
                userId = userInformation.userid;
            }
            let isSelf = userId == userInformation.userid;
            if (userId !== userInformation.userid) {
                let responseJson = await CustomSync.fetch(this, global.httpURL + 'profile/' + this.props.userId + '?sid=' + sessionID);
                userInformation = responseJson.data;
                console.log('other user information', userInformation);
            }

            let unlockMap = {};
            let unlockArray = userInformation.unlockinfogroup;
            if (unlockArray) {
                for (let obj of unlockArray) {
                    unlockMap[obj.infogroupid] = true;
                }
            }

            let pecArray = [];
            let allPec = 0;
            for (let i = 1; i < 5; i++) {
                let pec = this._calcComplete(i, userInformation);
                console.log(pec, i);
                pecArray[i] = pec;
                allPec += pec;
            }
            allPec = Math.round(allPec / 4);
            pecArray[0] = allPec;

            this.setState({
                isSelf: isSelf,
                userInformation: userInformation,
                unlockMap: unlockMap,
                pecArray: pecArray
            });
        } catch (err) {
            console.log(err);
        }
    }

    componentWillMount() {
        CustomSync.visitor(this);
        if (ImageList.length <= 0) {
            let avatarHead = global.common.avatarsegment;
            for (var key in avatarHead) {
                for (let i = 0; i < avatarHead[key].num; i++) {
                    ImageList.push(global.common.fileurl.imgavatar + (avatarHead[key].start + 1 + i))
                    avatarList.push(avatarHead[key].start + 1 + i)
                }
            }
        }
        console.log('头像列表', ImageList)
        this._loadData();
    }

    componentWillUnmount() {
        if (this._changed) {
            console.log('页面将要卸载')
            // this._uploadInfo();
        }
    }

    _goBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    //前往设置页面
    _goConfig() {
        let targetUserInfo = this.state.userInformation;
        if (!targetUserInfo) {
            return;
        }
        const { navigator } = this.props;
        if (navigator) {
            let componentName = this.state.isSelf ? 'CleanPage' : 'OtherConfig';
            let componentClass = this.state.isSelf ? CleanPage : OtherConfig;
            if (this.state.isSelf) {
            }
            navigator.push({
                name: componentName,
                component: componentClass,
                params: {
                    userInfo: targetUserInfo,
                    remark: global.userdefined.get(targetUserInfo.userid),
                    changeUserInfo: this._onChangeFinish
                }
            })
        }
    }

    async _uploadInfo() {
        if (this._waitChangehandle) {
            clearTimeout(this._waitChangehandle);
        }

        try {
            console.log('_uploadInfo');
            let userInfo = this.state.userInformation;
            let fileImage = this.state.fileImage;
            console.log('uploadinfo', fileImage);
            let formData = new FormData();
            let sid = global.sessionID;
            formData.append('sid', sid);
            let { nickname, sex, avatar, birthdate, signature } = userInfo;
            formData.append('nickname', nickname);
            formData.append('sex', sex);
            formData.append('birthdate', birthdate);
            formData.append('signature', signature);
            if (fileImage) {
                // let fileSource = await FileUtil.readImage(fileImage.uri.uri);
                // console.log('fileSource = '+atob(fileSource));
                formData.append('files', {
                    uri: fileImage.uri.uri,
                    type: 'multipart/form-data',
                    name: fileImage.fileImageName
                })
                formData.append('remove', 0);
            } else {
                formData.append('avatarid', avatar);
            }
            console.log(formData)
            let info = '';
            for (let key of Object.keys(userInfo.PersonalInfo)) {
                let { itemid, selectedidx } = userInfo.PersonalInfo[key];
                info += `${itemid}|${selectedidx},`;
            }
            info = info.substr(0, info.length - 1);
            formData.append('info', info);
            let params = `sid=${global.sessionID}&nickname=${nickname}&sex=${sex}&birthdate=${birthdate}&signature=${signature}&avatarid=${avatar}&info=${info}`;
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'profile', 'POST',
                fileImage ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/x-www-form-urlencoded' },
                fileImage ? formData : params);
            console.log(responseJson)
            this._changed = false;
            if (responseJson.status == 1) {
                global.userInformation = userInfo;
                console.log(this.state.userInformation);
                this.setState({ fileImage: null });
            } else {
                //TODO 还原还是继续发送?目前选择还原
                this.setState({ userInformation: global.userInformation });
            }
        } catch (err) {
            console.log(err);
        }
    }

    _goChooseBackground() {
        console.log('_goChooseBackground');
        if (this.state.isSelf) {
            console.log('click choose background image');

            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    name: 'HeadSetting',
                    component: HeadSetting,
                    params: {
                        navigator: this.props.navigator,
                        userInformation: this.state.userInformation,
                        onSettingFinish: this._onSettingFinish,
                    }
                })
            }
        }
    }

    _goRecharge() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'Recharge',
                component: Recharge
            })
        }
    }

    _renderImageBtn(img, main, title, func, unlockIndex = -1) {
        let unlocked = true;
        if (unlockIndex >= 0) {
            unlocked = this.state.unlockMap[unlockIndex];
        }
        return (
            <TouchableHighlight style={{ width: Width * .3, height: Width * .3, marginLeft: 5, marginRight: 5 }} 
                underlayColor={'rgba(0,0,0,.3)'}
                onPress={func}
                >
                <View style={{
                    width: Width * .3, height: Width * .3, alignItems: 'center', backgroundColor: '#fff', flexDirection: 'column'
                }}>
                    <View style={{ width: Width * .17, height: Width * .17, alignSelf:'center', justifyContent:'center' }}>
                        { unlocked ? 
                            <Entypo name={img.name} size={40} color={img.color} style={{alignSelf:'center'}}/> 
                            : 
                            <Ionicons name='md-lock' size={40} color='rgba(20,150,255,1)' style={{alignSelf:'center'}}/>
                        }
                    </View>
                    <Text style={{ color: '#f89901', fontSize: 15, fontWeight: 'bold', backgroundColor: "transparent" }}>{main}</Text>
                    <Text style={{ color: '#222', fontSize: 12, fontWeight: 'bold', marginTop: 5, backgroundColor: "transparent" }}>{title}</Text>
                </View>
            </TouchableHighlight >
        )
    }

    _goProduct() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'product',
                component: product,
            })
        }
    }

    _goReward() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'reward',
                component: reward,
            })
        }
    }
    _goImpression() {
        let targetUserInfo = this.state.userInformation;
        if (!targetUserInfo) {
            return;
        }
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'impression',
                component: impression,
                params: {
                    userid: this.state.userInformation.userid,
                    userInfo: targetUserInfo,
                    onChangeFinish: this._onChangeFinish,
                }
            })
        }
    }
    _goNewYouJi() {
        const { navigator } = this.props;
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
    _goWhoLookMe() {
        console.log("别人的userid", this.state.userInformation.userid)
        // console.log("自己的userid",this.props.selfUserId)
        let userInformation = global.userInformation
        const { navigator } = this.props;
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
                    guanzhuback: true,
                    sex: this.state.userInformation.sex
                }
            })
        }
    }
    _goAttention(idx) {
        console.log("别人的userid", this.state.userInformation.userid)
        console.log("自己的userid", this.props.selfUserId)
        const { navigator } = this.props;
        // let b = this.props.selfUserId == this.state.userInformation.userid ? true : false
        // console.log("黑名单show？", b)
        if (navigator) {
            navigator.push({
                name: 'attention',
                component: Attention,
                params: {
                    userId: this.state.userInformation.userid,
                    showblack: this.state.isSelf,
                    guanzhu: true,
                    guanzhuback: true,
                    listidx: idx,
                    sex: this.state.userInformation.sex
                }
            })
        }
    }

    _goCollection() {
        const { navigator } = this.props;
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

    _goSuibiList() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'youquan',
                component: Youquan,
                params: {
                    userId: this.state.userInformation.userid,
                    suibi: true,
                    viewtye: 2
                }
            })
        }
    }

    _calcComplete(index, userInformation = null) {
        let infoData = global.personalinfo.group[index];
        let targetPersonalInfo = userInformation ? userInformation.PersonalInfo : this.state.userInformation.PersonalInfo;
        if (!targetPersonalInfo) {
            return 0;
        }
        let maxCount = Object.keys(infoData.items).length;
        let count = 0;
        for (let key of Object.keys(infoData.items)) {
            let selfChoose = targetPersonalInfo[key];
            if (selfChoose) {
                count++;
            }
        }
        return Math.round(count / maxCount * 100);
    }

    async _unlockInfo(index) {
        try {
            let params = 'sid=' + global.sessionID + '&userid=' + this.props.userId + '&groups=' + index;
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'otherpeopleinfo',
                'POST',
                { 'Content-Type': 'application/x-www-form-urlencoded' },
                params)
            if (responseJson.status == 1) {
                let unlockMap = this.state.unlockMap;
                responseJson.data.map(item => {
                    let unlockIndex = item.infogroupid;
                    unlockMap[unlockIndex] = true;
                })
                this.setState({ unlockMap: unlockMap });
            }
        } catch (err) {
            console.log(err);
        }
    }

    _goSetting(index) {
        let infoData = global.personalinfo.group[index];
        let targetUserInfo = this.state.userInformation;
        if (!targetUserInfo) {
            return;
        }
        if (!this.state.isSelf) {
            let unlockMap = this.state.unlockMap;
            let unlock = unlockMap[index];
            if (!unlock) {
                Alert.alert(
                    '解锁' + infoData.name,
                    `支付${infoData.price}现金券可查看他的${infoData.name}`,
                    [
                        { text: '放弃', onPress: () => console.log('Foo Pressed!') },
                        {
                            text: '购买', onPress: () => {
                                this._unlockInfo(index);
                            }
                        },
                    ]
                )
                return;
            }
        }
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'PersonalSetting',
                component: PersonalSetting,
                params: {
                    navigator: this.props.navigator,
                    title: infoData.name,
                    infoData: infoData,
                    userInfo: targetUserInfo,
                    onSettingFinish: this._onSettingFinish,
                    isSelf: this.state.isSelf
                }
            })
        }
    }

    _goChat() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'ChatView',
                component: ChatView,
                params: {
                    targetUserId: this.state.userInformation.userid,
                    targetUserName: this.state.userInformation.nickname,
                    sex: this.state.userInformation.sex,
                    userinfo: this.state.userInformation
                }
            })
        }
    }

    _onChangeFinish(userInfo) {
        console.log('change,', userInfo)
        if (userInfo) {
            this.setState({ userInformation: userInfo });
        }
    }

    _onSettingFinish(userInfo) {
        if (userInfo) {
            let pecArray = [];
            let allPec = 0;
            for (let i = 1; i < 5; i++) {
                let pec = this._calcComplete(i, userInfo);
                console.log(pec, i);
                pecArray[i] = pec;
                allPec += pec;
            }
            allPec = Math.round(allPec / 4);
            pecArray[0] = allPec;

            this.setState({
                userInformation: userInfo,
                pecArray: pecArray
            });

            this._changed = true;
            this._startWaitChanged();
        }
    }

    _startWaitChanged() {
        if (this._waitChangehandle) {
            clearTimeout(this._waitChangehandle);
        }

        this._waitChangehandle = setTimeout(() => {
            if (this._changed) {
                console.log('开始waitchanged')
                this._uploadInfo();
            }
        }, 1000);
    }

    _getRelationShip() {
        let relationship = this.state.userInformation.relationship;
        console.log('关系数据：', relationship);
        switch (relationship) {
            case 0:
                return require('../img/youquan/noAttention.png')
            case 1:
                return require('../img/youquan/payAttention.png')
            case 256:
                return require('../img/youquan/payAttention.png')
            case 257:
                return require('../img/youquan/Attention257.png')
            default:
        }
    }

    async _changeRelationShip(data, rowid) {
        let userInfo = this.state.userInformation;
        let b = parseInt(userInfo.relationship);
        if (b == 0 || b == 1) {
            let responseJson = await CustomSync.fetch(this,
                global.httpURL + 'follow',
                'POST',
                { 'Content-Type': 'application/x-www-form-urlencoded' },
                `sid=${global.sessionID}&id=${userInfo.userid}`)
            if (responseJson) {
                userInfo.relationship = (b == 1) ? 257 : 256
            }
        } else {
            let responseJson = await CustomSync.fetch(this,
                global.httpURL +
                'follow/' +
                userInfo.userid +
                '?sid=' + global.sessionID,
                'DELETE');
            userInfo.relationship = (b == 257) ? 1 : 0;
        }
        this.setState({ userInformation: userInfo })
    }

    _renderHeader() {
        if (!this.state.userInformation) {
            return null;
        }
        if (this.state.fileImage) {
            console.log('renderheader', this.state.fileImage.uri);
        }
        let headImage = this.state.fileImage ?
            this.state.fileImage.uri
            :
            {
                uri: global.common.fileurl.imgavatar +
                this.state.userInformation.avatar + '?a=' + Math.random()
            };
        console.log('个人中心头像', this.state.userInformation);
        console.log(headImage);
        return (
            <View style={{
                top: Height * .04,
                width: Width, alignSelf: 'center', height: Height * .35,
                paddingLeft: Width * 0.025, paddingRight: Width * 0.025
            }}>
                <View style={styles.ImageView}>
                    <View style={{ width: Width * .3, flexDirection: 'row' }}>
                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                            onPress={() => { this._selectHeadImage() }}
                            style={styles.ImageHead}>
                            <Image source={headImage}
                                style={[styles.ImageHead, {
                                    borderWidth: 3,
                                    borderColor: '#fdd842'
                                }]} />
                            {/*<CacheImage source={headImage}
                                envUrl={global.common.fileurl.imgavatar}
                                url={this.state.userInformation.avatar}
                                style={[styles.ImageHead, { borderWidth: 3, borderColor: '#fdd842' }]}
                                resizeMode='cover' />*/}
                        </TouchableHighlight>
                        {this.state.userInformation.sex == 1 ?
                            <Image source={require('../img/myself/u112.png')}
                                style={{ resizeMode: 'contain', height: 18, marginLeft: -15, alignSelf: 'flex-end' }} />
                            :
                            <Image source={require('../img/myself/u109.png')}
                                style={{ resizeMode: 'contain', height: 18, marginLeft: -15, alignSelf: 'flex-end' }} />
                        }
                    </View>
                    <Text style={[styles.ImageText, { fontSize: 20 }]} numberOfLines={1}>
                        {CustomSync.getRemark(this.state.userInformation.userid, this.state.userInformation.nickname)}
                    </Text>
                        {this.state.userInformation.signature ?
                            <Text style={styles.ImageText} numberOfLines={2}>
                                    {this.state.userInformation.signature}
                            </Text>
                            :
                            <View/>}
                </View>

                {this.state.isSelf ?
                    null :
                    <View style={{ position: 'absolute', right: 5 }}>
                        <TouchableOpacity style={{ marginTop: 30 }} activeOpacity={.8}
                            onPress={() => { this._goChat() }}>
                            <Image source={require('../img/myself/attention.png')}
                                style={{
                                    resizeMode: "contain", width: Width * .22, justifyContent: 'center',
                                    alignItems: 'center', height: Height * .065
                                }}>
                                <Text style={{ fontSize: 15, color: '#fff', position: 'relative', top: -2, backgroundColor: 'transparent' }}>聊天</Text>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 30 }} activeOpacity={0.8}
                            onPress={() => { this._changeRelationShip() }}>
                            <Image source={this._getRelationShip()}
                                style={styles.btnImage} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }

    _selectHeadImage() {
        if (!this.state.isSelf) {
            return;
        }

        this.setState({ show: !this.state.show });
    }

    _renderCash() {
        if (!this.state.userInformation) {
            return null;
        }
        let who = this.state.isSelf ? '我' : (this.state.userInformation.sex == 1 ? '他' : '她');
        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', width: Width * .9, height: Height * .07, alignSelf: 'center'
            }}>
                <View style={{ flexDirection: 'row', width: Width * .5, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={this.state.isSelf ? require('../img/myself/djq.png') : btnImages[0]}
                            style={{
                                resizeMode: 'contain',
                                height: 30,
                                width: 30,
                                position: 'relative',
                                top: -2
                            }} />
                        <Text style={{ fontSize: 12, color: '#000', fontWeight: 'bold', backgroundColor: "transparent" }}>{this.state.isSelf ? '我的现金券' : `${who}的里程数`}</Text>
                    </View>
                    <Text style={{ fontSize: 20, color: '#f89901', backgroundColor: "transparent" }}>{this.state.isSelf ? this.state.userInformation.coins : `${this.state.userInformation.mileage}公里`}</Text>
                </View>
                {this.state.isSelf ?
                    <TouchableOpacity activeOpacity={.8}
                        onPress={() => { this._goRecharge() }}>
                        {/*<Image source={require('../img/myself/pay.png')}
                            style={{
                                resizeMode: "contain", width: Width * .2, justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Text style={{ fontSize: 15, color: '#fff', position: 'relative', top: -2, backgroundColor: 'transparent' }}>充值</Text>
                        </Image>*/}
                        <Text style={{fontSize:15,color:'#fff',backgroundColor:'#e4393c',width:Width*.2,paddingTop:3,paddingBottom:3,textAlign:'center',borderRadius:5}}>充 值</Text>
                    </TouchableOpacity>
                    : null
                }
            </View>
        )
    }

    _renderSlot() {
        if (!this.state.userInformation) {
            return null;
        }
        let who = this.state.isSelf ? '我' : (this.state.userInformation.sex == 1 ? '他' : '她');
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginTop: 15 }}>
                <Text style={{ fontSize: 15, color: '#000', fontWeight: 'bold', marginLeft: 20, marginBottom: 5, backgroundColor: "transparent" }}>{`${who}的足迹`}</Text>
                <View style={{ alignItems: 'center', backgroundColor: '#fff', marginTop: 5 }}>
                    <View style={{
                        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center'
                    }}>
                        {this.state.isSelf ?
                            this._renderImageBtn(btnImages[0], this.state.userInformation ? this.state.userInformation.mileage : '0', '我的里程数', this._goReward.bind(this))
                            : null
                        }
                        {this.state.isSelf ?
                            this._renderImageBtn(btnImages[1], this.state.userInformation ? this.state.userInformation.ordersnum : '0', '我的订单', this._goProduct.bind(this))
                            : null
                        }
                        {this.state.isSelf ?
                            this._renderImageBtn(btnImages[2], this.state.userInformation ? this.state.userInformation.collectnotes : '0', '收藏夹', this._goCollection.bind(this))
                            : null
                        }
                        {this._renderImageBtn(btnImages[3], this.state.userInformation ? this.state.userInformation.views : '0', '谁看过' + who, this._goWhoLookMe.bind(this))}
                        {this._renderImageBtn(btnImages[4], this.state.userInformation ? this.state.userInformation.followed : '0', who + '的关注', this._goAttention.bind(this, 0))}
                        {this._renderImageBtn(btnImages[5], this.state.userInformation ? this.state.userInformation.befollowed : '0', who + '的粉丝', this._goAttention.bind(this, 1))}
                        {this._renderImageBtn(btnImages[6], this.state.userInformation ? this.state.userInformation.impressionsnum : '0', '对' + who + '的印象', this._goImpression.bind(this))}
                        {this._renderImageBtn(btnImages[7], this.state.userInformation ? this.state.userInformation.travelnotes : '0', who + '的游记', this._goNewYouJi.bind(this))}
                        {this._renderImageBtn(btnImages[12], this.state.userInformation ? this.state.userInformation.essaysnum : '0', who + '的随笔', this._goSuibiList.bind(this))}
                    </View>
                </View>
            </View>
        )
    }

    _renderWorld() {
        if (!this.state.userInformation) {
            return null;
        }
        let who = this.state.isSelf ? '我' : (this.state.userInformation.sex == 1 ? '他' : '她');
        return (
            <View style={{ flex: 1, flexDirection: 'column', marginTop: 15 }}>
                <View style={{ width: Width, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontSize: 15, color: '#000', fontWeight: 'bold', marginLeft: 20, marginBottom: 5, backgroundColor: "transparent" }}>{`${who}的世界`}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ fontSize: 15, color: '#000', fontWeight: 'bold', marginBottom: 5, backgroundColor: "transparent" }}>{'全部信息完整度:'}</Text>
                        <Text style={{ fontSize: 20, color: '#4d93fe', fontWeight: 'bold', marginRight: 20, marginBottom: 5, backgroundColor: "transparent" }}>{`${this.state.pecArray[0] ? this.state.pecArray[0] : 0}%`}</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'center', backgroundColor: '#fff', marginTop: 5 }}>
                    <View style={{
                        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center'
                    }}>
                        {this._renderImageBtn(btnImages[8], this.state.pecArray[1] ? `${this.state.pecArray[1]}%` : '0%', '基础资料', this._goSetting.bind(this, 1), this.state.isSelf ? -1 : 1)}
                        {this._renderImageBtn(btnImages[9], this.state.pecArray[2] ? `${this.state.pecArray[2]}%` : '0%', '自我评价', this._goSetting.bind(this, 2), this.state.isSelf ? -1 : 2)}
                        {this._renderImageBtn(btnImages[10], this.state.pecArray[3] ? `${this.state.pecArray[3]}%` : '0%', '异性评价', this._goSetting.bind(this, 3), this.state.isSelf ? -1 : 3)}
                        {this._renderImageBtn(btnImages[11], this.state.pecArray[4] ? `${this.state.pecArray[4]}%` : '0%', '兴趣爱好', this._goSetting.bind(this, 4), this.state.isSelf ? -1 : 4)}
                    </View>
                </View>
            </View>
        )
    }
    render() {
        //TODO 背景图片调不到，需要问中华
        //let bgImage = this.state.userInformation ? {uri:global.common.fileurl.imgbgurl + this.state.userInformation.backgroundimage} : require('../img/myself/11-2.jpg');
        let bgImage = require('../img/myself/11-2.jpg');
        return (
            <View style={styles.container}>
                <NavBar title={'个人中心'}
                    leftImageSource={Back}
                    leftItemFunc={this._goBack}
                    leftitemvisible={this.props.mainPush ? false : true}
                    leftImageHeight={22}
                    rightImageSource={this.state.isSelf ? Setting : hambar}
                    rightItemFunc={this._goConfig.bind(this)}
                    rightImageHeight={this.state.isSelf ? 25 : 40}
                />
                {/*<ScrollView style={styles.scroll}>*/}
                <ParallaxView
                    backgroundSource={bgImage}
                    windowHeight={Height * .35}

                    header={(
                        <TouchableOpacity activeOpacity={.95}
                            onPress={() => { this._goChooseBackground() }}>
                            {this.state.isSelf ? <Image source={Forward} style={{ position: 'absolute', right: 5, top: Height * .14 }} /> : null}
                            {this._renderHeader()}
                        </TouchableOpacity>
                    )}
                >
                    {/*<TouchableOpacity activeOpacity={.95}
                        onPress={() => { this._goChooseBackground() }}>
                        <Image source={bgImage}
                            resizeMode={'cover'}
                            style={{ width: Width, height: Height * .35 }} >
                            {Platform.OS == 'ios' ? <BlurView blurType="light" blurAmount={5} style={{ width: Width, height: Height * .35 }} /> : null}
                            {this.state.isSelf ? <Image source={Forward} style={{ position: 'absolute', right: 5, top: Height * .17 }} /> : null}
                        </Image>
                    </TouchableOpacity>*/}
                    {/*头像区域*/}
                    {/*<View style={{ position: 'absolute', top: Height * .07 }}>
                        {this._renderHeader()}
                    </View>*/}
                    {/*用户的钱或里程*/}
                    <View style={{ position: 'relative', top: 0 }}>
                        {this._renderCash()}
                    </View>
                    <View style={styles.line} />
                    <View style={{ position: 'relative', top: 0 }}>
                        {this._renderSlot()}
                    </View>
                    <View style={styles.line} />
                    <View style={{ position: 'relative', top: 0 }}>
                        {this._renderWorld()}
                    </View>
                </ParallaxView>
                {/*modal*/}
                {/*changeImage:默认头像改变时调用*/}
                {/*choiceFileImage:选取本地图片时调用*/}
                {/*cancel:取消时调用*/}
                <DefaultHeadImage show={this.state.show}
                    navigator={this.props.navigator}
                    ImageList={ImageList}
                    changeImage={(index, show) => {
                        let userInfo = this.state.userInformation;
                        userInfo.avatar = avatarList[index];
                        this._changed = true;
                        this._startWaitChanged();
                        this.setState({
                            fileImage: null,
                            userInformation: userInfo,
                            show: show
                        })
                    }}
                    choiceFileImage={(data) => {
                        let userInfo = this.state.userInformation;
                        userInfo.avatar = userInfo.userid;
                        this._changed = true;
                        this._startWaitChanged();
                        this.setState({
                            fileImage: data,
                            userInformation: userInfo,
                        }, () => { console.log("set finish", this.state.fileImage) })
                    }}
                    cancel={(show) => {
                        this.setState({
                            show: show
                        })
                    }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
    },
    //头像背景view
    ImageView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ImageHead: {
        width: Width * .3,
        height: Width * .3,
        borderRadius: Width * .15,
    },
    line: {
        width: Width,
        height: 1,
        backgroundColor: '#999'
    },
    ImageText: {
        color: '#fff',
        fontSize: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 2,
        paddingBottom: 2,
        marginTop: 2
    },
    btnImage: {
        resizeMode: "contain",
        width: Width * 0.07,
        height: Height * 0.05
    },
})