import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Linking,
    ScrollView,
    Platform,
    StatusBar,
    AppState,
    BackAndroid,
    ToastAndroid
} from 'react-native';
import Swiper from 'react-native-swiper';
import NavBar from '../component/navbar';
import TabNavigator from 'react-native-tab-navigator';
import ByteBuffer from 'byte-buffer';
import Index from './index';
import Youquan from './youquan';
import PersonalCenter from './personalCenter';
import Attention from './attention';
import MessageCenter from './messageCenter';
import Setting from '../login/setting';
import Group from './group';
//游记管理更新
import Youji from './youji';
import NewYouJi from './newYouji';
import { toastShort } from '../Toast/ToastUtil';
//proto
import mess from '../proto/msg';
import CustomSync from '../sync';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

const MAIN = require('../img/tabBar/main.png');
const MAIN_SELECTED = require('../img/tabBar/main_selected.png');
const YOUQUAN = require('../img/tabBar/youquan.png');
const YOUQUAN_SELECTED = require('../img/tabBar/youquan_selected.png');
const YOUJI = require('../img/tabBar/youji.png');
const YOUJI_SELECTED = require('../img/tabBar/youji_selected.png');
const GUANZHU = require('../img/tabBar/guanzhu.png');
const GUANZHU_SELECTED = require('../img/tabBar/guanzhu_selected.png');
const MYSELF = require('../img/tabBar/myself.png');
const MYSELF_SELECTED = require('../img/tabBar/myself_selected.png');

var responseData;
import FontAwesome from 'react-native-vector-icons/FontAwesome';

var appState = '';

