import React, { Component } from 'react';
import {
    View,
    Linking,
    Platform,
    AppState,
    Alert
} from 'react-native';

import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
var WeChat = require('react-native-wechat');

import { setUrl } from '../constants/Urls';

import SplashScreen from 'react-native-smart-splash-screen';
import Register from './register';
import Setting from './setting';
import CustomSync from '../sync';
import FileUtil from '../Utils/fileUtil';
import Guide from '../Guide/guideView';
import Main from '../main/main';
import _updateConfig from '../../update.json';
const { appKey } = _updateConfig[Platform.OS];

var appState;

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
            for (let j in group.items) {
                newitems[group.items[j].id] = group.items[j];
            }
            group.items = newitems
            newv[group.id] = group;
        }
        newenv[k] = newv;
    }
    return newenv;
}

export default class Splash extends Component {
    constructor(props) {
        super(props)
        this.loadData = this.loadData.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);

        appState = AppState.currentState;
    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '更新完毕,点击确定重启应用', [
                { text: '确定', onPress: () => { switchVersion(hash); } },
                {
                    text: '下次启动时', onPress: () => {
                        switchVersionLater(hash);
                        this.loadData();
                    }
                }
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };

    async loadData() {
        /*let info = await checkUpdate(appKey);
        if (info.expired) {
            Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                { text: '前往更新', onPress: () => { info.downloadUrl && Linking.openURL(info.downloadUrl) } }
            ], { cancelable: false });
        } else if (info.upToDate) {
            //应用版本已是最新 pass
        } else {
            this.doUpdate(info);
            return;
        }
        */
        const { navigator } = this.props;
        try {
            let connect_select = await CustomSync.getStringForKey('connect_url');
            console.log(connect_select);
            if (connect_select != null) {
                setUrl(connect_select);
            } else {
                setUrl();
            }

            let version = await CustomSync.getConfig('version.json');
            global.version = version;
            console.log(version)
            let personalinfo = await CustomSync.getConfig('personalinfo.json');
            global.personalinfo = convertEnvironment(personalinfo);
            console.log(personalinfo)
            let common = await CustomSync.getConfig('common.json');
            global.common = common;
            console.log(common)
            let product = await CustomSync.getConfig('product.json');
            global.product = product;
            console.log(common)
            let errorcode = await CustomSync.getConfig('errorcode.json');
            global.errorcode = errorcode;
            console.log(errorcode)
            let activity = await CustomSync.getConfig('activity.json');
            global.activity = activity;
            console.log(activity)
            CustomSync.notifications = await FileUtil.readFile('custom_notifications', 'json');
            let isWXAppInstalled = await WeChat.isWXAppInstalled();
            global.isWXAppInstalled = isWXAppInstalled;

            let sessionID = await CustomSync.getStringForKey('sessionID');
            global.sessionID = sessionID;
            if (sessionID !== null) {
                let responseJson = await CustomSync.fetch(this, `${global.httpURL}userdefined?sid=${sessionID}`);
                let defineArray = responseJson.data;
                let defineMap = new Map();
                if (defineArray) {
                    for (let { userid, remarks } of defineArray) {
                        defineMap.set(userid, remarks);
                    }
                }
                global.userdefined = defineMap;
                responseJson = await CustomSync.fetch(this, `${global.httpURL}profile/0?sid=${sessionID}`);
                console.log('splash:', responseJson)
                global.userInformation = responseJson.data;
            }

            SplashScreen.close({
                animationType: SplashScreen.animationType.scale,
                duration: 850,
                delay: 500,
            })


            let componentName = '';
            let componentClass = null;
            let gudieVersion = await CustomSync.getStringForKey('GUDIEVIEW_READ_VERSION');
            if (gudieVersion !== global.clientVersion) {
                componentName = 'Guide';
                componentClass = Guide;
            } else {
                if (global.sessionID && global.userInformation != null && global.userInformation.nickname == '') {
                    componentName = 'Setting';
                    componentClass = Setting;
                } else {
                    componentName = 'Main';
                    componentClass = Main;
                }
            }
            if (navigator) {
                navigator.resetTo({
                    name: componentName,
                    component: componentClass,
                    params: {
                        navigator: navigator
                    }
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        if (Platform.OS == 'ios') {
            if (!global.wechatIn) {
                WeChat.registerApp(global.wechatIos).then(res => {
                    global.wechatIn = true;
                });
            }
        } else {
            if (!global.wechatIn) {
                WeChat.registerApp(global.wechatAndroid).then(res => {
                    global.wechatIn = true;
                });
            }
        }

        AppState.addEventListener('change', this._handleAppStateChange);

        this.loadData();
    }

    _handleAppStateChange = (nextAppState) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            this.loadData();
        }

        appState = nextAppState;
    }

    render() {
        return (
            <View />
        )
    }
}