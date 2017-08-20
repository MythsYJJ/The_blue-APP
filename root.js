import React from 'react';
import {
    StatusBar,
    Navigator,
    View,
    Platform,
    BackAndroid,
    ToastAndroid
} from 'react-native';

import Splash from './login/splash';
import DropdownAlert from 'react-native-dropdownalert';
import CustomSync from './sync';
import { toastShort } from './Toast/ToastUtil';

global.httpURL = 'http://siguo1.m7games.com:9080/';
global.webURL = 'http://siguo1.m7games.com:9080/';
global.configURL = 'http://siguo1.m7games.com:9060/v1/';
global.wsURL = 'ws://siguo1.m7games.com:9080/ws/';
global.wechatAndroid = 'wx25b645509a2501ac';
global.wechatIos = 'wx25b645509a2501ac';
global.wechatIn = false;
global.updataMyList = false;
global.updataYoujidata = false;
global.updateXingchengId = null;
global.clientVersion = '1.3.1';
global.updateProductList = false;
global.updateSuibi = false;

const ANDROID_VERSION = '1.3.1';
const IOS_VERSION = '1.3.1';

var initialize = false;

export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.onCloseAlert = this.onCloseAlert.bind(this);
        this.onCancelAlert = this.onCancelAlert.bind(this);
        global.clientVersion = Platform.OS === 'android' ? ANDROID_VERSION : IOS_VERSION;
    }

    onBackAndroid = () => {
        const nav = this.navigator;
        const routers = nav.getCurrentRoutes();
        if (routers.length > 1) {
            nav.pop();
            return true;
        }
        if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再次点击退出TheBlue', ToastAndroid.SHORT);
        return true;
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        if (!global.userInformation) {
            global.userInformation = null;
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentDidMount() {
        CustomSync.registerAlert(this._dropdown);
    }

    onCloseAlert(data) {
        console.log('onCloseAlert', data);
    }

    onCancelAlert(data) {
        console.log('onCancelAlert', data)
        if (data.type == 'custom') {

        } else {

        }


        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'MessageCenter',
                component: MessageCenter,
                params: {
                    navigator: navigator
                }
            })
        }
    }

    render() {
        let defaultName = 'Splash';
        let defaultComponent = Splash;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar translucent={true} />
                <Navigator
                    ref={ref => this.navigator = ref}
                    //置顶默认页面，进入这个Root时看到的第一屏
                    initialRoute={{ name: defaultName, component: defaultComponent }}
                    //页面之间的跳转动画，具体动画效果目录 - node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorSceneConfigs.js
                    configureScene={
                        (route) => {
                            return Navigator.SceneConfigs.PushFromRight
                        }
                    }
                    /*自带导航栏
                    navigationBar={
                        <Navigator.NavigationBar
                            routeMapper={NavigationBarRouteMapper}
                            style={{height:70,backgroundColor:'#000'}}/>
                    }
                    */
                    //回调两个参数
                    //route - 指代initialRoute的对象参数
                    //navigator - 指代一个navigator对象
                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        //判断，返回一个component navigator作为参数传递进这个组件并可用this.props调用
                        return <Component {...route.params} navigator={navigator} style={{ flex: 1 }} />
                    }} />
                <DropdownAlert
                    ref={(ref) => this._dropdown = ref}
                    titleNumOfLines={0}
                    messageNumOfLines={0}
                    closeInterval={4000}
                    containerStyle={{
                        backgroundColor: '#2B73B6',
                    }}
                    onClose={(data) => this.onCloseAlert(data)}
                    onCancel={(data) => this.onCancelAlert(data)}
                    showCancel={true}
                    imageSrc={require('./img/icon.png')}
                    cancelBtnImageSrc={require('./img/rank_u1740.png')}
                />
            </View>
        );
    }
}