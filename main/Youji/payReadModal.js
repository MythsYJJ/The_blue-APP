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
    Alert
} from 'react-native';
import NavBar from '../../component/navbar';
import {toastShort} from '../../Toast/ToastUtil';
import LinearGradient from 'react-native-linear-gradient';
import Recharge from '../recharge';
import CustomSync from '../../sync';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../../img/back.png');
var ticket = require('../../img/youji/u505.png');

export default class PayReadModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            indexAllData:this.props.indexAllData
        }
    }

    _goRecharge(){
        let {navigator} = this.props;
        this.props.cancelBtn();
        if(navigator){
            navigator.push({
                name:'Recharge',
                component:Recharge
            })
        }
    }

    async _payYouji(){
        if(this.state.indexAllData){
            try{
                let URL = global.httpURL
                                + 'travelnotes/'
                                + this.state.indexAllData.id
                                + '/purchase?sid=' + global.sessionID;
                let responseJson = await CustomSync.fetch(this,URL);
                console.log(responseJson)
                if(responseJson.status == 1){
                    let money = this.state.indexAllData.unitprice;
                    global.userInformation.coins -= money;
                    await CustomSync.setObjectForKey('userInformation', global.userInformation);
                    await this.props.loadXingchengList(this.state.indexAllData.id);
                    this.props.cancelBtn();
                    Alert.alert('','购买成功')
                }else{
                    Alert.alert('','购买失败')
                }
            }catch(err){console.log(err)}
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <LinearGradient style={styles.modalView}
                                colors={['rgba(21, 150, 254, 1)', 'rgba(21, 150, 254, 1)', '#fff']}
                                start={{x:0.0,y:0.0}}
                                end={{x:0.0,y:0.18}}
                                locations={[0,0.1,0.8]}>
                    {/*大皮膏*/}
                    <TouchableOpacity onPress={this.props.cancelBtn}
                                      style={styles.cancelBtn}
                                      activeOpacity={0.7}>
                        <Text style={styles.cancel}>&times;</Text>
                    </TouchableOpacity>
                    {/*modalView*/}
                    <Text style={styles.modalTitle}>付费阅读</Text>
                    <View style={styles.hrView}/>
                    <View style={styles.modalMainView}>
                        <Text style={styles.mainText}>该用户设置了付费功能。</Text>
                        <View style={styles.payInfor}>
                            <Text style={styles.payInforText}>查看之后的行程需支付</Text>
                            <View style={styles.payNumView}>
                                <Text style={styles.payNum}>{this.state.indexAllData.unitprice}</Text>
                                <Image source={ticket}
                                       style={styles.ticketImage}/>
                            </View>
                        </View>
                    </View>
                    <View style={styles.hrView}/>
                    <TouchableOpacity onPress={this._payYouji.bind(this)}
                                      activeOpacity={0.7}
                                      style={styles.payBtnView}>
                            <Text style={styles.payBtnText}>确认支付</Text>
                    </TouchableOpacity>
                    <View style={styles.hrView}/>
                    <View style={styles.myTicketView}>
                        <View style={styles.myTicket}>
                            <Image source={ticket} style={styles.ticketImage}/>
                            <Text style={styles.myTicketText}>
                                我的现金券：
                                <Text style={styles.myTicketNum}>{global.userInformation.coins}</Text>
                            </Text>
                        </View>
                        <TouchableOpacity onPress={this._goRecharge.bind(this)}
                                          activeOpacity={0.7}
                                          style={styles.payMoreView}>
                                <Text style={styles.payMoreText}>+&nbsp;充值</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,.5)',
        justifyContent:'center',
        alignItems:'center'
    },
    cancelBtn:{
        position:'absolute',
        top:-15,
        right:5,
    },
    cancel:{
        color:'#fff',
        fontSize:40,
        backgroundColor:'transparent'
    },
    modalView:{
        width:Width*0.8,
        backgroundColor:'#fff',
        borderRadius:10,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:5,
        paddingBottom:10
    },
    modalTitle:{
        color:'rgba(0,0,0,0.8)',
        fontSize:20,
        alignSelf:'center',
        backgroundColor:'transparent'
    },
    hrView:{
        height:1,
        backgroundColor:'#000',
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
        margin:15,
        backgroundColor:'transparent'
    },
    payInfor:{
        alignItems:"center"
    },
    payInforText:{
        fontSize:21,
        backgroundColor:'transparent'
    },
    payNumView:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5
    },
    payNum:{
        fontSize:18,
        color:'#FFCC00',
        fontWeight:'bold',
        backgroundColor:'transparent'
    },
    ticketImage:{
        width:Width*0.08,
        height:Width*0.08,
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
        fontSize:18,
        backgroundColor:'transparent'
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
        color:'#333',
        backgroundColor:'transparent'
    },
    myTicketNum:{
        color:'#FF9900',
        fontWeight:'bold',
        fontSize:18,
        backgroundColor:'transparent'
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
        fontWeight:'bold',
        backgroundColor:'transparent'
    }
})