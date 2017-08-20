import React,{Component,PropTypes} from 'react';
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
    TouchableNativeFeedback,
    Alert
} from 'react-native';
import NavBar from '../../component/navbar';
import Button from '../../component/button';
import {toastShort} from '../../Toast/ToastUtil';
import LinearGradient from 'react-native-linear-gradient';
import CustomSync from '../../sync';
import Recharge from '../recharge';
import Register from '../../login/register';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var ticket = require('../../img/youji/u505.png');
var shoes = require('../../img/youji/u1841.png');
var moto = require('../../img/youji/u1843.png');
var car = require('../../img/youji/u1845.png');
var ship = require('../../img/youji/u1847.png');
var airplane = require('../../img/youji/u1839.png');
var isGrant = true;

export default class GrantModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            indexAllData:this.props.indexAllData,
            grant:this.props.grant,
            userInfo:global.userInformation
        }
    }

    async _getGrant(){
        let URL = global.httpURL + 'rewardrank/1/'
                    + this.props.indexAllData.id
                    + '?sid=' + global.sessionID
                    + '&num=1';
        let responseJson = await CustomSync.fetch(this,URL);
        if(responseJson.status == 1 && responseJson.data){
            this.setState({
                grant:responseJson.data[0]
            })
            console.log('打赏modal',responseJson.data[0])
        }
    }

    componentWillMount(){
        if(this.props.grant){
            return;
        }
        this._getGrant();
    }

    async _Grant(type){
        try{
            if(isGrant){
                isGrant = false;
                let money;
                switch(type){
                    case 1:
                        money = 1;
                        break;
                    case 2:
                        money = 30;
                        break;
                    case 3:
                        money = 100;
                        break;
                    case 4:
                        money = 500;
                        break;
                    case 5:
                        money = 1000;
                        break;
                    default:
                        money = 0;
                }
                if(global.userInformation.coins < money){
                    toastShort('现金券不足，土豪快充值吧')
                    isGrant = true;
                    return;
                }
                if(global.userInformation.coins == 0){
                    toastShort('现金券不足，土豪快充值吧')
                    return
                }
                console.log(global.common);
                let URL = global.httpURL + 'travelnotes/'
                            + this.state.indexAllData.id
                            + '/reward?sid=' + global.sessionID
                            + '&gift=' + type
                            + '&num=1';
                console.log(URL)
                let responseJson = await CustomSync.fetch(this,URL);
                if(responseJson.status == 1){
                    console.log(responseJson)
                    let indexAllData = this.state.indexAllData;
                    indexAllData.awards += money;
                    global.userInformation.coins -= money;
                    await CustomSync.setObjectForKey('userInformation', global.userInformation);
                    this.setState({
                        indexAllData:indexAllData,
                        userInfo:global.userInformation
                    },()=>{
                        this.props.setData(indexAllData);
                        isGrant = true;
                        Alert.alert('','打赏成功');
                    })
                }else{
                    toastShort('打赏失败，请重试')
                }
            }
        }catch(err){console.log(err)}
    }

    _goRecharge(){
        let {navigator} = this.props;
        if(navigator){
            this.props.cancelBtn();
            navigator.push({
                name:'Recharge',
                component:Recharge
            })
        }
    }

    render(){
        let grant = this.state.grant;
        return (
            <View style={styles.container}>
                <LinearGradient style={styles.modalView}
                                colors={['rgba(21, 150, 254, 1)', 'rgba(21, 150, 254, 1)', '#fff']}
                                start={{x:0.0,y:0.0}}
                                end={{x:0.0,y:0.22}}
                                locations={[0,0.1,0.8]}>
                    {/*大皮膏*/}
                    <TouchableOpacity onPress={this.props.cancelBtn}
                                      style={styles.cancelBtn}
                                      activeOpacity={0.7}>
                        <Text style={styles.cancel}>&times;</Text>
                    </TouchableOpacity>
                    {/*modalView*/}
                    <Text style={styles.modalTitle}>打赏</Text>
                    <View style={styles.hrView}/>
                    {/*随机语*/}
                    <Text style={styles.randomText}>
                        我知道我能威胁的都是爱我的人，所以，爱我就给我
                    </Text>
                    <View style={styles.hrView}/>
                    {/*top one*/}
                    {this.state.grant ?
                        <View>
                            <View style={styles.topOneView}>
                                <Image source={require('../../img/ranking/1.png')}
                                       style={styles.topOneImage}/>
                                <View style={styles.headImageView}>
                                    <Image source={{uri:global.common.fileurl.imgavatar+grant.avatar}}
                                           style={styles.headImage}/>
                                </View>
                                <View style={styles.topOneTextView}>
                                    <Text style={styles.topOneName}>{grant.nickname}</Text>
                                    <View style={styles.mainTextView}>
                                        <Text style={{color:'rgba(0,0,0,0.8)',fontSize:15,backgroundColor:'transparent'}}>
                                            累计打赏：
                                        </Text>
                                        <Text style={[styles.coinText,{color:'#eb6350'}]}>{grant.num}</Text>
                                        <Image source={require('../../img/youji/u505.png')}
                                               style={styles.ticketImage_s}/>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.hrView}/>
                        </View>
                      :
                        <View>
                            <View style={styles.topOneView}>
                                <Text style={{color:'#222',fontSize:15,fontWeight:'bold',textAlign:'center',backgroundColor:'transparent'}}>
                                    还没有人为TA打过赏，看来top1的宝座非你莫属了
                                </Text>
                            </View>
                            <View style={styles.hrView}/>
                        </View>
                    }
                    <View style={styles.priceContent}>
                        <TouchableHighlight onPress={this._Grant.bind(this,1)}
                                            underlayColor={'rgba(0,0,0,.2)'}>
                            <Image style={styles.shopItem} source={shoes}/>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this._Grant.bind(this,2)}
                                            underlayColor={'rgba(0,0,0,.2)'}>
                            <Image style={styles.shopItem} source={moto}/>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this._Grant.bind(this,3)}
                                            underlayColor={'rgba(0,0,0,.2)'}>
                            <Image style={styles.shopItem} source={car}/>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this._Grant.bind(this,4)}
                                            underlayColor={'rgba(0,0,0,.2)'}>
                            <Image style={styles.shopItem} source={ship}/>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this._Grant.bind(this,5)}
                                            underlayColor={'rgba(0,0,0,.2)'}>
                            <Image style={styles.shopItem} source={airplane}/>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.hrView}/>
                    <View style={styles.spaceBetweenGrant}>
                        <Text style={styles.selfTotalGrantDesc}>您累计打赏:</Text>
                        <View style={styles.coinContent}>
                            <Text style={[styles.coinText,{color:'#d07000'}]}>{this.state.indexAllData.awards}</Text>
                            <Image
                                source={ticket}
                                style={styles.ticketImage_s}
                            />
                        </View>
                    </View>
                    <View style={styles.hrView}/>
                    <View style={[styles.spaceBetweenGrant,{marginBottom:10}]}>
                        <View style={styles.coinContent}>
                            <Image 
                                source={ticket}
                                resizeMode={'cover'}
                                style={styles.ticketImage}
                            />
                            <Text style={{color:'rgba(0,0,0,0.8)',fontSize:15,backgroundColor:'transparent'}}>我的现金券:</Text>
                            <Text style={styles.coinText}>{this.state.userInfo ? this.state.userInfo.coins : '0'}</Text>
                        </View>
                        <Button text='+ 充值'
                                color='#fff'
                                backgroundColor='#ff5353'
                                width={Width*0.15}
                                height={Width*0.06}
                                click={this._goRecharge.bind(this)}/>
                    </View>
                </LinearGradient>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,.5)'
    },
    cancelBtn:{
        position:'absolute',
        top:-13,
        right:5,
    },
    cancel:{
        color:'#fff',
        fontSize:40,
        backgroundColor:'transparent'
    },
    modalView:{
        width:Width*0.9,
        backgroundColor:'#fff',
        borderRadius:10,
        paddingLeft:10,
        paddingRight:10,
        alignSelf:'center',
        marginBottom:Height*0.1
    },
    modalTitle:{
        color:'rgba(0,0,0,0.8)',
        fontSize:22,
        marginTop:10,
        alignSelf:'center',
        backgroundColor:'transparent'
    },
    hrView:{
        height:1,
        backgroundColor:'#555',
        marginTop:10,
        marginBottom:10
    },
    modalMainView:{
        flexDirection:'column',
        alignItems:'center',
    },
    mainText:{
        fontSize:16,
        color:'#333',
        margin:15
    },
    payInfor:{
        alignItems:"center"
    },
    payInforText:{
        fontSize:21
    },
    payNumView:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5
    },
    payNum:{
        fontSize:18,
        color:'#FFCC00',
        fontWeight:'bold'
    },
    ticketImage:{
        width:Width*0.08,
        height:Width*0.08,
        resizeMode:'contain'
    },
    ticketImage_s:{
        width:Width*0.06,
        height:Width*0.06,
        resizeMode:'contain'
    },
    payBtnView:{
        width:Width*0.32,
        backgroundColor:'#1596fe',
        alignSelf:'center',
        height:Height*0.065,
        justifyContent:"center",
        alignItems:'center',
        borderRadius:5,
        marginTop:10,
        marginBottom:10
    },
    payBtnText:{
        color:'#fff',
        fontSize:18
    },
    myTicketView:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    myTicket:{
        flexDirection:"row",
        alignItems:'center'
    },
    myTicketText:{
        fontSize:16,
        color:'#333'
    },
    myTicketNum:{
        color:'#FF9900',
        fontWeight:'bold',
        fontSize:18
    },
    payMoreView:{
        backgroundColor:'#e4393c',
        width:Width*0.2,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:5
    },
    payMoreText:{
        fontSize:17,
        color:'#fff',
        fontWeight:'bold'
    },
    spaceBetweenGrant:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    selfTotalGrantDesc:{
        fontSize:16,
        backgroundColor:'transparent'
    },
    coinContent:{
        flexDirection:'row',
        alignItems:'center'
    },
    coinText:{
        fontSize:20,
        fontWeight:'bold',
        color:'#ffcd31',
        paddingLeft:5,
        alignSelf:'center',
        backgroundColor:'transparent'
    },
    priceContent:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    shopItem:{
        width:Width*0.15,
        height:Width*0.15,
        resizeMode:'contain'
    },
    //TOP1
    topOneView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:Width*0.05,
        paddingRight:Width*0.05,
        paddingTop:Width*0.01,
        marginTop:5,
        marginBottom:5,
    },
    topOneImage:{
        resizeMode:'contain',
        width:Width*0.1,
        height:Width*0.1,
        position:'absolute',
        top:0,
        left:0,
        zIndex:100
    },
    topOneName:{
        fontSize:20,
        color:'#333',
        backgroundColor:'transparent'
    },
    headImageView:{
        width:Width*0.18,
        height:Width*0.18,
        borderRadius:Width*0.09,
    },
    headImage:{
        resizeMode:'cover',
        width:Width*0.18,
        height:Width*0.18,
        borderRadius:Width*0.09,
    },
    topOneTextView:{
        justifyContent:'space-between',
        width:Width*0.58,
        height:Width*0.18,
        marginLeft:Width*0.02
    },
    mainTextView:{
        flexDirection:'row',
        justifyContent:"flex-end",
        alignItems:'center'
    },
    //随机语
    randomText:{
        textAlign:'center',
        alignSelf:'center',
        width:Width*0.8,
        fontSize:16,
        color:'#ce0e43',
        fontWeight:'bold',
        backgroundColor:'transparent'
    }
})