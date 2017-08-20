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
    Alert,
    RefreshControl,
} from 'react-native';
import Swiper from 'react-native-swiper';
import NavBar from '../component/navbar';
import { toastShort } from '../Toast/ToastUtil';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TravelNoteContent from './Youji/travel_note_content';
import CustomSync from '../sync';
import Product from '../ProductView/Product';
import Ranking from './rankinglist/ranking';
import choosebg from '../Chooseuserinfobg/ChooseUserinfoBg';
import SearchView from './searchView';
import MessageCenter from './messageCenter';
import CacheImage from '../component/cacheImage';
import LoadingView from '../component/loadingView';
import Productinfo from '../ProductView/Productinfo';
import SuibiContent from './Suibi/Suibi_content';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Spinner = require('react-native-spinkit');

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            dataList: [],
            refresh:false,
            chageidx:1,
            load:true,
            changeView:false
        }
    }

    async _loadData(index) {
        //await this.setState({dataList:[]});
        console.log('index环境变量获取')
        // console.log(global.httpURL + 'travelnotesfilter?sid='
        //     + global.sessionID
        //     + '&offset=0'
        //     + '&num=50'
        //     + `&order=${index}`)
        try {
            this.setState({changeView:true},async ()=>{
                // let data = this.state.dataList;
                let responseJson = await CustomSync.fetch(this,global.httpURL + 'travelnotesfilter?sid='
                    + global.sessionID
                    + '&offset=0'
                    + '&num=50'
                    + `&order=${index}`
                )
                if(responseJson.status == 1){
                    console.log(responseJson.data)
                    this.setState({ dataList: responseJson.data,chageidx:index,load:false,changeView:false })
                } else {
                    Alert.alert('数据错误');
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    _onTopRefresh() {
        this.setState({
            refresh: true,
            dataList:[]
        }, async () => {
            await this._loadData(this.state.chageidx);
            this.setState({ refresh: false })
            console.log('顶部刷新')
        })
    }

    componentWillMount() {
        console.log(global.activity);
        this._loadData(1)
    }
    //指定游记跳转，附带游记参数(行程参数push后写入)
    _goTravelNote(rowData, Img) {
        const {navigator} = this.props;
        if (navigator && rowData) {
            if(rowData.category){
                console.log(rowData)
                //let backgroundImage = global.common.fileurl.imgtravel + allDataList.coverphotos[0];
                let isMySelf = false;
                if (global.userInformation && (rowData.userid == global.userInformation.userid)) {
                    isMySelf = true;
                }
                //console.log(backgroundImage)
                let userInfo = new Object();
                userInfo.avatar = rowData.avatar;
                userInfo.nickname = rowData.nickname;
                userInfo.befollowed = rowData.befollowed;
                userInfo.ipraised = rowData.ipraised;
                console.log('点击',userInfo);
                navigator.push({
                    name: 'SuibiContent',
                    component: SuibiContent,
                    params: {
                        id: rowData.id,
                        viewtye: 1,
                        userinfo: userInfo
                    }
                })
            }else{
                navigator.push({
                    name: 'TravelNoteContent',
                    component: TravelNoteContent,
                    params: {
                        allData: rowData,
                        backgroundImage: Img
                    }
                })
            }
        }
    }


    _renderRow(rowData, rowId,title) {
        let Img = global.common.fileurl.imgtravel + rowData.coverphotos[0];
        // console.log('_renderRow ',this.state.dataList[rowId].nickname)
        return (
            <TouchableOpacity activeOpacity={0.9}
                style={styles.listDataBtn}
                onPress={() => { this._goTravelNote(rowData, Img) }}
                key = {rowId}>
                <View style={{width:Width*.48,height:Width*.48,overflow:'hidden'}}>
                    {/*右上角row类型*/}
                    <View style={{position:"absolute",top:-Width*.08,right:-Width*.08,
                                    backgroundColor:rowData.category == 0 ? '#1596fe' : '#e4393c',
                                    width:Width*.16,height:Width*.16,zIndex:999,
                                    justifyContent:"center",alignItems:'center',
                                    transform:[{rotate:'45deg'}]}}>
                        <Text style={{transform:[{rotate:"-45deg"},{translateX:-Width*.035},{translateY:Width*.035}],color:'#fff',
                                        fontSize:12,backgroundColor:'transparent'}}>
                            {rowData.category == 0 ? '游记' : '随笔'}
                        </Text>
                    </View>
                    {/*<CacheImage envUrl={global.common.fileurl.imgtravel}
                                url={rowData.coverphotos[0]}
                                style={[styles.listDataImage,
                                        {position:'absolute',top:0,left:0}]}
                                resizeMode='cover' />*/}
                    <Image source={{uri:Img}} style={[styles.listDataImage,
                                        {position:'absolute',top:0,left:0}]}/>
                    <View style={styles.listDataText}>
                        <Text style={styles.listDataTextTitle}
                              numberOfLines={1}>{rowData.nickname}</Text>
                        {/*<View style={styles.listDataTextRow}>
                                {title == '打赏最多' ? 
                                    <View style={styles.listDataTextRowView}>
                                        <Image source={require('../img/dashang.png')}
                                            style={styles.listDataImageSmall} />
                                        <Text style={styles.listDataTextRowTexts}>{rowData.awards}</Text>
                                    </View>
                                  :
                                    <View style={styles.listDataTextRowView}>
                                        <Image source={require('../img/guankanshu.png')}
                                            style={styles.listDataImageSmall} />
                                        <Text style={styles.listDataTextRowTexts}>{rowData.views}</Text>
                                    </View>
                                }
                            <View style={styles.listDataTextRowView}>
                                <Image source={require('../img/dianzan.png')}
                                    style={styles.listDataImageSmall} />
                                <Text style={styles.listDataTextRowTexts}>{rowData.praise}</Text>
                            </View>
                        </View>*/}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _renderList(tabLabelTitle) {
        if (!this.state.changeView) {
            return (
                <View tabLabel={tabLabelTitle.toString()}>
                    <ListView contentContainerStyle={styles.listDataView}
                        dataSource={this.state.dataSource.cloneWithRows(this.state.dataList)}
                        renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId, tabLabelTitle)}
                        showsVerticalScrollIndicator={false}
                        initialListSize={4}
                        scrollEnabled={false}
                        enableEmptySections={true}
                        style={{ position: 'relative', bottom: 0 }} />
                </View>
            )
        } else {
            return (
                <View style={{flex:1,alignItems:'center',justifyContent:'center',
                                      backgroundColor:'#fff',width:Width,height:Height-120}}
                      tabLabel={tabLabelTitle.toString()}>
                    <Spinner style={styles.spinner}
                    isVisible={true}
                    size={100}
                    type={'ChasingDots'} color={'#1596fe'}/>
                </View>
            );
        }
    }
    _TopList() {
        let {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'Ranking',
                component: Ranking
            })
        }
    }
    goProduct() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'choosebg',
                component: choosebg,
                params: {
                    choosebg: false,
                    activity: false
                }
            })
        }
    }

    goActivity() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'choosebg',
                component: choosebg,
                params: {
                    choosebg: false,
                    activity: true
                }
            })
        }
    }

    goActivityBoss(data){
        console.log('点我',data);
        //应付老板
        const {navigator} = this.props;
        if(navigator){
            if(data.id){
                fetch(`${global.httpURL}group/item/${data.id}`).then(response=>response.json())
                .then(responseJson=>{
                    let list = responseJson.personlist;
                    let arr = [];
                    list.forEach(value => arr.push(value));
                    let canApply = true;
                    let isOpen = true;
                    if(responseJson.is_open == 0){
                        isOpen = false;
                    }
                    if(responseJson.deadline){
                        let time = new Date().getTime();
                        console.log(time);  
                        if(time >= parseInt(responseJson.deadline*1000)){
                            canApply = false;
                        }
                    }
                    console.log('点我',responseJson);
                    navigator.push({
                        name:'Productinfo',
                        component:Productinfo,
                        params:{
                            data:responseJson,
                            url:`${global.httpURL}static/group/${responseJson.id}/index.html?personNum=${arr.length}&personAll=${responseJson.total}&canApply=${canApply}&isOpen=${isOpen}&minPerson=${responseJson.min_person}`,
                            girlActivity:true
                        }
                    })
                })
            }else{
                this.goActivity();
            }
        }
        /**/
    }

    _goSearchView() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'searchView',
                component: SearchView
            })
        }
    }

    _goMessageCenter() {
        const {navigator} = this.props;
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

    _renderActivity(){
        let activityList = global.activity.list;
        let arr=[];
        if(activityList){
            for(var key of activityList){
                console.log(key.url);
                console.log('_renderActivity',key)
                arr.push(
                    <TouchableOpacity activeOpacity={1}
                        onPress={this.goActivityBoss.bind(this,key)}
                        key = {arr.length}>
                        <View>
                            <Image source={{ uri: key.url }}
                                style={{
                                    width: Width, height: Width * 0.5,
                                    resizeMode: 'cover'
                                }} />
                        </View>
                    </TouchableOpacity>
                )
            }
            return arr;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*头部导航栏*/}
                <NavBar title={'TheBlue'}
                    statusbarShow={false} />
                <View style={styles.searchView}>
                    <TouchableOpacity activeOpacity={1}
                        onPress={this._goSearchView.bind(this)}>
                        <View style={styles.search}>
                            {/*搜索框内部结构*/}
                            <Image source={require('../img/search.png')}
                                style={styles.searchImage} />
                            <Text style={styles.searchText}>TheBlue/游记/蓝友</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.message}>
                        <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this._goMessageCenter.bind(this)}>
                            <MaterialIcons name='message' size={40} color='#fff' style={{paddingRight:20}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={styles.Scroll}
                    keyboardDismissMode='on-drag'
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            onRefresh={this._onTopRefresh.bind(this)}
                            colors={['#1596fe', '#e4393c']}/>
                    }
                    scrollEnabled={true}>
                    {!this.state.load ?
                        <View>
                            <Swiper autoplay={true}
                                autoplayTimeout={4}
                                height={Width * 0.5}
                                width={Width}
                                dot={<View style={{ backgroundColor: 'rgba(0,0,0,.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />}
                                activeDot={<View style={{ backgroundColor: '#ddd', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}>
                                {this._renderActivity.bind(this)()}
                            </Swiper>
                            {/*Toplist*/}
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                <View style={styles.TopList}>
                                    <TouchableOpacity activeOpacity={0.5}
                                        onPress={() => { this.goProduct() }}>
                                        <View style={styles.TopListView}>
                                            <Image source={require('../img/product.png')} style={styles.TopListImage} />
                                            <Text style={styles.TopListText}>假日优选</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.5}
                                        onPress={this._TopList.bind(this)}>
                                        <View style={styles.TopListView}>
                                            <Image source={require('../img/ranking.png')} style={styles.TopListImage} />
                                            <Text style={styles.TopListText}>排行榜</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.5}
                                        onPress={() => { this.goActivity() }}>
                                        <View style={[styles.TopListView, { borderRightWidth: 0 }]}>
                                            <Image source={require('../img/app.png')} style={styles.TopListImage} />
                                            <Text style={styles.TopListText}>活动专区</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                            <View style={styles.row}>
                                {/*<ScrollableTabView locked={true}
                                    tabBarUnderlineStyle={{ backgroundColor: '#1596fe' }}
                                    tabBarBackgroundColor='#FFFFFF'
                                    tabBarActiveTextColor='#1596fe'
                                    tabBarInactiveTextColor='rgba(0,0,0,.7)'
                                    tabBarTextStyle={{ fontSize: 17,fontWeight:'normal' }}
                                    onChangeTab={(obj) => {
                                        this._loadData(obj.i+1)
                                    }}
                                    scrollWithoutAnimation={true}> 
                                    {this._renderList('小编推荐')}
                                    this._renderList('观看最多')
                                    this._renderList('打赏最多')
                                    this._renderList('最新发布')
                                </ScrollableTabView>*/}
                                {this._renderList('小编推荐')}
                            </View>
                        </View>
                      :
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',
                                      backgroundColor:'#fff',width:Width,height:Height-120}}>
                            <Spinner style={styles.spinner}
                            isVisible={true}
                            size={100}
                            type={'ChasingDots'} color={'#1596fe'}/>
                        </View>
                        
                    }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor:'#ddd'
    },
    //搜索导航栏
    searchView: {
        height: 40,
        backgroundColor: '#1596fe',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    spinner: {
        marginBottom: 50
    },
    search: {
        width: Width * 0.65,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    searchImage: {
        height: 28,
        width: 28,
        resizeMode: 'cover'
    },
    searchText: {
        color: 'rgba(0,0,0,.3)',
        fontSize: 16,
        marginLeft: Width * 0.01,
        backgroundColor:'transparent'
    },
    message: {
        justifyContent: 'center',
        marginLeft: 5
    },
    //底层scroll
    Scroll: {
        flex: 1
    },
    //轮播图
    swiperImage: {

    },
    //主面
    row: {
        flex: 1,
        marginTop: 5
    },
    TopList: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    TopListView: {
        width: Width * 0.34,
        height:Width*.085,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,.5)',
    },
    TopListImage: {
        width: Width * 0.08,
        height: Width * 0.08,
        resizeMode: 'cover',
        marginRight: Width * 0.01,
    },
    TopListText: {
        fontSize: 16,
        color:'#000',
        backgroundColor:'transparent'
    },
    //listView
    listDataView: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingLeft: Width * 0.015,
        paddingRight: Width * 0.015
    },
    listDataBtn: {
        width: Width * 0.48,
        height: Width * 0.48,
        marginBottom: 5
    },
    listDataImage: {
        width: Width * 0.48,
        height: Width * 0.48,
        resizeMode: 'cover'
    },
    listDataImageSmall: {
        width: Width * 0.05,
        height: Width * 0.05,
        marginRight: Width * 0.01
    },
    listDataText: {
        backgroundColor:'rgba(0,0,0,.7)',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    listDataTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listDataTextRowView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listDataTextTitle: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: 'transparent',
        width:Width*.48,
        marginLeft:Width*.02
    },
    listDataTextRowTexts: {
        color: '#fff',
        backgroundColor: 'transparent'
    }
})