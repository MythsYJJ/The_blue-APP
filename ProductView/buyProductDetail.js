import React, { Component, PropTypes } from 'react';
import {
    View,
    WebView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    RefreshControl,
    TouchableHighlight,
    ScrollView,
    TextInput,
    Modal,
    Alert,
    TouchableNativeFeedback
} from 'react-native';

import NavBar from '../component/navbar';
import CustomSync from '../sync';
import LoadingView from '../component/loadingView';
import PaymentUtil from '../Utils/paymentUtil';
import Product from './Product';
var Spinner = require('react-native-spinkit');

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');

export default class BuyProductDetail extends React.Component {
    constructor(props){
        super(props);
        this.state={
            data:null,
            productData:null,
            showmodel:false,
            payUrl:''
        }
    }

    componentWillMount(){
        console.log('id',this.props.id);
        if(this.props.data){
            console.log('订单详情页',this.props.data)
            this.setState({
                data:this.props.data
            })
        }
        this._loadData();
    }

    _loadData(){
        fetch(`${global.httpURL}group/item/${this.props.data.productid}`).then(response=>response.json())
            .then(responseJson=>{
                console.log(responseJson);
                this.setState({
                    productData:responseJson
                })
            })
    }

    backView(){
        const {navigator}=this.props;
        if(navigator){
            if(this.props.signUp){
                navigator.push({
                    name:'Product',
                    component:Product,
                    params:{

                    }
                })
            }else{
                navigator.pop();
            }
        }
    }

    async _gopay(){
        let responseJson = await CustomSync.fetch(this,`${global.httpURL}payagain/${this.state.data.id}`);
        console.log(responseJson)
        if(responseJson.url){
            this.setState({
                showmodel:true,
                payUrl:responseJson.url
            })
        }
    }

    async goAlipay() {
        try{
            let result = await PaymentUtil.AlipayByUrl('recharge', 'params', this.state.payUrl);
            if (result.status == 1) {
                //转换状态
                let data = this.state.data;
                data.status = 1;
                this.setState({
                    data:data,
                    showmodel:false
                })
                global.updateProductList = true;
            }else{
                if(result.msg){
                    Alert.alert(result.msg);
                }
            }
        }catch(err){
            Alert.alert('',JSON.stringify(err));
        }
    }

