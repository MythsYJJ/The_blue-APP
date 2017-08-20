import React,{Component,PropTypes} from 'react';
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
    TouchableHighlight
} from 'react-native';
import NavBar from '../component/navbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyAttention from './myattention';
// import MyFans from './myfans';
// import BlackList from './blacklist';
import AttentionList from './attention_list';
import CustomSync from '../sync';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
//关注页面
export default class Attention extends React.Component{

    constructor(props){
        super(props);
        this.state={
            listdata:[]

        }
        this.loadFollowList(this.props.listidx)
    }
    render(){
        let who = this.props.sex == 1 ? '他' : '她'
        return (
            <View style={styles.container}>
                <NavBar title={this.props.guanzhu?'关注':(this.props.showblack?'谁看过我':`谁看过${who}`)}
                    leftitemvisible={this.props.guanzhuback}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                {this.getView()}
            </View>
        )
    }
    getView()
    {
        let who = this.props.sex == 1 ? '他' : '她'
        if(this.props.guanzhu)
        {
            return(

                <ScrollableTabView locked={true}
                    tabBarUnderlineStyle={{ backgroundColor: '#1596fe' }}
                    tabBarBackgroundColor='#FFFFFF'
                    tabBarActiveTextColor='#1596fe'
                    tabBarInactiveTextColor='rgba(0,0,0,.7)'
                    tabBarTextStyle={{ fontSize: 17,fontWeight:'normal' }}
                    initialPage={this.props.listidx}
                    onChangeTab={(obj) => {
                        console.log(obj.i);
                        this.loadFollowList(obj.i)
                        this.props.listidx = obj.i
                    }}>
                    <MyAttention tabLabel={this.props.showblack?'我的关注':`${who}的关注`} 
                    listtype={0} navigator={this.props.navigator} listdata={this.state.listdata} 
                    titlename={this.props.showblack?'您目前关注的人数':`${who}目前关注的人数`} showblack={this.props.showblack}/>
                    <MyAttention tabLabel={this.props.showblack?'我的粉丝':`${who}的粉丝`} 
                    listtype={1} navigator={this.props.navigator} listdata={this.state.listdata} 
                    titlename={this.props.showblack?'目前关注您的人数':`${who}目前关注的人数`} showblack={this.props.showblack}/>
                    {this.props.showblack ? <MyAttention tabLabel='我的黑名单' 
                    listtype={2} navigator={this.props.navigator} listdata={this.state.listdata} 
                    titlename={'目前被您拉黑的人数'} showblack={this.props.showblack}/>:null}
                </ScrollableTabView>)
        }
        else
        {
            return (
                <ScrollableTabView locked={true} renderTabBar={false}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={styles.Name}>{'累计来访人数' + this.state.listdata.length}</Text>
                        </View>
                        <AttentionList listtype={0} navigator={this.props.navigator} listdata={this.state.listdata} showblack={this.props.showblack}/>
                    </View>
                </ScrollableTabView>)
        }
    }
    backView() {
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    async loadFollowList(idx) {
        console.log(this.props.showblack)
        let sessionID = global.sessionID;
        // this.setState({ sessionID: sessionID, envi: environmentVariable });
        if (this.props.guanzhu) {
            if (idx != 2) {
                let responseJson = await CustomSync.fetch(this,global.httpURL + 'follow/'
                    + '?sid=' + sessionID
                    + '&fans=' + idx
                    + '&userid=' + this.props.userId);
                let data = responseJson.data ? responseJson.data : []
                console.log(data)
                this.setState({ listdata: data })
                // console.log(this.props.listtype)
            }
            else {
                let responseJson = await CustomSync.fetch(this,global.httpURL + 'ignoreusers/'
                    + '?sid=' + sessionID);
                let data = responseJson.data ? responseJson.data : []
                console.log(data)
                this.setState({ listdata: data })
            }
        }
        else
        {
            console.log(global.httpURL + 'accesslog/1/'+this.props.userId+'/'
                    + '?sid=' + sessionID
                    + '&num=' + 20)
             let responseJson = await CustomSync.fetch(this,global.httpURL + 'accesslog/1/'
                    +this.props.userId+'/'
                    + '?sid=' + sessionID
                    + '&num=' + 20); //策划需求是显示20条

                let data = responseJson.data ? responseJson.data : []
                console.log(data)
                this.setState({ listdata: data })
        }
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:"#fff"
    },
      Name:{
        fontSize:18,
        paddingLeft:3,
        backgroundColor:'transparent'
        // marginLeft: 5
    },
})