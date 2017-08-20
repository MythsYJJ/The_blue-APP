import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    navigator,
    Platform,
    TouchableHighlight,
    Modal,
    BackAndroid,
    Animated
} from 'react-native';

//注册页
import Button from '../component/button';
import NavBar from '../component/navbar';
import { toastShort } from '../Toast/ToastUtil';
import Setting from './setting';
import CustomSync from '../sync';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Login from './login';
import Main from '../main/main';
import Loading from '../component/loading';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
var WeChat = require('react-native-wechat');

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
var wechat = require('../img/wechat.png');
var result;

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            pwd: '',
            pwdConfirm: '',
            isRegister: false,
            userIDVal: false,
            pwdVal: false,
            pwd1Val: false,
            dblCon: false,
            //用户服务器ID
            serverID: '',
            weixin: '点击查看微信',
            token: 'token',
            wechatUser: 'wechatUser',
            wechatImage: '',
            wechat: false
        }
        this._postMessToServer = this._postMessToServer.bind(this);
    }

    async loadData() {
        const { navigator } = this.props;
        try {
            if (navigator && global.sessionID) {
                console.log('快速跳转')
                navigator.resetTo({
                    name: 'Main',
                    component: Main,
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        //
        this._goMain();
        return true;
    };

    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        this.loadData();
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    _goMain() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name: 'Main',
                component: Main
            });
        }
    }

    //登录页面
    _goLogin() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name: 'Login',
                component: Login
            });
        }
    }
    //确认注册
    async getCreate() {
        await this.setState({
            isRegister: true
        })
        this._userInput.blur();
        this._pwdInput.blur();
        this._pwdInput1.blur();
        const { navigator } = this.props;
        //debugger版本
        /*if(navigator) {
                        navigator.push({
                            name: 'Setting',
                            component: Setting,
                            //参数传递
                            params:{
                                //要传递的参数
                            }
                        })
        }*/
        //最终版本
        let userId = this.state.userID.toString();
        let reg = new RegExp("[^0-9A-Za-z_$]");
        let bool = reg.test(userId);
        if (userId.length < 6) {
            Alert.alert('', '您输入的用户名过短(6-30个字符)', [{
                text: '确认', onPress: () => {
                    this.setState({ completeInput: false, userIDVal: false, isRegister: false })
                }
            }]);
            return;
        } else if (bool) {
            Alert.alert('', '用户名格式不正确(只能由字母、数字、下划线组成)', [{
                text: '确认', onPress: () => {
                    this.setState({ completeInput: false, userIDVal: false, isRegister: false })
                }
            }]);
            return
        } else {
            this.setState({ userIDVal: true });
            let pwdId = this.state.pwd.toString();
            let reg1 = new RegExp("[^0-9A-Za-z$]");
            let bool1 = reg1.test(pwdId);
            if (pwdId.length < 6) {
                Alert.alert('', '密码输入有误', [{
                    text: '确认', onPress: () => {
                        this.setState({ completeInput: false, userIDVal: false, isRegister: false })
                    }
                }]);

                return
            } else if (bool1) {
                Alert.alert('', '密码输入有误', [{
                    text: '确认', onPress: () => {
                        this.setState({ completeInput: false, userIDVal: false, isRegister: false })
                    }
                }]);
                return
            } else {
                this.setState({ pwdVal: true });
                let pwdId1 = this.state.pwdConfirm.toString();
                if (pwdId1 === pwdId) {
                    this.setState({ dblCon: true })
                    try {
                        let responseJson = await CustomSync.fetch(this, global.httpURL + 'reg/?username=' + this.state.userID + '&userpwd=' + this.state.pwd)
                        if (responseJson.data) {
                            await CustomSync.setStringForKey('sessionID', responseJson.data);
                            global.sessionID = responseJson.data;
                            this.setState({ serverID: responseJson.data, isRegister: false });
                            if (navigator) {
                                navigator.push({
                                    name: 'Setting',
                                    component: Setting,
                                    //参数传递
                                    params: {
                                        //要传递的参数
                                        serverID: responseJson.data
                                    }
                                })
                            }
                        } else {
                            this.setState({
                                isRegister: false
                            }, () => {
                                toastShort(global.errorcode[responseJson.status].msg)
                            })
                        }
                    } catch (error) {
                        this.setState({
                            isRegister: false
                        })
                        console.log(error)
                    }
                } else {
                    Alert.alert('', '密码两次输入不一致', [{
                        text: '确认', onPress: () => {
                            this.setState({ dblCon: false, isRegister: false })
                        }
                    }]);

                    return
                }
            }
        }

    }
    //判断输入value
    _userIDBlur() {
        let userId = this.state.userID.toString();
        let reg = new RegExp("[^0-9A-Za-z_$]");
        let bool = reg.test(userId);
        if (userId.length < 6) {
            this.setState({ completeInput: false, userIDVal: false })
        } else if (bool) {
            this.setState({ completeInput: false, userIDVal: false })
        } else {
            this.setState({ userIDVal: true });
        }
    }
    _userpwdBlur() {
        let pwdId = this.state.pwd.toString();
        let reg = new RegExp("[^0-9A-Za-z$]");
        let bool = reg.test(pwdId);
        if (pwdId.length < 6) {
            this.setState({ completeInput: false, pwdVal: false })
        } else if (bool) {
            this.setState({ completeInput: false, pwdVal: false })
        } else {
            this.setState({ pwdVal: true });
        }
    }
    _userpwd1Blur() {
        let pwdId1 = this.state.pwd.toString();
        let pwdId = this.state.pwdConfirm.toString();
        if (pwdId1 !== pwdId) {
            this.setState({ dblCon: false });
        } else {
            this.setState({ dblCon: true })
        }
    }

    async _postMessToServer(code) {
        try {
            this.setState({
                isRegister: true
            }, async () => {
                const { navigator } = this.props;
                let mess = 'code=' + code;
                console.log('发送请求login/weixin', code);
                let responseJson = await CustomSync.fetch(this, global.httpURL + 'login/weixin', 'POST',
                    { 'Content-Type': 'application/x-www-form-urlencoded' }, mess);
                console.log(responseJson);
                if (responseJson.data) {
                    console.log(responseJson.data);
                    let sessionID = responseJson.data;
                    this.setState({ sessionID: sessionID });
                    await CustomSync.setStringForKey('sessionID', sessionID);
                    global.sessionID = sessionID;
                    console.log('百度地图加载前')
                    let location = await CustomSync.getCurrentLocation();
                    console.log(location);
                    console.log('百度地图响应后')
                    responseJson = await CustomSync.fetch(this,
                        global.httpURL + `iamhere/?sid=${sessionID}&longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`);
                    if (responseJson.status !== 1) {
                        this.setState({ isRegister: false })
                        Alert.alert('', global.errorcode[responseJson.status].msg)
                        return;
                    }
                    console.log('环境变量')
                    // 获取个人信息
                    responseJson = await CustomSync.fetch(this, global.httpURL + 'profile/0?sid=' + sessionID);
                    if (responseJson.status !== 1) {
                        this.setState({ isRegister: false })
                        Alert.alert('', global.errorcode[responseJson.status].msg)
                        return;
                    }
                    var userInformation = responseJson.data;
                    console.log('个人信息')
                    console.log(userInformation)
                    this.setState({ userInformation: userInformation });
                    await CustomSync.setObjectForKey('userInformation', userInformation);
                    global.userInformation = userInformation;
                    console.log('用户备注')
                    responseJson = await CustomSync.fetch(this, global.httpURL + 'userdefined?sid=' + sessionID);
                    if (responseJson.status == 1) {
                        console.log('备注协议调去完毕')
                        let defineArray = responseJson.data;
                        let defineMap = new Map();
                        if (defineArray) {
                            for (let { userid, remarks } of defineArray) {
                                defineMap.set(userid, remarks);
                            }
                        }
                        global.userdefined = defineMap;
                    }
                    if (navigator) {
                        console.log('navigator resetTo Main');
                        //将下一级导航压入栈
                        navigator.resetTo({
                            name: 'Main',
                            component: Main,
                            params: {
                                sessionID: sessionID,
                                userInformation: userInformation
                            }
                        })
                    }
                } else {
                    this.setState({
                        isRegister: false
                    })
                    toastShort(global.errorcode[responseJson.status].msg)
                }
            })
        } catch (err) {
            this.setState({
                isRegister: false
            })
            Alert.alert('', JSON.stringify(err));
        }

        /*fetch(global.httpURL+'/login/weixin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: mess
        }).then(()=>{toastShort('发送完毕',code)})*/
    }

    async _wechatLogin() {
        try {
            if (global.wechatIn) {
                let isInstalled = await WeChat.isWXAppInstalled();
                let isSupportAPI = await WeChat.isWXAppSupportApi();
                if (isInstalled && isSupportAPI) {
                    console.log('_wechatLogin', isInstalled, isSupportAPI);
                    WeChat.sendAuthRequest('snsapi_userinfo').then(res => {
                        //res.code - 发给中华
                        console.log('_wechatLogin seccess', res);
                        if (res.code) {
                            this._postMessToServer(res.code);
                        }
                    });
                } else {
                    toastShort('没有安装微信软件，请您安装微信之后再试');
                }
            } else {
                if (!global.wechatIn) {
                    if (Platform.OS == 'ios') {
                        WeChat.registerApp(global.wechatIos).then(res => {
                            global.wechatIn = res;
                        });
                    } else {
                        WeChat.registerApp(global.wechatAndroid).then(res => {
                            global.wechatIn = res;
                        });
                    }
                }
                toastShort('网络异常，请重新尝试');
            }
            /*WeChat.isWXAppInstalled()
               .then((isInstalled) => {
                   if (isInstalled) {
                       try{
                           WeChat.sendAuthRequest('snsapi_userinfo').then(res=>{
                               //res.code - 发给中华
                               console.log('_wechatLogin seccess', res);
                               this._postMessToServer(res.code);
                           });
                       }catch(err){
                           console.log('_wechatLogin fetch err ',err)
                       }
                   } else {
                       toastShort('没有安装微信软件，请您安装微信之后再试');
                   }
               })*/
        } catch (e) {
            console.error('_wechatLogin err ', e);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*导航栏*/}
                <NavBar barBGColor='#1596fe'
                    titleTextColor='#fff'
                    rightTextColor='#fff'
                    title='用户注册' />
                {/*头像图*/}
                <KeyboardAwareScrollView>
                    <View style={styles.center}>
                        <Image source={require('../img/create_Avatar.jpg')}
                            style={{ resizeMode: 'cover', height: Height * 0.25, width: Width }}>
                            <Text style={{
                                textDecorationLine: 'underline', alignSelf: 'flex-end',
                                marginTop: Height * .02, marginRight: Width * .05, padding: 3,
                                color: '#eee', fontSize: 15, backgroundColor: 'transparent'
                            }}
                                onPress={this._goMain.bind(this)}>
                                随便逛逛
                            </Text>
                        </Image>
                    </View>
                    {/*用户名*/}
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.textItem}>
                            <TextInput placeholder={'请输入您的用户名(6-30个字符)'}
                                placeholderTextColor={'rgba(0,0,0,.4)'}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                maxLength={30}
                                onChangeText={(userID) => { this.setState({ userID }); this._userIDBlur.bind(this) }}
                                underlineColorAndroid={'transparent'}
                                textAlignVertical={'bottom'}
                                textAlign={'center'}
                                style={{ height: 40, fontSize: 14 }}
                                onBlur={this._userIDBlur.bind(this)}
                                onSubmitEditing={this._userIDBlur.bind(this)}
                                ref={(ref) => this._userInput = ref} />
                        </View>
                        {/*密码*/}
                        <View style={styles.textItem}>
                            <TextInput placeholder={'请输入密码，密码为英文和数字的组合(6-20个字符)'}
                                placeholderTextColor={'rgba(0,0,0,.4)'}
                                autoCapitalize={'none'}
                                maxLength={20}
                                onChangeText={(pwd) => this.setState({ pwd })}
                                underlineColorAndroid={'transparent'}
                                textAlignVertical={'bottom'}
                                textAlign={'center'}
                                secureTextEntry={true}
                                style={{ height: 40, fontSize: 14 }}
                                onBlur={this._userpwdBlur.bind(this)}
                                onSubmitEditing={this._userpwdBlur.bind(this)}
                                selectTextOnFocus={true}
                                ref={(ref) => this._pwdInput = ref} />
                        </View>
                        {/*再次输入密码*/}
                        <View style={styles.textItem}>
                            <TextInput placeholder={'请再次输入您的密码'}
                                placeholderTextColor={'rgba(0,0,0,.4)'}
                                autoCapitalize={'none'}
                                maxLength={20}
                                onChangeText={(pwdConfirm) => this.setState({ pwdConfirm })}
                                underlineColorAndroid={'transparent'}
                                textAlignVertical={'bottom'}
                                textAlign={'center'}
                                secureTextEntry={true}
                                style={{ height: 40, fontSize: 14 }}
                                onBlur={this._userpwd1Blur.bind(this)}
                                onSubmitEditing={this._userpwd1Blur.bind(this)}
                                selectTextOnFocus={true}
                                ref={(ref) => this._pwdInput1 = ref} />
                        </View>
                    </View>
                    {/*确认*/}
                    <View style={[styles.confirm]}>
                        {
                            this.state.isRegister ?
                                <TouchableOpacity activeOpacity={0.8}
                                    style={[styles.goSetting, { backgroundColor: '#999' }]}
                                    onPress={() => { }}
                                    disabled={true}>
                                    <Text style={{ textAlign: 'center', color: '#555', fontSize: 20, backgroundColor: 'transparent' }}>正在注册...</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity activeOpacity={0.8}
                                    style={[styles.goSetting]}
                                    onPress={this.getCreate.bind(this)}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20, backgroundColor: 'transparent' }}>确认注册</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <Text style={[styles.textItem, {
                        textAlign: 'center', padding: 10, textDecorationLine: 'underline',
                        color: '#222', backgroundColor: '#fff'
                    }]}
                        onPress={this._goLogin.bind(this)}>
                        已有登录，立即登录
                    </Text>
                    {/*<Text onPress={()=>{alert(JSON.stringify(result))}}
                         style={{marginTop:10,padding:5}}>{this.state.weixin}</Text>
                    <Text>
                        {this.state.token}
                    </Text>
                    <Text selectable={true}>
                        {this.state.wechatUser}
                    </Text>*/}
                    {
                        global.isWXAppInstalled ?
                            <View style={{ alignSelf: 'center', alignItems: 'center', width: Width, marginTop: Height * .05 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View style={styles.helfLine} />
                                    <Text style={{ marginLeft: Width * .05, marginRight: Width * .05, color: '#666', backgroundColor: 'transparent' }}>
                                        其他帐号登录
                            </Text>
                                    <View style={styles.helfLine} />
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: Height * .01 }}>
                                    <TouchableOpacity onPress={this._wechatLogin.bind(this)}
                                        style={{ borderRadius: Width * .05 }}
                                        activeOpacity={.8}>
                                        <FontAwesome name='wechat' size={40} color='rgba(146,229,88,1)' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View />
                    }
                </KeyboardAwareScrollView>
                {
                    this.state.isRegister ?
                        <Modal animationType={"none"}
                            transparent={true}
                            visible={true}
                            onRequestClose={() => { }}>
                            <Loading />
                        </Modal>
                        :
                        <View />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: Height,
        backgroundColor: '#ddd',
        flexDirection: 'column'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    center: {
        alignItems: 'center',
        marginBottom: 1
    },
    //分割线
    textItem: {
        backgroundColor: '#fff',
        width: Width,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 1
    },
    confirm: {
        alignSelf: 'center',
        marginTop: 5
    },
    goSetting: {
        borderRadius: 5,
        alignSelf: 'center',
        width: Width - 10,
        height: 40,
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#1596fe'
    },
    otherLoginImage: {
        width: Width * .12,
        height: Width * .12,
        resizeMode: 'cover',
        borderRadius: Width * .06,
        borderWidth: 2,
        borderColor: '#fff'
    },
    helfLine: {
        height: 1,
        width: Width * .2,
        backgroundColor: '#666'
    }
})