    render(){
        if(this.state.data && this.state.productData){
            let girlImg = `${global.httpURL}static/group/${this.state.productData.id}/girl.jpg`;
            return(
                <View style={{flex:1,backgroundColor:'#fff'}}>
                    <NavBar title={'订单详情'}
                        rightItemvisible={false}
                        leftitemvisible={true}
                        leftItemFunc={this.backView.bind(this)}
                        leftImageSource={Back}
                    />
                    <ScrollView>
                    {/*头部*/}
                    <View style={[styles.container,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                        <Image source={require('../img/1.jpg')} style={{width:Width*.3,height:Width*.3,resizeMode:'cover'}}/>
                        <View style={{height:Width*.2,width:Width*.6,justifyContent:'space-between',marginBottom:Width*.05}}>
                            <Text style={{color:'#000',fontSize:18,backgroundColor:'transparent'}}>
                                {this.props.id == 4 ? this.state.productData.desc : this.state.data.desc}
                            </Text>
                            <Text style={{backgroundColor:'transparent'}}>订单编号：{this.state.data.id}</Text>
                            <Text style={{color:'#e4393c',fontSize:16,backgroundColor:'transparent'}}>
                                度假费用：&yen;{this.props.id == 4 ? 
                                                this.state.data.is_bill == 1 ? 
                                                    this.state.productData.deposit_bill 
                                                  : 
                                                    this.state.productData.deposit 
                                            :
                                                this.state.data.totalprice}
                                {this.props.id == 4 ?
                                    this.state.data.is_bill == 1 ?
                                        <Text style={{color:'#999',fontSize:14,alignSelf:'center',backgroundColor:'transparent'}}>
                                            (含发票)
                                        </Text>
                                    :
                                        <Text style={{color:'#999',fontSize:14,alignSelf:'center',backgroundColor:'transparent'}}>
                                            (不含发票)
                                        </Text>
                                :
                                    <View/>
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={styles.hrline}/>
                    {/*开团信息*/}
                    {this.props.id == 4 ?
                        <View style={[styles.container]}>
                            <Text style={{fontSize:24,color:'#1596fe',backgroundColor:'transparent'}}>开团信息</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center'}}>
                                <View style={{width:Width*.63,justifyContent:'center'}}>
                                    <View style={styles.marginView}>
                                        <Text style={styles.normalText}>度假地点：</Text>
                                        <Text style={[styles.normalText,{color:'#000'}]}>{this.state.productData.location}</Text>
                                    </View>
                                    <View style={styles.marginView}>
                                        <Text style={styles.normalText}>度假时间：</Text>
                                        <Text style={[styles.normalText,{color:'#000'}]}>
                                            {this.state.productData.time1}至{this.state.productData.time2}
                                        </Text>
                                    </View>
                                    {/*<View style={[styles.marginView,{flexDirection:'row'}]}>
                                        <Text style={styles.normalText}>度假费用：</Text>
                                        <View>
                                            <Text style={[styles.normalText,{color:'#e4393c'}]}>
                                                {this.state.productData.price}RMB
                                            </Text>
                                            <Text style={[styles.normalText,{alignSelf:"flex-end",textDecorationLine:'line-through'}]}>
                                                {this.state.productData.oldprice}RMB
                                            </Text>
                                        </View>
                                    </View>*/}
                                </View>
                                <View style={{alignItems:'center'}}>
                                    <Image source={{uri:girlImg}} style={{width:Width*.35,height:Width*.35,resizeMode:'contain'}}/>
                                    <Text style={[styles.normalText,{marginTop:5}]}>
                                        带团主播：
                                        <Text style={{color:'#fc49ad',fontWeight:'bold',backgroundColor:'transparent'}}>{this.state.productData.girl}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                      :
                        <View/>
                    }
                    <View style={styles.hrline}/>
                    {/*联系方式*/}
                    <View style={styles.container}>
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLine,{color:'#000',fontSize:18}]}>
                                联系人：{this.state.data.contact}
                            </Text>
                        </View>
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLine,{color:'#000',fontSize:18}]}>
                                手机号：{this.state.data.phone}
                            </Text>
                        </View>
                        {this.state.data.identity ?
                            <View style={styles.marginView}>
                                <Text style={[styles.normalText,styles.columnLine,{color:'#000',fontSize:18}]}>
                                    身份证：{this.state.data.identity}
                                </Text>
                            </View>
                          :<View/>}
                        {this.state.data.mail ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                邮箱：{this.state.data.mail}
                            </Text>
                        </View>
                            :<View/>}
                        {this.state.data.emergencycontact ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                紧急联系人：{this.state.data.emergencycontact}
                            </Text>
                        </View>
                            :<View/>}
                        {this.state.data.emergencyphone ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                紧联人电话：{this.state.data.emergencyphone}
                            </Text>
                        </View>
                            :<View/>}
                        {this.state.data.bill_name ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                发票抬头：{this.state.data.bill_name}
                            </Text>
                        </View>
                            :<View/>}
                        {this.state.data.receiver ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                收件人：{this.state.data.receiver}
                            </Text>
                        </View>
                            :<View/>}
                        {this.state.data.receiver_phone ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                联系电话：{this.state.data.receiver_phone}
                            </Text>
                        </View>
                            :<View/>}
                        {this.state.data.address ? 
                        <View style={styles.marginView}>
                            <Text style={[styles.normalText,styles.columnLineBlue,{color:'#000',fontSize:18}]}>
                                收件地址：{this.state.data.address}
                            </Text>
                        </View>
                            :<View/>}
                    </View>
                    {/*客服*/}
                    <View style={styles.hrline}/>                
                    <View style={styles.container}>
                        <Text style={[styles.normalText,{color:'#000'}]}>THE BLUE客服电话：</Text>
                        <View style={{alignSelf:'center',flexDirection:'row',justifyContent:"space-between",width:Width*.95,
                                        alignItems:'center'}}>
                            <Text style={{backgroundColor:'transparent'}}>工作时间9:00-24:00</Text>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Image source={require('../img/locate.png')}/>
                                <Text style={{color:"#000",backgroundColor:'transparent'}}>021-55960957-862</Text>
                            </View>
                        </View>
                    </View>
                    </ScrollView>
                    {this.state.data.status == 0 && this.props.id ?
                        <TouchableNativeFeedback 
                                                 onPress={this._gopay.bind(this)}
                                                 background={TouchableNativeFeedback.SelectableBackground()}>
                            <View style={{width:Width,height:40,alignItems:'center',justifyContent:'center',backgroundColor:'#1596fe'}}>
                                <Text style={{fontSize:16,color:'#fff',backgroundColor:'transparent'}}>确认付款</Text>
                            </View>
                        </TouchableNativeFeedback>
                      :
                        <View/>
                    }
                    <Modal animationType='fade'
                            transparent={true}
                            visible={this.state.showmodel}
                            onRequestClose={()=>{this.setState({showmodel:!this.state.showmodel})}}>
                            <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,.3)'}}
                                            onPress={()=>{this.setState({showmodel:!this.state.showmodel})}}
                                            activeOpacity={1}>
                                <TouchableOpacity style={{width:Width,height:Height*.6,position:'absolute',bottom:0,
                                            left:0,backgroundColor:'#fff',
                                            borderTopLeftRadius:5,borderTopRightRadius:5,
                                            paddingTop:20}}
                                            onPress={()=>{this.setState({showmodel:true})}}
                                            activeOpacity={1}>
                                    <Text onPress={()=>{this.setState({showmodel:!this.state.showmodel})}}
                                        style={{color:'#999',fontSize:40,position:'absolute',
                                                top:-13,right:5,zIndex:100,backgroundColor:'transparent'}}>
                                        &times;
                                    </Text>
                                    <View style={{width:Width*.95,alignSelf:'center'}}>
                                        <Text style={{color:'#1596fe',fontSize:20,
                                                    textAlignVertical:'center',fontWeight:'bold',backgroundColor:'transparent'}}>
                                            {this.state.data.desc}
                                        </Text>
                                        <View style={{flexDirection:'row',width:Width*.9,alignSelf:'center',
                                                    marginTop:20}}>
                                            <Image source={require('../img/1.jpg')}
                                                style={{resizeMode:'cover',
                                                        width:Width*.22,height:Width*.22}}/>
                                            <View style={{justifyContent:'space-between',
                                                        marginLeft:Width*.05,paddingTop:5}}>
                                                <Text style={{textAlign:'right',backgroundColor:'transparent'}}>
                                                    订单编号：{this.state.data.id}
                                                </Text>
                                                {this.props.id == 4 ? 
                                                    <View/>
                                                :
                                                    <Text style={{backgroundColor:'transparent'}}>
                                                        预定数量：
                                                        <Text style={{color:'#F90',fontWeight:'bold',
                                                                    fontSize:16,backgroundColor:'transparent'}}>
                                                            {this.state.data.amount}
                                                        </Text>
                                                    </Text>
                                                }
                                                <Text style={{color:'#00F',backgroundColor:'transparent'}}>
                                                    {'联系人：'+this.state.data.contact}
                                                </Text>
                                                <Text style={{color:'#00F',backgroundColor:'transparent'}}>
                                                    {'手机号：'+this.state.data.phone}
                                                </Text>
                                                {this.props.id == 4 ?
                                                    <Text style={{color:'#00F',backgroundColor:'transparent'}}>
                                                        {'身份证：'+this.state.data.identity}
                                                    </Text>
                                                  :
                                                    <View/>
                                                }
                                            </View>
                                        </View>
                                        <Text style={{alignSelf:'flex-end',marginTop:5,marginBottom:5,color:'#e4393c',backgroundColor:'transparent'}}>
                                            度假费用：
                                            <Text style={{fontWeight:'bold',fontSize:16,backgroundColor:'transparent'}}>
                                                &yen;{this.props.id == 4 ? this.state.productData.deposit : this.state.data.totalprice}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={{width:Width*.95,alignSelf:'center'}}>
                                        <Text style={{color:'#222',fontSize:18,marginLeft:Width*.05,
                                                    marginTop:10,marginBottom:5,backgroundColor:'transparent'}}>
                                            请选择付款方式
                                        </Text>
                                        <View style={{width:Width*.9,height:1,alignSelf:'center',
                                                    backgroundColor:'#ddd'}}/>
                                        <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                                        onPress={()=>{this.goAlipay()}}>
                                            <View style={{flexDirection:'row',borderTopWidth:1,
                                                        borderBottomWidth:1,borderColor:'#ddd',
                                                        padding:5,
                                                        paddingLeft:Width*.05,paddingRight:Width*.05}}>
                                                <Image source={require('../img/u1420.png')}
                                                    style={{resizeMode:'contain',width:Width*.1,
                                                            height:Width*.1}}/>
                                                <Text style={{textAlignVertical:'center',fontSize:16,
                                                            marginLeft:Width*.01,backgroundColor:'transparent'}}>
                                                    支付宝
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                        <View/>
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Modal>
                </View>
            )
        }else{
            return(
                <View style={{flex:1,alignItems:'center',justifyContent:'center',
                                    backgroundColor:'#fff'}}>
                    <Spinner style={{}}
                    isVisible={true}
                    size={100}
                    type={'ChasingDots'} color={'#1596fe'}/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        width:Width*.95,
        alignSelf:'center',
        paddingTop:10,
        paddingBottom:15
    },
    hrline:{
        width:Width,
        height:5,
        backgroundColor:'#ddd'
    },
    normalText:{
        fontSize:16,
        backgroundColor:'transparent'
    },
    marginView:{
        marginTop:8,
        marginBottom:8
    },
    columnLine:{
        borderLeftWidth:Width*.01,
        borderColor:'rgba(255, 153, 0, 0.9)',
        paddingLeft:Width*.03
    },
    columnLineBlue:{
        borderLeftWidth:Width*.01,
        borderColor:'rgba(21, 150, 254, 0.9)',
        paddingLeft:Width*.03
    }
})