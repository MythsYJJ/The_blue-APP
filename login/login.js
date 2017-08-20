import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableHighlight,
    Modal,
    StatusBar,
    Platform,
    Alert,
    BackAndroid,
    TouchableOpacity,
    Animated
} from 'react-native';

//登录页面
import Register from './register';
import NavBar from '../component/navbar';
import Button from '../component/button';
import Main from '../main/main';
import { toastShort } from '../Toast/ToastUtil';
import CustomSync from '../sync';
import Loading from '../component/loading';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
var WeChat = require('react-native-wechat');

var Back = require('../img/back.png');
var Logo = require('../img/create_Avatar.jpg');
var wechat = require('../img/wechat.png');

const Dimensions = require('Dimensions');
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

function convertEnvironment(env) {
    let newenv = {};
    for (let k of Object.keys(env)) {
        let v = env[k];
        if (typeof (v) != "object" || k == "features") {
            newenv[k] = v;
            continue;
        }
        let newv = {}
        for (let i in v) {
            let group = v[i];
            let newitems = {}
            for (let j in group.Items) {
                newitems[group.Items[j].Id] = group.Items[j];
            }
            group.Items = newitems
            newv[group.Id] = group;
        }
        newenv[k] = newv;
    }
    return newenv;
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            userpwd: null,
            //服务器ID
            sessionID: null,
            userInformation: null,
            isLogin: false,
            wechat: false
        }
        this._postMessToServer = this._postMessToServer.bind(this);
        this._startLogin = this._startLogin.bind(this);
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        this._goMain();
        return true;
    };

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    loadData(sessionID) {
        return Promise.all([
            CustomSync.setStringForKey('sessionID', sessionID),
            CustomSync.getCurrentLocation().then(
                location => {
                    CustomSync.fetch(this,
                        global.httpURL + `iamhere/?sid=${sessionID}&longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`)
                }
            ),
            CustomSync.fetch(this, global.httpURL + 'profile/0?sid=' + sessionID).then(
                responseJson => {
                    let userInformation = responseJson.data;
                    CustomSync.setObjectForKey('userInformation', userInformation);
                    global.userInformation = userInformation;
                }
            ),
            CustomSync.fetch(this, global.httpURL + 'userdefined?sid=' + sessionID).then(
                responseJson => {
                    let defineArray = responseJson.data;
                    let defineMap = new Map();
                    if (defineArray) {
                        for (let { userid, remarks } of defineArray) {
                            defineMap.set(userid, remarks);
                        }
                    }
                    global.userdefined = defineMap;
                }
            )
        ])
    }

    async _startLogin() {
        const { navigator } = this.props;
        try {
            // 登录
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'login?username='
                + this.state.userID + '&userpwd='
                + this.state.userpwd, 'GET', {}, {}, false);
            //console.log(responseJson)
            if (responseJson.status == 1) {
                var sessionID = responseJson.data;
                global.sessionID = sessionID;
                let values = await this.loadData(sessionID);
                if (navigator) {
                    //console.log(responseJson.data);
                    //console.log('navigator resetTo Main');
                    //将下一级导航压入栈
                    navigator.resetTo({
                        name: 'Main',
                        component: Main,
                        params: {
                            sessionID: sessionID,
                            userInformation: global.userInformation
                        }
                    })
                } else {
                    this.setState({ isLogin: false })
                }
            } else {
                Alert.alert('', global.errorcode[responseJson.status].msg, [{
                    text: '确认', onPress: () => {
                        this.setState({
                            isLogin: false
                        })
                    }
                }]);
            }
        } catch (err) {
            //console.log(err);
        }
    }

    goMain() {
        this.setState({
            isLogin: true
        }, () => {
            this._userInput.blur();
            this._pwdInput.blur();
            //debugger版本
            /*if(navigator) {
                //将下一级导航压入栈
                navigator.resetTo({
                    name: 'Main',
                    component: Main
                })
            }*/
            //登录最终版本
            if (!this.state.userID) {
                Alert.alert('', '用户名不能为空', [{
                    text: '确认', onPress: () => {
                        this.setState({
                            isLogin: false
                        })
                    }
                }]);
                return
            } else if (!this.state.userpwd) {
                Alert.alert('', '请输入您的密码', [{
                    text: '确认', onPress: () => {
                        this.setState({
                            isLogin: false
                        })
                    }
                }]);
                return
            } else if (this.state.userID && this.state.userpwd) {
                this._startLogin();
            }
        })
    }
    _goRegister() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name: 'Register',
                component: Register
            })
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

    async _postMessToServer(code) {
        this.setState({
            isLogin: true
        }, async () => {
            const { navigator } = this.props;
            let mess = 'code=' + code;
            //console.log('发送请求login/weixin', code);
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'login/weixin', 'POST',
                { 'Content-Type': 'application/x-www-form-urlencoded' }, mess);
            //console.log(responseJson);
            if (responseJson.data) {
                //console.log(responseJson.data);
                let sessionID = responseJson.data;
                global.sessionID = sessionID;
                let values = await this.loadData(sessionID);
                if (navigator) {
                    //console.log(responseJson.data);
                    //console.log('navigator resetTo Main');
                    //将下一级导航压入栈
                    navigator.resetTo({
                        name: 'Main',
                        component: Main,
                        params: {
                            sessionID: sessionID,
                            userInformation: global.userInformation
                        }
                    })
                }
            } else {
                await this.setState({
                    isLogin: false
                })
                toastShort(global.errorcode[responseJson.status].msg)
            }
        })
        /*fetch(global.httpURL+'/login/weixin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: mess
        }).then(()=>{toastShort('发送完毕',code)})*/
    }

    _wechatLogin() {
        try {
            //console.log('_wechatLogin' + global.wechatIn);
            if (global.wechatIn) {
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled) {
                            try {
                                WeChat.sendAuthRequest('snsapi_userinfo').then(res => {
                                    //res.code - 发给中华
                                    /*if(res){
                                        //console.log(res);
                                        this._postMessToServer(res.code);
                                    }*/
                                    if (res.errCode == 0) {
                                        if (res.code) {
                                            //console.log(res);
                                            this._postMessToServer(res.code);
                                        }
                                    } else {
                                        Alert.alert('', res.errStr);
                                    }
                                });
                            } catch (err) {
                                Alert.alert('', JSON.stringify(err));
                                //console.log(err)
                            }
                        } else {
                            toastShort('没有安装微信软件，请您安装微信之后再试');
                        }
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
                toastShort('网络异常，请稍后尝试');
            }
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <NavBar barBGColor='#1596fe'
                    titleTextColor='#fff'
                    rightTextColor='#fff'
                    title='用户登录' />
                <View style={styles.row}>
                    <View>
                        <Image source={Logo} style={styles.logoImage}>
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
                    <View>
                        <View style={styles.inputView}>
                            <TextInput placeholder={'请输入您的用户名'}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                placeholderTextColor={'rgba(0,0,0,.4)'}
                                maxLength={30}
                                textAlign={'center'}
                                textAlignVertical={'bottom'}
                                underlineColorAndroid={'transparent'}
                                style={{ height: 40, fontSize: 14 }}
                                onChangeText={(userID) => this.setState({ userID })}
                                ref={(ref) => this._userInput = ref} />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput placeholder={'请输入您的密码'}
                                autoCapitalize={'none'}
                                placeholderTextColor={'rgba(0,0,0,.4)'}
                                maxLength={20}
                                textAlign={'center'}
                                textAlignVertical={'bottom'}
                                underlineColorAndroid={'transparent'}
                                style={{ height: 40, fontSize: 14 }}
                                secureTextEntry={true}
                                onChangeText={(userpwd) => this.setState({ userpwd })}
                                selectTextOnFocus={true}
                                ref={(ref) => this._pwdInput = ref} />
                        </View>
                        <View style={[styles.ButtonView]}>
                            {
                                this.state.isLogin ?
                                    <Button text="正在登录..."
                                        width={Width - 10}
                                        backgroundColor={'#999'}
                                        color={'#555'}
                                        disabled={true} />
                                    :
                                    <Button text="登录"
                                        width={Width - 10}
                                        backgroundColor={'#1596e3'}
                                        color={'#fff'}
                                        fontWeight={'bold'}
                                        click={this.goMain.bind(this)} />
                            }
                        </View>
                    </View>
                    <Text style={[styles.textItem, {
                        textAlign: 'center', padding: 10, textDecorationLine: 'underline',
                        color: '#222'
                    }]}
                        onPress={this._goRegister.bind(this)}>
                        没有帐号？立即注册
                    </Text>
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
                                        <FontAwesome name='wechat' size={40} color='rgba(112,220,37,1)' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View />
                    }
                </View>
                {
                    this.state.isLogin ?
                        <Modal animationType={"none"}
                            transparent={true}
                            visible={true}
                            onRequestClose={() => { }}>
                            <Loading ref={component => this._loading = component} />
                        </Modal>
                        :
                        <View />
                }

            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    row: {
        flex: 1,
    },
    logoImage: {
        height: Height * 0.25,
        alignSelf: 'center',
        resizeMode: 'cover',
        marginBottom: 1,
        width: Width
    },
    inputView: {
        width: Width,
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginBottom: 1,
    },
    ButtonView: {
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 20
    },
    textItem: {
        backgroundColor: '#fff',
        width: Width,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 1
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