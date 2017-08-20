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
    TouchableWithoutFeedback,
    StatusBar
} from 'react-native';
import { CheckBox,Radio } from 'native-base';

import NavBar from '../component/navbar';
import PaymentUtil from '../Utils/paymentUtil';
import CustomSync from '../sync';
import Product from './Product';
import Clause from './clause';
import SettingsList from 'react-native-settings-list';
import BuyProductDetail from './buyProductDetail';
import PersonalCenter from '../main/personalCenter';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
var Deposit = 5000;
var timeList = ['09:00-12:00','12:00-14:00','14:00-18:00','随时可拨打']

export default class BuyProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showmodel: false,
            showmodel1:false,
            pronum: 1,
            phone: '',
            contact: '',
            listdata: [],
            alipapyurl: '',
            confirm:true,
            selectIndex:3,
            contactTime:timeList[3],
            mail:'',
            emergencyContact:'',
            emergencyPhone:'',
            identity:'',
            isBill:false,
            billName:'',
            receiver:'',
            receiverPhone:'',
            address:'',
            promotionCode:'',
            isPromotionCode:false,
            ProSucc:false,
            disCount:0
        }
    }

    componentWillMount() {
        if(this.props.data){
            console.log(this.props.data)
        }
    }

    backView() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop()
        }
    }

    async goPay() {
        if(!this.state.confirm){
            Alert.alert('','请阅读预定须知和重要条款后确认订单');
            return
        }
        if(!this.state.phone){
            Alert.alert('','请输入您的手机号码');
            return
        }
        if(this.state.phone && this.state.phone.length !== 11){
            Alert.alert('','手机号码格式不正确');
            return
        }
        if(this.state.emergencyPhone && this.state.emergencyPhone.length !== 11){
            Alert.alert('','紧联人手机号码格式不正确');
            return
        }
        if(!this.state.contact){
            Alert.alert('','请输入联系人姓名');
            return
        }
        if(!this.state.identity){
            Alert.alert('','请输入您的身份证号码');
            return
        }
        if(this.state.identity.length !== 18){
            Alert.alert('','身份证号码格式不正确');
            return
        }
        if(this.state.mail){
            var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!filter.test(this.state.mail)){
                Alert.alert('','电子邮箱格式不正确');
                return
            }
        }
        if(this.state.isBill){
            if(!this.state.billName){
                Alert.alert('','发票抬头不能为空')
                return
            }
            if(!this.state.receiver){
                Alert.alert('','收件人不能为空')
                return
            }
            if(!this.state.receiverPhone){
                Alert.alert('','联系电话不能为空')
                return
            }
            if(!this.state.address){
                Alert.alert('','收件地址不能为空')
                return
            }
        }
        if(!this.props.buyProduct){
            this.setState({
                postOrder:true
            })
            let params = 'sid=' + global.sessionID + '&productid=' + this.props.data.id
                + '&buytype=' + '0' + '&category=' + '1' + '&amount=' + this.state.pronum
                + '&contact=' + this.state.contact + '&phone=' + this.state.phone
            console.log(params)
            try {
                let responseJson = await CustomSync.fetch(this, global.httpURL + 'pay', 'POST', {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }, params);
                console.log(responseJson)
                if (responseJson.status == 1) {
                    // alert('成功购买')
                    await this.setState({ showmodel: !this.state.showmodel, listdata: responseJson.order, alipapyurl: responseJson.url,postOrder:false })
                    // await CustomSync.setObjectForKey('userInformation', this.state.userInformation);
                }
            } catch (err) {
                console.log(err)
            }
        }else{
            this.setState({
                postOrder:false
            })
            console.log('用户输入mail',this.state.mail)
            let params = 'sid=' + global.sessionID +
                        '&id=' + this.props.data.id + 
                        '&buytype=0&category=1&amount=1&contact=' + this.state.contact +
                        '&phone=' + this.state.phone + 
                        '&identity=' + this.state.identity + 
                        '&contacttime=' + this.state.contactTime + 
                        '&mail=' + this.state.mail + 
                        '&emergencycontact=' + this.state.emergencyContact + 
                        '&emergencyphone=' + this.state.emergencyPhone +
                        '&isbill=' + this.state.isBill +
                        '&billname=' + this.state.billName +
                        '&receiver=' + this.state.receiver +
                        '&receiverphone=' + this.state.receiverPhone +
                        '&address=' + this.state.address + 
                        '&coupon_code=' + this.state.promotionCode ;
            let responseJson = await CustomSync.fetch(this,`${global.httpURL}group/buy`,'POST',{'Content-Type':'application/x-www-form-urlencoded'},params);
            if(responseJson.status == 1){
                console.log(responseJson);
                this.setState({ showmodel: !this.state.showmodel, listdata: responseJson.order, alipapyurl: responseJson.url,postOrder:false });
            }
        }
    }

    async _alipayCallback(bool){
        if(bool){
            //转跳已购买的产品
            const {navigator} = this.props;
            if(navigator){
                let id = this.state.listdata.id.substr(0,1);
                let data = this.state.listdata;
                data.status = 1;
                navigator.push({
                    name:'BuyProductDetail',
                    component:BuyProductDetail,
                    params:{
                        data:data,
                        id:id,
                        signUp:true
                    }
                })
            }
        }else{
            //回到主页
            let routes = navigator.state.routeStack;
            for (var i = routes.length - 1; i >= 0; i--) {
                if (routes[i].name === "Main") {
                    var destinationRoute = navigator.getCurrentRoutes()[i]
                    navigator.popToRoute(destinationRoute);
                }
            }
            return
        }
    }

    async goAlipay() {
        try{
            let result = await PaymentUtil.AlipayByUrl('recharge', 'params', this.state.alipapyurl);
            if (result.status == 1) {
                await this.setState({showmodel:false});
                Alert.alert('提示','支付成功;\n届时将由客服向您致电确认，请保持手机畅通',[
                    {text:'查看订单',onPress:()=>{this._alipayCallback(true)}},
                    {text:'返回主页',onPress:()=>{this._alipayCallback(false)}}
                ])
            }else{
                if(result.msg){
                    Alert.alert('',result.msg);
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    _confirm(){
        let con = this.state.confirm;
        this.setState({
            confirm:!con
        })
    }
    _goClause(){
        /*跳转*/
        const {navigator} = this.props;
        if(navigator){
            this.setState({
                confirm:!this.state.confirm
            })
            navigator.push({
                name:'Clause',
                component:Clause
            })
        }
    }

    _chooseTime(){
        let show = this.state.showmodel1;
        this.setState({
            showmodel1:!show
        })
    }

    _timeList(){
        let renderList = [];
        timeList.forEach((value,index)=>{
            renderList.push(
                <SettingsList.Item
                    key={index}
                    hasNavArrow={false}
                    title={value}
                    titleInfo={index == this.state.selectIndex ? '已选择' : ''}
                    titleInfoStyle={{}}
                    onPress={() => this.setState({ selectIndex: index,showmodel1:!this.state.showmodel1,contactTime:value })}
                />
            )
        })
        return renderList
    }

    _confirmBill(num){
        this.setState({
            isBill:num
        })
    }

    _getUsers(){
        console.log(this.props.data);
        let arr = [] ;
        let list = this.props.data.personlist;
        list.forEach((value,index)=>{
            return arr.push(this._getUsersRow(value,index));
        })
        for(let i=arr.length;i<this.props.data.total;i++){
            arr.push(<Image source={require('../img/default_head.png')} style={{resizeMode:"cover",width:Width*.16,height:Width*.16,borderRadius:Width*.08}}
                        key={i}/>)
        }
        return arr;
    }

    _getUsersRow(value,index){
        console.log(value);
        let Img = global.common.fileurl.imgavatar + value.avatar;
        console.log(Img);
        return (
            <TouchableOpacity onPress={this._goPersonalCenter.bind(this,value)} key={index} activeOpacity={.8}>
                <Image source={{uri:Img}} style={{resizeMode:"cover",width:Width*.16,height:Width*.16,borderRadius:Width*.08}}/>
            </TouchableOpacity>
        )
    }

    _goPersonalCenter(value){
        const {navigator} = this.props;
        if(navigator){
            navigator.push({
                name:'PersonalCenter',
                component:PersonalCenter,
                params:{
                    userId:value.userid
                }
            })
        }
    }

    _checkPromotion(){
        console.log('校验优惠码');
        if(this.props.data.coupons){
            let coupons = this.props.data.coupons;
            console.log(this.state.promotionCode);
            if(!this.state.promotionCode){
                this.setState({
                    isPromotionCode:false,
                    ProSucc:false,
                    disCount:0
                })
                return
            }
            if(coupons[this.state.promotionCode] && (coupons[this.state.promotionCode].code = this.state.promotionCode)){
                this.setState({
                    isPromotionCode:true,
                    ProSucc:true,
                    disCount:coupons[this.state.promotionCode].discount
                })
            }else{
                this.setState({
                    isPromotionCode:true,
                    ProSucc:false,
                    disCount:0
                })
            };
        }
        console.log('校验后',this.state.ProSucc,this.state.disCount);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar hidden={false}/>
                <NavBar title={'产品购买'}
                    rightItemvisible={false}
                    leftitemvisible={true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                <ScrollView style={{ flex: 1, backgroundColor: '#ddd' }}>
                    {!this.props.buyProduct ? 
                        /*假日优选*/
                        <View style={{ padding: 5, backgroundColor: '#fff' }}>
                            <View style={{
                                width: Width * .96, flexDirection: 'row',
                                alignItems: 'center', padding: 5
                            }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1596FE',backgroundColor:'transparent' }}>
                                    {this.props.data.name}
                                </Text>
                            </View>
                            <View style={{
                                width: Width * .96, height: 1,
                                backgroundColor: '#ddd', alignSelf: 'center'
                            }} />
                            <View style={{ marginTop: 10 }}>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        联系人
                                        <Text style={{ color: '#999', fontSize: 14,backgroundColor:'transparent' }}>
                                            (限6字)
                                        </Text>
                                        ：
                                    </Text>
                                    <View style={styles.TextInputView}>
                                        <TextInput style={styles.TextInput}
                                                onChangeText={(text) => { this.setState({contact:text}) }}
                                                underlineColorAndroid={'transparent'}
                                                maxLength={6}
                                                textAlignVertical={'center'}/>
                                    </View>
                                    <Text style={styles.InputWarning}>
                                        必填
                                    </Text>
                                </View>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        手机号：
                                    </Text>
                                    <View style={styles.TextInputView}>
                                        <TextInput style={styles.TextInput}
                                                onChangeText={(text) => { this.setState({phone:text}) }}
                                                underlineColorAndroid={'transparent'}
                                                maxLength={11}
                                                textAlignVertical={'center'}
                                                keyboardType={'numeric'}/>
                                    </View>
                                    <Text style={styles.InputWarning}>
                                        必填
                                    </Text>
                                </View>
                                <Text style={{width:Width*.96,textAlignVertical:'center',
                                            marginBottom:10,alignSelf:'center',marginTop:10,backgroundColor:'transparent'}}>
                                    在收到您的订单后我们会主动与您取得联系
                                </Text>
                                <View style={styles.payForView}>
                                    <Text style={{fontSize:17,color:'#222',backgroundColor:'transparent'}}>
                                        预定数量：
                                    </Text>
                                    <View style={{flexDirection:'row',justifyContent:'center',
                                                alignItems:'center',width:Width*.35}}>
                                        <View style={{flexDirection:"row",
                                                    alignItems:'center'}}>
                                            <Text onPress={()=>{
                                                    this.state.pronum>1?
                                                        this.setState({pronum:this.state.pronum-1})
                                                    :
                                                        this.setState({pronum:1})}}
                                                style={{fontSize:22,color:'#222',
                                                        padding:3,fontWeight:'bold',backgroundColor:'transparent'}}>
                                                -
                                            </Text>
                                            <Text style={{fontSize:17,borderWidth:1,
                                                        color:'#222',borderColor:'#ddd',
                                                        paddingTop:5,paddingBottom:5,
                                                        paddingLeft:Width*.05,paddingRight:Width*.05,
                                                        marginLeft:Width*.01,marginRight:Width*.01,backgroundColor:'transparent'}}>
                                                {this.state.pronum}
                                            </Text>
                                            <Text onPress={()=>{
                                                    this.state.pronum<20?
                                                        this.setState({pronum:this.state.pronum+1})
                                                    :
                                                        this.setState({pronum:20})}}
                                                style={{fontSize:20,color:'#222',
                                                        padding:3,backgroundColor:'transparent'}}>
                                                +
                                            </Text>
                                        </View>
                                        <Text style={{fontSize:17,color:'#222',marginLeft:Width*.01,backgroundColor:'transparent'}}>
                                            套
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.payForView}>
                                    <Text style={{fontSize:17,color:'#222',backgroundColor:'transparent'}}>
                                        度假费用：
                                    </Text>
                                    <Text style={{width:Width*.35,textAlign:'center',textAlignVertical:'center',
                                                fontSize:20,fontWeight:'bold',color:'#F90',backgroundColor:'transparent'}}>
                                        {'￥'+Deposit*this.state.pronum}
                                    </Text>
                                </View>
                            </View>
                        </View>
                      :
                        <View style={{padding:5,backgroundColor:'#fff'}}>
                            <View style={{
                                width: Width * .96, padding: 5
                            }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1596FE',marginBottom:10,backgroundColor:'transparent' }}>
                                    {this.props.data.desc}
                                </Text>
                                <Text style={{marginBottom:5,backgroundColor:'transparent'}}>度假地点：{this.props.data.location}</Text>
                                <Text style={{marginBottom:5,backgroundColor:'transparent'}}>度假时间：{this.props.data.time1}至{this.props.data.time2}</Text>
                            </View>
                            <View style={{
                                width: Width * .96, height: 1,
                                backgroundColor: '#ddd', alignSelf: 'center'
                            }} />
                            {/*参与人数头像*/}
                            {/*<View style={{width:Width*.94,alignSelf:'center',flexWrap:'wrap',flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                                            marginTop:20,marginBottom:20}}>
                                {this._getUsers()}
                            </View>*/}
                            <View style={{
                                width: Width * .96, height: 1,
                                backgroundColor: '#ddd', alignSelf: 'center'
                            }} />
                            <View style={{ width:Width*.96,alignSelf:'center' }}>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                        联系人：
                                    </Text>
                                    <View style={styles.underLineInput}>
                                        <TextInput style={styles.TextInput}
                                                onChangeText={(text) => { this.setState({contact:text}) }}
                                                underlineColorAndroid={'transparent'}
                                                maxLength={8}
                                                textAlignVertical={'center'}/>
                                    </View>
                                </View>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                        手机号：
                                    </Text>
                                    <View style={styles.underLineInput}>
                                        <TextInput style={styles.TextInput}
                                                onChangeText={(text) => { this.setState({phone:text}) }}
                                                underlineColorAndroid={'transparent'}
                                                maxLength={11}
                                                textAlignVertical={'center'}
                                                keyboardType={'numeric'}/>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.InputView}
                                                  activeOpacity={1}
                                                  onPress={this._chooseTime.bind(this)}>
                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                                                    width:Width*.9,alignSelf:'center'}}>
                                        <Text style={styles.InputTitle}>选择方便联系时段：</Text>
                                        <Text style={{width:Width*.6,textAlign:'center',textDecorationLine:'underline',fontSize:16,backgroundColor:'transparent'}}>
                                            {timeList[this.state.selectIndex]}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                        身份证：
                                    </Text>
                                    <View style={styles.underLineInput}>
                                        <TextInput style={styles.TextInput}
                                                    onChangeText={(text) => { this.setState({identity:text}) }}
                                                    underlineColorAndroid={'transparent'}
                                                    maxLength={18}
                                                    textAlignVertical={'center'}
                                                    keyboardType={'numeric'}/>
                                    </View>
                                </View>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        常用邮箱：
                                    </Text>
                                    <View style={styles.underLineInput}>
                                        <TextInput style={styles.TextInput}
                                                    onChangeText={(text) => { this.setState({mail:text}) }}
                                                    underlineColorAndroid={'transparent'}
                                                    maxLength={30}
                                                    textAlignVertical={'center'}
                                                    keyboardType={'email-address'}/>
                                    </View>
                                </View>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        紧急联系人：
                                    </Text>
                                    <View style={styles.underLineInput}>
                                        <TextInput style={styles.TextInput}
                                                    onChangeText={(text) => { this.setState({emergencyContact:text}) }}
                                                    underlineColorAndroid={'transparent'}
                                                    maxLength={11}
                                                    textAlignVertical={'center'}
                                                    keyboardType={'default'}/>
                                    </View>
                                </View>
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        紧联人电话：
                                    </Text>
                                    <View style={styles.underLineInput}>
                                        <TextInput style={styles.TextInput}
                                                    onChangeText={(text) => { this.setState({emergencyPhone:text}) }}
                                                    underlineColorAndroid={'transparent'}
                                                    maxLength={11}
                                                    textAlignVertical={'center'}
                                                    keyboardType={'numeric'}/>
                                    </View>
                                </View>
                                <Text style={{width:Width*.96,textAlignVertical:'center',
                                            marginBottom:10,alignSelf:'center',marginTop:15,color:'#e4393c',backgroundColor:'transparent'}}>
                                    带有 * 为必填项
                                </Text>
                                <Text style={{width:Width*.96,textAlignVertical:'center',
                                            marginBottom:10,alignSelf:'center',marginTop:10,backgroundColor:'transparent'}}>
                                    在收到您的订单后我们会主动与您取得联系
                                </Text>
                                <View style={styles.hrline}/>
                                {/*新增优惠码功能*/}
                                <View style={styles.InputView}>
                                    <Text style={styles.InputTitle}>
                                        优惠码：
                                    </Text>
                                    <View style={{flexDirection:"row",alignItems:'center'}}>
                                        <View style={styles.underLineInput}>
                                            <TextInput style={[styles.TextInput,{paddingRight:Width*.05}]}
                                                        onChangeText={(text) => { this.setState({promotionCode:text}) }}
                                                        underlineColorAndroid={'transparent'}
                                                        textAlignVertical={'center'}
                                                        keyboardType={'default'}
                                                        onEndEditing={this._checkPromotion.bind(this)}
                                                        onSubmitEditing={this._checkPromotion.bind(this)}
                                                        onBlur={this._checkPromotion.bind(this)}/>
                                        </View>
                                        {this.state.isPromotionCode ? 
                                            <FontAwesome name={this.state.ProSucc ? 'check' : 'close'} size={20} color={this.state.ProSucc ? 'rgba(112,220,37,1)' : '#e4393c'} style={{position:'absolute',right:0}}/> 
                                          :
                                            <View/>
                                        }
                                    </View>
                                </View>
                                <View style={styles.hrline}/>
                                <View style={{marginTop:10,marginLeft:Width*.1,flexDirection:'row',width:Width*.6,justifyContent:'space-between',alignItems:"center"}}>
                                    <TouchableWithoutFeedback onPress={this._confirmBill.bind(this,false)}>
                                        <View style={{flexDirection:"row",justifyContent:'center',alignItems:'center'}}>
                                            <Radio selected={!this.state.isBill}
                                                    onPress={this._confirmBill.bind(this,0)}/>
                                            <Text style={{marginLeft:Width*.01,backgroundColor:'transparent'}}>
                                                不需要发票
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={this._confirmBill.bind(this,1)}>
                                        <View style={{flexDirection:"row",justifyContent:'center',alignItems:'center'}}>
                                            <Radio selected={this.state.isBill}
                                                    onPress={this._confirmBill.bind(this,true)}/>
                                            <Text style={{marginLeft:Width*.01,backgroundColor:'transparent'}}>
                                                需要发票
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                {this.state.isBill ?
                                    <View>
                                        <View style={styles.InputView}>
                                            <Text style={styles.InputTitle}>
                                                <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                                发票抬头：
                                            </Text>
                                            <View style={styles.underLineInput}>
                                                <TextInput style={styles.TextInput}
                                                            onChangeText={(text) => { this.setState({billName:text}) }}
                                                            underlineColorAndroid={'transparent'}
                                                            maxLength={30}
                                                            textAlignVertical={'center'}
                                                            keyboardType={'default'}
                                                            value={this.state.billName}/>
                                            </View>
                                        </View>
                                        <View style={styles.InputView}>
                                            <Text style={styles.InputTitle}>
                                                <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                                收件人：
                                            </Text>
                                            <View style={styles.underLineInput}>
                                                <TextInput style={styles.TextInput}
                                                            onChangeText={(text) => { this.setState({receiver:text}) }}
                                                            underlineColorAndroid={'transparent'}
                                                            maxLength={15}
                                                            textAlignVertical={'center'}
                                                            keyboardType={'default'}
                                                            value={this.state.receiver}/>
                                            </View>
                                        </View>
                                        <View style={styles.InputView}>
                                            <Text style={styles.InputTitle}>
                                                <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                                联系电话：
                                            </Text>
                                            <View style={styles.underLineInput}>
                                                <TextInput style={styles.TextInput}
                                                            onChangeText={(text) => { this.setState({receiverPhone:text}) }}
                                                            underlineColorAndroid={'transparent'}
                                                            maxLength={11}
                                                            textAlignVertical={'center'}
                                                            keyboardType={'numeric'}
                                                            value={this.state.receiverPhone}/>
                                            </View>
                                        </View>
                                        <View style={styles.InputView}>
                                            <Text style={styles.InputTitle}>
                                                <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>* </Text>
                                                收件地址：
                                            </Text>
                                            <View style={styles.underLineInput}>
                                                <TextInput style={[styles.TextInput,{height:40}]}
                                                            onChangeText={(text) => { this.setState({address:text}) }}
                                                            underlineColorAndroid={'transparent'}
                                                            maxLength={100}
                                                            multiline={true}
                                                            textAlignVertical={'center'}
                                                            keyboardType={'default'}
                                                            value={this.state.address}/>
                                            </View>
                                        </View>
                                        <View style={styles.hrline}/>
                                    </View>
                                  :
                                    <View/>
                                }
                                <View style={{marginTop:10  }}>
                                    <Text style={styles.InputTitle}>费用明细：</Text>
                                    <View style={{marginTop:5}}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',width:Width*.96,alignItems:'center',margin:5}}>
                                            <Text style={{marginLeft:Width*.05,backgroundColor:'transparent'}}>
                                                套餐价
                                                {this.state.isBill ?
                                                    <Text style={{}}>(含发票)</Text>
                                                  :
                                                    <Text/>
                                                }
                                            </Text>
                                            <Text style={{backgroundColor:'transparent'}}>
                                                &yen;{this.state.isBill ? 
                                                        parseInt(this.props.data.deposit_bill)-parseInt(this.props.data.insurance_price) 
                                                      : 
                                                        this.props.data.price}
                                            </Text>
                                        </View>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',width:Width*.96,alignItems:'center',margin:5}}>
                                            <Text style={{marginLeft:Width*.05,backgroundColor:'transparent'}}>{this.props.data.insurance_name}</Text>
                                            <Text style={{backgroundColor:'transparent'}}>&yen;{this.props.data.insurance_price}</Text>
                                        </View>
                                        {this.state.ProSucc ?
                                            <View style={{flexDirection:'row',justifyContent:'space-between',width:Width*.96,alignItems:'center',margin:5}}>
                                                <Text style={{marginLeft:Width*.05,backgroundColor:'transparent',color:'#e4393c'}}>使用优惠码</Text>
                                                <Text style={{backgroundColor:'transparent',color:'#e4393c'}}>-&yen;{this.state.disCount}</Text>
                                            </View>
                                          :
                                            <View/>
                                        }
                                        <View style={{flexDirection:'row',justifyContent:'space-between',width:Width*.96,alignItems:'center',margin:5}}>
                                            <Text style={[styles.InputTitle,{marginLeft:Width*.05}]}>
                                                度假费用：
                                            </Text>
                                            <Text style={{fontSize:20,fontWeight:'bold',color:'#F90',backgroundColor:'transparent'}}>
                                                &yen;
                                                {
                                                    this.state.isBill ? 
                                                        this.state.ProSucc ? parseInt(this.props.data.deposit_bill)-parseInt(this.state.disCount) : this.props.data.deposit_bill 
                                                      : 
                                                        this.state.ProSucc ? parseInt(this.props.data.deposit)-parseInt(this.state.disCount) : this.props.data.deposit
                                                }
                                            </Text>
                                        </View>
                                        {this.state.isBill?
                                            <View style={{flexDirection:'row',justifyContent:'flex-end',width:Width*.96,alignItems:'flex-start',margin:5,marginTop:0,
                                                            position:'relative',top:-3}}>
                                                <Text style={{fontSize:14,fontWeight:'bold',color:'#999',backgroundColor:'transparent'}}>
                                                    (含发票)
                                                </Text>
                                            </View>
                                          :
                                            <View/>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{width:Width*.96,alignSelf:'center',marginTop:10}}>
                                <TouchableWithoutFeedback onPress={this._confirm.bind(this)}>
                                    <View style={{flexDirection:"row"}}>
                                        <CheckBox checked={this.state.confirm}
                                                onPress={this._confirm.bind(this)}/>
                                        <Text style={{backgroundColor:'transparent'}}>
                                            我已阅读并同意
                                            <Text onPress={this._goClause.bind(this)}
                                                style={{color:'#1596fe',backgroundColor:'transparent'}}
                                                textDecorationLine={'underline'}>
                                                预定须知和重要条款
                                            </Text>
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    }
                </ScrollView>
                <TouchableOpacity onPress={()=>{this.goPay()}}
                                  style={{width:Width,height:40,
                                          backgroundColor:'#1596fe',alignItems:'center',
                                          justifyContent:'center'}}
                                  disabled={this.state.postOrder ? true : false}>
                    <Text style={{textAlign:'center',textAlignVertical:'center',color:'#fff',
                                  fontSize:17,borderRadius:3,backgroundColor:'transparent'}}>
                        {!this.props.buyProduct ? '点击支付' : '确认订单'}
                    </Text>
                </TouchableOpacity>
                <Modal animationType='fade'
                       transparent={true}
                       visible={this.state.showmodel}
                       onRequestClose={()=>{this.setState({showmodel:!this.state.showmodel})}}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,.3)'}}
                                      onPress={()=>{
                                          //this.setState({showmodel:!this.state.showmodel})
                                      }}
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
                                    {this.props.data.desc}
                                </Text>
                                <View style={{flexDirection:'row',width:Width*.9,alignSelf:'center',
                                              marginTop:20}}>
                                    <Image source={require('../img/1.jpg')}
                                           style={{resizeMode:'cover',
                                                   width:Width*.22,height:Width*.22}}/>
                                    <View style={{justifyContent:'space-between',
                                                  marginLeft:Width*.05,paddingTop:5}}>
                                        <Text style={{textAlign:'right',backgroundColor:'transparent'}}>
                                            订单编号：{this.state.listdata.id}
                                        </Text>
                                        {!this.props.buyProduct ? 
                                            <Text style={{backgroundColor:'transparent'}}>
                                                预定数量：
                                                <Text style={{color:'#F90',fontWeight:'bold',
                                                            fontSize:16,backgroundColor:'transparent'}}>
                                                    {this.state.pronum}
                                                </Text>
                                            </Text>
                                          :
                                            <View/>
                                        }
                                        <Text style={{color:'#00F',backgroundColor:'transparent'}}>
                                            {'联系人：'+this.state.listdata.contact}
                                        </Text>
                                        <Text style={{color:'#00F',backgroundColor:'transparent'}}>
                                            {'手机号：'+this.state.listdata.phone}
                                        </Text>
                                        <Text style={{color:'#00F',backgroundColor:'transparent'}}>
                                            {'身份证：'+this.state.identity}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{alignSelf:'flex-end',marginTop:5,marginBottom:5,color:'#e4393c',backgroundColor:'transparent'}}>
                                    度假费用：
                                    <Text style={{fontWeight:'bold',fontSize:16,backgroundColor:'transparent'}}>
                                        &yen;{this.state.listdata.totalprice}
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
                <Modal animationType='fade'
                       transparent={true}
                       visible={this.state.showmodel1}
                       onRequestClose={()=>{}}>
                    <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,0,.3)',alignItems:'center',justifyContent:'center'}}
                                      onPress={()=>{this.setState({showmodel1:!this.state.showmodel1})}}
                                    activeOpacity={1}>
                        <View style={{width:Width*.8}}>
                            <Text style={{width:Width*.8,textAlign:'center',color:'#fff',paddingTop:10,paddingBottom:10,
                                            backgroundColor:'#1596fe',fontSize:18
                                        }}>
                                选择方便联系时间段
                            </Text>
                            <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                                {this._timeList()}
                            </SettingsList>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    InputView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        alignSelf:'center',
        width:Width*.96,
        borderColor:'#ddd',
        paddingTop:15,
        paddingBottom:15
    },
    hrline:{
        width:Width*.96,
        height:1,
        backgroundColor:"#ddd",
        marginTop:10,
        marginBottom:10
    },
    InputTitle:{
        textAlignVertical:'center',
        color:'#222',
        fontSize:17,
        width:Width*.36,
        backgroundColor:'transparent'
    },
    TextInputView:{
        borderWidth:1,
        borderColor:'#ddd',
        width:Width*.4,
    },
    underLineInput:{
        width:Width*.6,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        borderBottomWidth:1,
        borderColor:'rgba(0,0,0,.12)',
    },
    TextInput:{
        width:Width*.6,
        height:30,
        padding:0,
        paddingLeft:5,
        paddingRight:5,
        fontSize:15
    },
    InputWarning:{
        width:Width*.1,
        textAlign:'center',
        color:'#e4393c',
        fontSize:16,
        fontWeight:'bold',
        textAlignVertical:'center',
        backgroundColor:'transparent'
    },
    InputInfo:{
        width:Width*.1,
        textAlign:'center',
        color:'#1596fe',
        fontSize:16,
        fontWeight:'bold',
        textAlignVertical:'center'
    },
    payForView:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end',
        width:Width,
        marginTop:5,
        marginBottom:5
    }
})
