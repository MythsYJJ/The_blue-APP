import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    TouchableHighlight,
    Platform,
    Navigator,
    ListView,
    RefreshControl,
    BackAndroid
} from 'react-native';
import NavBar from '../component/navbar';
import LinearGradient from 'react-native-linear-gradient';
import TravelNoteContent from './Youji/travel_note_content';
import PersonalCenter from './personalCenter';
import CacheImage from '../component/cacheImage';
import CustomSync from '../sync';
import Login from '../login/login';
import { setUrl } from '../constants/Urls';

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');

var sexArr = [
    require('../img/myself/u826.png'),
    require('../img/myself/u808.png')
];
var isSearch = false;

export default class SearchView extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listdata: [],
            showView: 1,
            search: null,
            searchkey: '',
            empty: false
        }
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        if (this.state.showView == 2) {
            this.setState({
                showView: 1
            });
            return true;
        }
        return false;
    };

    componentWillMount() {
        let common = global.common
        this.setState({ common: common })
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    _onTopRefresh() {
        // toastShort('顶部刷新')
    }
    _onEndRefresh() {
        // toastShort('底部刷新')
    }

    backLogin = () => {
        isSearch = false;
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    async goSearch(key) {
        if (!this.state.searchkey || this.state.searchkey.match(/^\s+$/)) {
            return;
        }
        let changeIP = true;
        console.log('goSearch key = '+this.state.searchkey);
        switch (this.state.searchkey) {
            case 'm7game_debug_ip':
                setUrl('debug');
                CustomSync.setStringForKey('connect_url', 'debug');
                break;
            case 'm7game_release_ip':
                setUrl('release');
                CustomSync.setStringForKey('connect_url', 'release');
                break;
            case 'm7game_beta_ip':
                setUrl('beta');
                CustomSync.setStringForKey('connect_url', 'beta');
                break;
            default:
                changeIP = false;
        }
        if (changeIP) {
            global.sessionID = null;
            const { navigator } = this.props;
            if (navigator) {
                navigator.resetTo({
                    name: 'Login',
                    component: Login,
                    params: {
                        navigator: navigator
                    }
                })
            }
            return;
        }
        isSearch = true;
        if (this._search) {
            this._search.blur();
        }
        if (this._listView) {
            this._listView.scrollTo({ x: 0, y: 0, animated: false });
        }
        let value = this.state.search == 'user' ? 1 : 2
        let responseJson = await CustomSync.fetch(this, global.httpURL + 'search/' + value
            + '?sid=' + sessionID + '&key=' + key);
        console.log('seachview', responseJson)
        if (responseJson.data) {
            this.setState({ listdata: responseJson.data })
        } else {
            this.setState({ listdata: [] });
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
    //跳转个人信息
    goOtherSelf(rowData) {
        let objdata = new Object()
        objdata.userid = rowData.userid
        objdata.avatar = rowData.avatar
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
    _renderRow(rowData, rowId) {
        let headImage = this.state.common ?
            this.state.common.fileurl.imgavatar + rowData.avatar :
            '../../img/touxiang/t10.jpg'
        console.log(headImage)
        console.log(global.common)
        switch (this.state.search) {
            case 'user':
                return (
                    <View style={{ padding: 4 }}>
                        {/*TOP图标*/}
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.goOtherSelf(rowData) }}
                            style={{}}>
                            <View style={{
                                alignSelf: 'center', backgroundColor: '#fff',
                                borderWidth: 1, borderColor: '#bbb', marginTop: 5
                            }}>
                                <View style={{
                                    width: Width * .95, alignSelf: 'center', padding: Width * .03,
                                    flexDirection: "row"
                                }}>
                                    {/*<Image source={{ uri: headImage }}
                                        style={{
                                            resizeMode: 'cover', width: Width * .2,
                                            height: Width * .2, borderRadius: Width * .1,
                                            borderWidth: 2, borderColor: '#ffcc00'
                                        }} />*/}
                                    <CacheImage cacheType='head'
                                        envUrl={global.common.fileurl.imgavatar}
                                        url={rowData.avatar}
                                        style={{
                                            resizeMode: 'cover', width: Width * .15,
                                            height: Width * .15, borderRadius: Width * .075,
                                            borderWidth: 2, borderColor: '#ffcc00'
                                        }}
                                        resizeMode='cover' />
                                    <View style={{ justifyContent: 'space-between', height: Width * .12 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{
                                                textAlignVertical: 'bottom',
                                                marginLeft: Width * .03, fontSize: 18,
                                                color: '#222', fontWeight: 'bold', backgroundColor: "transparent"
                                            }}>
                                                {rowData.nickname}
                                            </Text>
                                            {/*根据rowData.sex判断性别，sexArr[1]为男，2为女*/}
                                            <View style={{ justifyContent: 'flex-end' }}>
                                                <Image source={sexArr[rowData.sex - 1]}
                                                    style={{
                                                        resizeMode: 'contain', width: Width * .08,
                                                        position: 'relative', bottom: -8
                                                    }} />
                                            </View>
                                        </View>
                                        <Text style={{
                                            textAlignVertical: 'center', textAlign: 'left',
                                            alignSelf: 'flex-start', color: '#999',
                                            fontWeight: 'bold', marginTop: 20,
                                            marginLeft: Width * .02, backgroundColor: "transparent"
                                        }}
                                            numberOfLines={1}>
                                            {rowData.signature}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            case 'youji':
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
                            {/*<Image source={{ uri: global.common.fileurl.imgtravel + rowData.coverphotos[0] }}
                                style={styles.dataTitleImage} />*/}
                            <CacheImage envUrl={global.common.fileurl.imgtravel}
                                url={rowData.coverphotos[0]}
                                style={styles.dataTitleImage}
                                resizeMode='cover' />
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
    }

    _renderList() {
        const isEmpty = this.state.listdata === undefined || this.state.listdata.length === 0;
        if (isEmpty) {
            if (isSearch) {
                return (
                    <View style={{
                        flex: 1, alignItems: 'center',
                        justifyContent: 'center', width: Width, height: Height
                    }}>
                        <Text style={{ fontSize: 16, color: '#333', backgroundColor: 'transparent' }}>未搜索到相关信息...</Text>
                    </View>
                )
            } else {
                return (
                    <View />
                )
            }
        }
        return (
            <ListView dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                showsVerticalScrollIndicator={false}
                initialListSize={3}
                enableEmptySections={true}
                onEndReachedThreshold={0}
                onEndReached={this._onEndRefresh}
                ref={ref => this._listView = ref} />
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {
                    this.state.showView == 1 ?
                        <View style={{ flex: 1 }}>
                            <NavBar leftItemFunc={this.backLogin}
                                leftImageSource={Back}
                                barBGColor='#1596fe'
                                title='搜索'
                                titleTextColor='#fff' />
                            <View style={{
                                flex: 1, justifyContent: 'center', alignItems: 'center',
                                backgroundColor: '#ddd'
                            }}>
                                <View style={{
                                    width: Width * .7, flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            showView: 2,
                                            search: 'user'
                                        })
                                    }}
                                        activeOpacity={0.7}>
                                        <Image source={require('../img/search_user.png')}
                                            style={{ resizeMode: 'contain', width: Width * .27, height: Width * .27 }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            showView: 2,
                                            search: 'youji'
                                        })
                                    }}
                                        activeOpacity={0.7}>
                                        <Image source={require('../img/search_youji.png')}
                                            style={{ resizeMode: 'contain', width: Width * .27, height: Width * .27 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center',
                            backgroundColor: '#ddd'
                        }}>
                            {/*导航*/}
                            <View style={{
                                width: Width, height: 70, flexDirection: 'row',
                                justifyContent: 'space-between', backgroundColor: '#1596fe',
                                alignItems: 'flex-end', paddingBottom: 10,
                                paddingRight: Width * .05
                            }}>
                                <TouchableOpacity onPress={() => { isSearch = false; this.setState({ showView: 1, listdata: [] }) }}
                                    style={{
                                        width: Width * .1, paddingLeft: 10,
                                        height: 35, justifyContent: 'center'
                                    }}>
                                    <Image source={Back}
                                        style={{ resizeMode: 'contain', height: 22, width: 22 }} />
                                </TouchableOpacity>
                                <View style={{
                                    backgroundColor: '#fff', height: 35, width: Width * .65,
                                    flexDirection: 'row', alignItems: 'center'
                                }}>
                                    <Image source={require('../img/search.png')}
                                        style={{ resizeMode: 'contain', height: 30, width: 30 }} />
                                    <View style={{
                                        flexDirection: "row", justifyContent: 'space-between', alignItems: 'center',
                                        width: Width * .6, backgroundColor: '#fff'
                                    }}>
                                        <TextInput style={{ height: 30, width: Width * .55 - 20, padding: 0 }}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={(text) => { this.setState({ searchkey: text }) }}
                                            ref={ref => this._search = ref}
                                            autoFocus={true}
                                            clearButtonMode={'while-editing'} />
                                        {Platform.OS === 'android' ?
                                            <View style={{
                                                backgroundColor: '#ddd', width: 20, height: 20,
                                                borderRadius: 10, marginRight: Width * .05,
                                                alignItems: 'center', justifyContent: "center"
                                            }}>
                                                <Text style={{
                                                    fontSize: 17, textAlign: 'center', textAlignVertical: 'auto',
                                                    alignSelf: 'center', color: '#999', padding: 3, fontWeight: 'normal', backgroundColor: 'transparent'
                                                }}
                                                    onPress={() => { this._search.clear(); this.setState({ searchkey: '' }) }}>
                                                    &times;
                                                </Text>
                                            </View>
                                            :
                                            <View />
                                        }
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => { this.goSearch(this.state.searchkey) }}
                                    style={{}}>
                                    <Text style={{
                                        width: Width * .1, textAlign: 'center',
                                        textAlignVertical: 'center', height: 35,
                                        color: '#fff', fontSize: 18, backgroundColor: 'transparent'
                                    }}>搜索</Text>
                                </TouchableOpacity>
                            </View>
                            {/*主页*/}
                            <View style={{ flex: 1 }}>
                                {this._renderList.bind(this)()}
                            </View>
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    //游记样式
    listDataView: {
        width: Width - 10,
        backgroundColor: '#fff',
        marginBottom: 8,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        margin: 5
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
        backgroundColor: "transparent"
    },
    cycleNum: {
        color: '#169BD5',
        backgroundColor: "transparent"
    },
    dataBody: {
        width: Width * 0.9,
        marginBottom: 5
    },
    dataBodyText: {
        width: Width * 0.7,
        color: '#000',
        fontSize: 15,
        backgroundColor: "transparent"
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