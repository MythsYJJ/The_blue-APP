import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    ListView,
    RefreshControl,
    Modal,
    BackAndroid,
    Platform,
    Alert
} from 'react-native';
import NavBar from '../../component/navbar';
import {toastShort} from '../../Toast/ToastUtil';
import PersonalCenter from '../personalCenter';
import Comment from '../Youquan/comment';
import LikeList from '../Youji/like_list';
import CacheImage from '../../component/cacheImage';
import ImageViewer from 'react-native-image-zoom-viewer';
import CustomSync from '../../sync';
import Report from '../Youji/report';
var WeChat=require('react-native-wechat');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

var Back = require('../../img/back.png');
var images = [];

export default class SuibiContent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            listData:[],
            modalVisible:false,
            isSelf:false,
            ipraised:this.props.userinfo.ipraised
        }
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        if(!this.state.warningShow){
            this.onClickBack();
            return true;
        }
        return false;
    };

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillMount() {
       this.loadDssays(this.props.id);
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    async loadDssays(id)
    {
        try {
            images = [];
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'essays/' + id
                + '?sid=' + global.sessionID);
            if (responseJson.status == 1) {
                console.log(responseJson);
                await this.setState({listData:responseJson.data})
                if(responseJson.data.userid == global.userInformation.userid){
                    this.setState({
                        isSelf:true,
                    })
                }
                if (this.state.listData.coverphotos) {
                    for (var key in this.state.listData.coverphotos) {
                        images.push({ url: global.common.fileurl.imgtravel + this.state.listData.coverphotos[key] });
                    }
                }
            }
        } catch (err) {
            console.log(err)
            toastShort(err)
        }
    }

    setModalVisible(visible, index) {
        console.log(images,index);
        this.setState({
            swiperIndex: index,
            modalVisible: visible,
        },function(){console.log(images[this.state.swiperIndex])});
    }

    renderItem(){
        if(this.state.listData.coverphotos)
        {
            return this.state.listData.coverphotos.map((item, i) => this._renderImageList(item, i))
        }
        
    //    return images.map((item, i) => this._renderImageList(item, i))
    }

    _renderImageList(item,i){
        return(
            <TouchableHighlight style={{width:Width*0.25,height:Width*0.25,margin:3,
                                    alignItems:'center',justifyContent:'center'}}
                            underlayColor = {'#ddd'}
                            onPress={()=>{this.setModalVisible(true,i)}}
                            key={i}>
                <Image
                        source={{uri:global.common.fileurl.imgtravel+item}}
                        resizeMode={'cover'}
                        style={{width:Width*0.24,height:Width*0.24}}
                    />
                {/*<CacheImage envUrl={global.common.fileurl.imgtravel}
                            url={item.uri}
                            style={{width:Width*0.24,height:Width*0.24}}
                            resizeMode='cover' />*/}
            </TouchableHighlight>
        )
    }
    //举报
    goReport(){
        console.log('举报')
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                name:'Report',
                component:Report,
                params:{
                    notesid:this.props.id
                }
            })
        }
    }

    goComment(){
        const {navigator}=this.props;
        console.log('随笔数据',this.state.suibiData)
        if(navigator){
            navigator.push({
                name:'Comment',
                component:Comment,
                params:{
                    suibi:this.props.id,
                    suibiData:this.state.listData
                }
            })
        }
    }
    goLikeList(){
        const {navigator}=this.props;
        if(navigator && this.props){
            navigator.push({
                name:'LikeList',
                component:LikeList,
                params:{
                    travelID:this.props.id,
                }
            })
        }
    }
    onClickBack()
    {
        const {navigator} = this.props;
        if(navigator){
            if(this.props.viewtye == 1)
            {
                var routes = navigator.state.routeStack;
                for (var i = routes.length - 1; i >= 0; i--) {
                    if (routes[i].name === "Main") {
                        var destinationRoute = navigator.getCurrentRoutes()[i]
                        navigator.popToRoute(destinationRoute);
                    }
                }
                return
            }
            if(this.props.viewtye == 2){
                navigator.pop();
                return
            }
        }
    }
    getTime(data) {
        data = new Date(data * 1000);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        return year + '-' + month + '-' + date;
    }
     async clickLike() {
        if(this.state.ipraised){
            //取消点赞
            let responseJson = await CustomSync.fetch(this,global.httpURL+'praise/1/'+this.props.id+'/0','POST',
                                                        {'Content-Type': 'application/x-www-form-urlencoded'},
                                                        'sid='+global.sessionID);
            // console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    ipraised: false
                });
                toastShort('取消成功');
            }
           
        }else{
            //点赞
            let responseJson = await CustomSync.fetch(this,global.httpURL+'praise/1/'+this.props.id+'/1','POST',
                                                         {'Content-Type': 'application/x-www-form-urlencoded'},
                                                         'sid='+global.sessionID)
            console.log('点赞',global.sessionID)
            /*let response = await fetch(global.httpURL+'praise/1/'+youjiData.id+'/1',{
                method:'POST',
                body:'sid='+global.sessionID
            })
            let responseJson = await response.json();*/
            // console.log(responseJson);
            if (responseJson.status == 1) {
                this.setState({
                    ipraised: true
                });
                toastShort('点赞成功')
            }
            
        }

    }
    async deleteSuibi()
    {
        Alert.alert('提示','是否确认删除随笔？',[{text:'确认删除',onPress:async ()=>{
            try {
                let responseJson = await CustomSync.fetch(this,
                                                            global.httpURL +
                                                            'essays/' +
                                                            this.props.id +
                                                            '?sid=' +
                                                            global.sessionID,
                                                            'DELETE');
                    if(responseJson.status == 1)
                    {
                        global.updateSuibi = true;
                        this.onClickBack()
                    }
            } catch (err) {
                console.log(err)
                toastShort(err)
            }
        }},{text:'取消',onPress:()=>{}}])
        
    }

    _goPerson(){
        let userid = this.state.listData.userid;
        console.log('跳转',this.state.listData.userid);
        if(userid){
            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    name: 'PersonalCenter',
                    component: PersonalCenter,
                    params: {
                        navigator: navigator,
                        userId: userid,
                    }
                })
            }
        }
    }

    render(){
        return(
            <View style={styles.container}>
                {/*<NavBar title={''}
                        rightItemTitle={'删除'}
                        rightTextColor={'#fff'}
                        rightItemFunc={()=>{}}
                        leftItemFunc={()=>{}}
                        leftImageSource={Back}/>*/}
                <View style={styles.moreImageNavbar}>
                    {/*左边返回*/}
                    {
                        this.state.editMode ?
                            <View/>
                            :
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <TouchableOpacity onPress={this.onClickBack.bind(this)}>
                                    <Image source={Back} style={{height:22,resizeMode:'contain'}}/>
                                </TouchableOpacity>
                            </View>
                    }
                    {/*右边多图*/}
                    { this.state.isSelf ?
                        <View style={{
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'center'}}>
                            <TouchableOpacity onPress={this.deleteSuibi.bind(this)}>
                                <Text style={{color:'#fff',fontSize:18,backgroundColor:'transparent'}}>删除</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'space-between'}}>
                            <TouchableOpacity activeOpacity={0.8}
                                                onPress={this.goReport.bind(this)}>
                                <Image source={require('../../img/youji/blacklist.png')}
                                        style={styles.moreImage}/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={() => {
                                    WeChat.isWXAppInstalled()
                                    .then(async (isInstalled) => {
                                        if (isInstalled) {
                                            try{
                                                if(global.wechatIn){
                                                    let result = await WeChat.shareToSession({  
                                                            title:'Theblue_APP 旅行必备',
                                                            description: this.state.listData.content,
                                                            thumbImage: global.common.fileurl.imgtravel+this.state.listData.coverphotos[0],
                                                            type: 'news',
                                                            webpageUrl: global.httpURL+'static/DownloadAPP/'});
                                                    console.log(result);
                                                }else{
                                                    if(!global.wechatIn){
                                                        if(Platform.OS == 'ios') {
                                                            WeChat.registerApp(global.wechatIos).then(res=>{
                                                                global.wechatIn = true;
                                                            });
                                                        } else {
                                                            WeChat.registerApp(global.wechatAndroid).then(res=>{
                                                                global.wechatIn = true;
                                                            });
                                                        }
                                                    }
                                                    toastShort('网络异常，请稍后尝试')
                                                }
                                            }catch(err){
                                                console.log(err)
                                            }
                                        } else {
                                            toastShort('没有安装微信软件，请您安装微信之后再试');
                                        }
                                    })}}>
                                <Image source={require('../../img/youji/relay.png')}
                                        style={styles.moreImage}/>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                <ScrollView style={{flex:1}}>
                    {/*头部*/}
                    <View style={{width:Width, flexDirection: 'column'}}>
                        <View style={{width:Width, flexDirection: 'row',marginTop:10}}>
                            <View style={{paddingLeft:5,width:Width*0.25,alignSelf:'center'}}>
                                <TouchableOpacity onPress={this._goPerson.bind(this)}>
                                    {/*<Image
                                        source={Back}
                                        resizeMode={'cover'} 
                                        style={{width:Width*.15,height:Width*.15,borderRadius:Width*.075,
                                                alignSelf:'center', borderWidth:2, borderColor:'#eee'}}
                                    />*/}
                                    <CacheImage cacheType='head'
                                                envUrl={global.common.fileurl.imgavatar}
                                                url={this.props.userinfo.avatar}
                                                style={{width:75,height:75,borderRadius:38,
                                                        alignSelf:'center', borderWidth:2, borderColor:'#eee'}}
                                                resizeMode='cover' />
                                </TouchableOpacity>
                            </View>
                            <View style={{width:Width*0.7,flexDirection: 'column', alignSelf:'center', paddingLeft:Width*.02,height:Width*.12,
                                            justifyContent:'space-between'}}>
                                <Text style={{fontSize:18, fontWeight: 'bold',backgroundColor:'transparent'}}
                                    onPress={()=>{}}
                                >
                                    {this.props.userinfo.nickname}
                                </Text>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={{backgroundColor:'transparent'}}>{/*粉丝:{this.props.userinfo.befollowed}*/}       </Text>
                                    <Text style={{backgroundColor:'transparent'}}>{this.getTime(this.state.listData.lastupdatetime)}</Text>
                                </View>
                            </View>
                        </View>
                        {/*<View style={{width:Width,flexDirection: 'row',justifyContent:'space-around',borderBottomWidth:5,borderColor:'#ddd',paddingLeft:10, paddingBottom: 10, paddingTop:10}}>
                            <Text style={styles.text_content}>
                                点赞：{this.state.listData.praise}
                            </Text>
                            <Text style={styles.text_content}>
                                评论：{this.state.listData.comments}
                            </Text>
                            <Text style={styles.text_content}>
                                图片数：
                                {this.state.listData.coverphotos?this.state.listData.coverphotos.length:0}
                            </Text>
                        </View>*/}
                        <View style={{width:Width*.95,alignSelf:'center',padding:10}}>
                            <Text style={{backgroundColor:'transparent'}}>
                               {this.state.listData?this.state.listData.content:''}
                            </Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',flexWrap:'wrap',alignSelf:'center',padding:10,
                                    }}>
                        {this.renderItem()}
                    </View>
                    <View style={{flexDirection:"row",width:Width*.9,alignSelf:'center',paddingTop:20,
                                    borderTopWidth:2,borderColor:'#ddd'}}>
                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                            onPress={this.goComment.bind(this)}
                                            style={styles.bottomBtn}>
                            <Text style={styles.bottomBtnText}>评论</Text>
                        </TouchableHighlight>
                        {
                            this.state.isSelf ?
                                <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                                    onPress={this.goLikeList.bind(this)}
                                                    style={styles.bottomBtn}>
                                    <Text style={styles.bottomBtnText}>谁赞过我</Text>
                                </TouchableHighlight>
                              :
                                <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                                    onPress={this.clickLike.bind(this)}
                                                    style={styles.bottomBtn}>
                                    <Text style={styles.bottomBtnText}>{!this.state.ipraised?'点赞':'取消点赞'}</Text>
                                </TouchableHighlight>
                        }
                    </View>
                </ScrollView>
                {/*modal*/}
                <Modal
                  animationType={"slide"}
                  transparent={false}
                  visible={this.state.modalVisible}
                  onRequestClose={()=>{
                    this.setState({
                        modalVisible:false
                    })
                  }}>
                  <ImageViewer imageUrls={images}
                               index={this.state.swiperIndex}
                               onClick={() => {
                                this.setModalVisible(false,0)
                               }}
                               failImageSource={'../../img/default_photo.png'}
                  />
                </Modal>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center'
    },
    text_content: {
        fontSize: 12,
        color:'#555',
        backgroundColor:'transparent'
    },
    moreImageNavbar:{width:Width,
        height:70,
        paddingTop:20,
        paddingLeft:10,
        paddingRight:15,
        backgroundColor:'#1596fe',
        flexDirection:'row',
        justifyContent:"space-between"
    },
    moreImage:{
        width:Width*0.1,
        resizeMode:'contain'
    },
    bottomBtn:{
        height:Height*.04,
        width:Width*.21,
        backgroundColor:'#1596fe',
        marginRight:Width*.05,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
    },
    bottomBtnText:{
        fontSize:16,
        color:'#fff',
        backgroundColor:'transparent'
    }
})