//主页面
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'home',
            sessionID: null,
            userId: null
        }

        this._goDownload = this._goDownload.bind(this);
        this.checkVersion = this.checkVersion.bind(this);

        appState = AppState.currentState;
    }

    async loadData() {
        const { navigator } = this.props;
        try {
            if (global.sessionID) {
                if (global.userInformation.nickname == '') {
                    console.log('跳转setting');
                    if (navigator) {
                        navigator.resetTo({
                            name: 'Setting',
                            component: Setting
                        })
                    }
                }
                this.setState({ sessionID: global.sessionID });
            }
            if (global.userInformation) {
                this.setState({ userId: global.userInformation.userid })
            }
            console.log('个人信息', global.userInformation)
            //保护
            if (global.sessionID && !global.userInformation) {
                let responseJson = await CustomSync.fetch(this, global.httpURL + 'profile/0?sid=' + sessionID);
                if (responseJson.data) {
                    console.log('保护作用，获取个人信息', responseJson.data)
                    global.userInformation = responseJson.data;
                }
            }
            this.setState({ userId: global.userInformation.userid });
            if (!global.ws && global.sessionID) {
                await CustomSync.initWebSocket(global.sessionID);
            }
        } catch (err) {
            console.log(err);
        }
    }

    onBackAndroid = () => {
        if (this.lastBackPressed && this.lastBackPressed + 1000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再次点击退出TheBlue', ToastAndroid.SHORT);
        return true;
    };

    componentWillMount() {
        this.loadData();
        /*if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }*/
    }

    componentWillUnmount() {
        /*if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }*/
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        const { navigator } = this.props;

        AppState.addEventListener('change', this._handleAppStateChange);
        /*const {youji} = this.props;
        if (navigator) {

            if (youji) {
                this.setState({
                    selectedTab: 'youji'
                })
            }
        }*/
        this.checkVersion();
    }

    checkVersion() {
        if (global.version[Platform.OS] !== global.clientVersion) {
            if (global.version.forceUpgrade) {
                Alert.alert(null,'发现新版本,亲,更新之后体验更佳哦', [
                    { text: '前往', onPress: () => this._goDownload() },
                ],{ cancelable: false });
            } else {
                Alert.alert(null,'发现新版本,亲,更新之后体验更佳哦',  [
                    { text: '欣然前往', onPress: () => this._goDownload() },
                    { text: '残忍拒绝', onPress: () => console.log('custom refuse upgrade') },
                ],{ cancelable: false });
            }
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            this.checkVersion();
        }

        appState = nextAppState;
    }

    _goDownload() {
        //TODO
        let downloadUrl = Platform.OS === 'android' ? global.version.downloadUrl : 'https://itunes.apple.com/cn/app/theblue/id1124781715?mt=8';
        Linking.canOpenURL(downloadUrl).then(supported => {
            if (supported) {
                return Linking.openURL(downloadUrl);
            } else {
                console.log('Linking.canOpenURL = false');
            }
        }).catch(err => {
            console.error('An error occurred', err);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="transparent"
                    translucent={true}
                />
                {/*底部导航栏*/}
                <TabNavigator tabBarStyle={styles.tab}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'home'}
                        title="主页"
                        renderIcon={() => <FontAwesome name='home' size={30} color='rgba(128,128,128,1)' />}
                        renderSelectedIcon={() => <FontAwesome name='home' size={30} color='rgba(20,150,255,1)' />}
                        badgeText=""
                        onPress={() => this.setState({ selectedTab: 'home' })}
                        titleStyle={styles.tabTitle}
                        selectedTitleStyle={styles.tabSelectedTitle}>
                        <Index navigator={this.props.navigator}
                            sessionID={global.sessionID} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'youquan'}
                        title="游记圈"
                        renderIcon={() => <FontAwesome style={{ marginBottom: 3 }} name='book' size={22} color='rgba(128,128,128,1)' />}
                        renderSelectedIcon={() => <FontAwesome style={{ marginBottom: 3 }} name='book' size={22} color='rgba(20,150,255,1)' />}
                        renderBadge={() => { }}
                        onPress={() => this.setState({ selectedTab: 'youquan' })}
                        titleStyle={styles.tabTitle}
                        selectedTitleStyle={styles.tabSelectedTitle}>
                        <Youquan navigator={this.props.navigator}
                            sessionID={global.sessionID}
                            youquan={true} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'youji'}
                        title="组团"
                        renderIcon={() => <FontAwesome name='group' size={25} color='rgba(128,128,128,1)' />}
                        renderSelectedIcon={() => <FontAwesome name='group' size={25} color='rgba(20,150,255,1)' />}
                        renderBadge={() => { }}
                        onPress={() => this.setState({ selectedTab: 'youji' })}
                        titleStyle={styles.tabTitle}
                        selectedTitleStyle={styles.tabSelectedTitle}>
                        <Group navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'guanzhu'}
                        title="关注"
                        renderIcon={() => <FontAwesome name='heart' size={25} color='rgba(128,128,128,1)' />}
                        renderSelectedIcon={() => <FontAwesome name='heart' size={25} color='rgba(20,150,255,1)' />}
                        renderBadge={() => { }}
                        onPress={() => this.setState({ selectedTab: 'guanzhu' })}
                        titleStyle={styles.tabTitle}
                        selectedTitleStyle={styles.tabSelectedTitle}>
                        <Attention navigator={this.props.navigator}
                            userId={this.state.userId}
                            showblack={true}
                            guanzhu={true}
                            guanzhuback={false}
                            mainGuanzhu={true} />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'myself'}
                        title="个人中心"
                        renderIcon={() => <FontAwesome name='user-circle' size={25} color='rgba(128,128,128,1)' />}
                        renderSelectedIcon={() => <FontAwesome name='user-circle' size={25} color='rgba(20,150,255,1)' />}
                        renderBadge={() => { }}
                        onPress={() => this.setState({ selectedTab: 'myself' })}
                        titleStyle={styles.tabTitle}
                        selectedTitleStyle={styles.tabSelectedTitle}>
                        <PersonalCenter navigator={this.props.navigator}
                            userId={this.state.userId}
                            mainPush={true} />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ddd'
    },
    //底部导航条
    tab: {
        backgroundColor: '#eee',
        height: 55
    },
    icon: {
        resizeMode: 'contain',
        height: 25
    },
    tabTitle: {
        color: '#aaa',
        fontSize: 14
    },
    tabSelectedTitle: {
        color: '#1596fe'
    }
})
