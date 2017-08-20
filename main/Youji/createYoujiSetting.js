import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Platform,
    TextInput,
    ScrollView,
    Modal,
    Switch,
    DatePickerAndroid,
    Keyboard,
    Alert
} from 'react-native';
import Navbar from '../../component/navbar';
import CompleteCreate from './completeCreate';
import {toastShort} from '../../Toast/ToastUtil';
import CustomSync from '../../sync';
import TravelNoteContent from './travel_note_content';

const Back=require('../../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

var reg=new RegExp("[^0-9$]");

export default class CreateYoujiSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPay:false,
            payNumber:'1',
            BtnIsShow:true,
            //数据
            consumption:'',
            location:'',
            createTimeToServer:'',
            //传参数据
            title:'',
            mainText:'',
            fileImage:'',
            fileImagePath:''
        };
    }
    componentWillMount () {
      let sessionID = global.sessionID;
      this.setState({userID:sessionID})
      if(this.props.title){
        this.setState({
            title:this.props.title
        })
      }else if(this.props.onlySetting){
        this.setState({
            title:this.props.editYoujiData.title
        })
      }
      if(this.props.mainText){
        this.setState({
            mainText:this.props.mainText
        })
      }else if(this.props.onlySetting){
        this.setState({
            mainText:this.props.editYoujiData.content
        })
      }
      if(this.props.isChoiceFileImage && this.props.imageData){
        this.setState({
            imageData:this.props.imageData
        })
      }
      if(this.props.status == 2 && this.props.editYoujiData){
        //编辑状态
        let data=this.props.editYoujiData
        console.log(data);
        this.setState({
            date:this._getTime(data.eventtime*1000),
            createTimeToServer:data.eventtime*1000,
            location:data.location,
            consumption:data.averagespending,
            payNumber:data.unitprice.toString()
        })
      }else{
        this.setState({
            date:this._getTime(new Date()),
            createTimeToServer:this._getTime(new Date())
        })
      }
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardWillShow.bind(this));
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardWillHide.bind(this));
    }

    _getTime(data){
        data=new Date(data);
        let year=data.getFullYear();
        let month=data.getMonth()+1;
        let date=data.getDate();
        return year+'-'+month+'-'+date;
    }

    componentWillUnmount () {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }

    _keyboardWillShow () {
        let Btn=this.state.BtnIsShow
      this.setState({
        BtnIsShow:false
      })
    }

    _keyboardWillHide () {
        let Btn=this.state.BtnIsShow
      this.setState({
          BtnIsShow:true
        })
    }
    _isPay(){
        Keyboard.dismiss();
        let PaySwitch=this.state.isPay;
        this.setState({
            isPay:!PaySwitch
        })
    }
    async _setTime(){
        Keyboard.dismiss();
        if(Platform.OS==='android'){
            try {
              const {action, year, month, day} = await DatePickerAndroid.open({
                // 要设置默认值为今天的话，使用`new Date()`即可。
                date:new Date()
              });
              if (action !== DatePickerAndroid.dismissedAction) {
                  // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                  let MONTH = month+1;
                  let createTime=new Date(year,month,day).getTime();
                  console.log(createTime)
                  this.setState({
                    date:year+'-'+MONTH+'-'+day,
                    createTimeToServer:createTime
                  })
                }
            } catch ({code, message}) {
              console.warn('Cannot open date picker', message);
            }
        }
    }
    //发布(fetch)
    async _confirm(){
        const {navigator} = this.props;
        let location=this.state.location;
        let createTimeToServer=this.state.createTimeToServer;
        let consumption=this.state.consumption;
        let payNumber=parseInt(this.state.payNumber);
        if(!location || location.replace(/(^\s*)|(\s*$)/g, "")==""){
            toastShort('游记地点不能为空')
            return;
        }
        let Sid=this.state.userID
        let formData=new FormData();
        formData.append('sid',Sid)
        formData.append('location',location)
        formData.append('eventtime',createTimeToServer/1000)
        formData.append('unitprice',payNumber)
        formData.append('averagespending',consumption)
        let title=this.state.title;
        formData.append('title',title)
        let mainText=this.state.mainText;
        formData.append('content',mainText)
        if(this.props.createYouji && this.props.isChoiceFileImage){
            console.log(this.state.imageData)
            let fileImage=this.state.imageData.fileImage;
            let fileImageName=this.state.imageData.fileImageName;
            formData.append('files',{uri:fileImage.uri,
                                     type: 'multipart/form-data',
                                     name: fileImageName})
        }
        //编辑状态添加游记id
        if(this.props.status == 2){
            let notesid=this.props.editYoujiData.id;
            formData.append('id',notesid);
            if(this.props.createYouji && this.props.isChoiceFileImage){
                formData.append('remove','0');
            }
        }
        console.log('上传数据')
        console.log(formData)
        try{
            let responseJson=await CustomSync.fetch(this,
                                                global.httpURL+'travelnotes',
                                                'POST',
                                                {'Content-Type': 'multipart/form-data'},
                                                formData);
            console.log('数据返回：')
            console.log(responseJson)
            if(responseJson.status == 1
                && navigator){
                global.updataMyList=true;
                if(this.props.status == 1){
                    global.updateSuibi = true;
                    if(navigator){
                        navigator.push({
                            name:'TravelNoteContent',
                            component:TravelNoteContent,
                            //参数
                            params:{
                                editMode:true,
                                notesid:responseJson.notesid,
                                userInformation:global.userInformation,
                                isSelf:true,
                            }
                        })
                    }
                    Alert.alert('','发布成功');
                    //新建状态
                    /*navigator.push({
                        name:'CompleteCreate',
                        component:CompleteCreate,
                        params:{
                            responseData:responseJson,
                        }
                    })*/
                    return
                }
                if(this.props.status == 2){
                    global.updateSuibi = true;
                    //编辑状态
                    const {navigator} = this.props;
                    let sessionID = global.sessionID;
                    let userInformation = await CustomSync.getObjectForKey('userInformation');
                    if(navigator){
                        global.updataYoujidata=true;
                        let routes = navigator.state.routeStack;
                        for (let i = routes.length - 1; i >= 0; i--) {
                          if(routes[i].name === "TravelNoteContent"){
                            let destinationRoute = navigator.getCurrentRoutes()[i]
                            destinationRoute.params={
                                editNoteSid:responseJson.notesid
                            }
                            navigator.popToRoute(destinationRoute);
                          }
                        }
                    }
                    return
                }
            }else{
                console.log('status:'+responseJson.status)
            }
        }catch(err){
            console.log(err)
        }
    }
    _backCreateYouji= ()=>{
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }

    _payNumber(){
        let text = parseInt(this.state.payNumber);
        console.log('一开始获取的',text);
        if(isNaN(text)){
            this.setState({
                payNumber:'0'
            });
            return
        }
        if(text > 50){
            this.setState({
                payNumber:'50'
            })
            console.log(this.state.payNumber);
            return
        };
        this.setState({
            payNumber:text.toString()
        },()=>{console.log(text)})
    }

    render() {
        return (
            <View style={styles.container}>
                <Navbar title={'发布设置'}
                        leftItemFunc={this._backCreateYouji.bind(this)}
                        leftImageSource={Back}/>
                <ScrollView style={styles.row}
                            keyboardShouldPersistTaps={'handled'}>
                    <View style={styles.formView}>
                        <View style={styles.formDataView}>
                            <View style={styles.TitleView}>
                                <Image source={require('../../img/youji/u464.png')}
                                       style={styles.formDataImage}/>
                                <Text style={styles.formDataText}>游记地点</Text>
                            </View>
                            <TextInput placeholder={'限10个字'}
                                       style={styles.formDataInput}
                                       maxLength={10}
                                       onChangeText={(text)=>{this.setState({location:text})}}
                                       value={this.state.location}
                                       underlineColorAndroid={'transparent'}/>
                            <Text style={[styles.formDataText,styles.redText]}>必填</Text>
                        </View>

                        <View style={styles.formDataView}>
                            <View style={styles.TitleView}>
                                <Image source={require('../../img/youji/u465.png')}
                                       style={styles.formDataImage}/>
                                <Text style={styles.formDataText}>出发时间</Text>
                            </View>
                            <TouchableOpacity onPress={this._setTime.bind(this)}>
                                {
                                    this.state.date ?
                                        <Text style={[styles.formDataInput,{textAlignVertical:'center'}]}>
                                            {this.state.date}
                                        </Text>
                                      :
                                        <Text style={[styles.formDataInput,{textAlignVertical:'center'}]}>
                                            选择时间
                                        </Text>
                                }
                            </TouchableOpacity>
                            <Text style={[styles.formDataText,styles.blueText]}>选填</Text>
                        </View>

                        <View style={styles.formDataView}>
                            <View style={styles.TitleView}>
                                <Image source={require('../../img/youji/u475.png')}
                                       style={styles.formDataImage}/>
                                <Text style={styles.formDataText}>人均消费</Text>
                            </View>
                            <TextInput placeholder={'点击输入'}
                                       style={styles.formDataInput}
                                       maxLength={20}
                                       onChangeText={(text)=>{this.setState({consumption:text})}}
                                       value={this.state.consumption}
                                       underlineColorAndroid={'transparent'}/>
                            <Text style={[styles.formDataText,styles.blueText]}>选填</Text>
                        </View>
                    </View>
                    {/*游记收费整块View*/}
                    <View style={styles.payView}>
                        <View style={styles.payTitleView}>
                            <View style={styles.TitleView}>
                                <Text style={styles.formDataText}>游记收费</Text>
                            </View>
                            <Text style={styles.isPay}>本游记是否收费</Text>
                            <Switch value={this.state.isPay}
                                    onValueChange={this._isPay.bind(this)}/>
                        </View>
                        {
                            this.state.isPay ?
                                <View>
                                <View style={styles.payExplain}>
                                    <View style={styles.payExplainRow}>
                                        <Text style={styles.payExplainLeft}>
                                            收费说明：
                                        </Text>
                                        <Text style={styles.payExplainRight}>
                                            游记前三条为免费内容，第四条起可根据用户选择，决定是否收费，并且定价。{'\n'}
                                            <Text style={{fontSize:16,color:'#e4393c',fontWeight:'bold',backgroundColor:'transparent'}}>单篇游记收费上限为50现金券</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.payExplainRow}>
                                        <Text style={styles.payExplainLeft}>
                                            分成说明：
                                        </Text>
                                        <Text style={styles.payExplainRight}>
                                            游记产生的一切收费（如：用现金券进行打赏、购买阅读等）将转化成APP内的货币（即-里程数），用户可在APP中进行提现（提现功能将在后续版本中开放，尽请期待）
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.payFor}>
                                    <Text style={styles.payForTitle}>
                                        设置收费价格
                                    </Text>
                                    <View style={styles.payForRight}>
                                        <TextInput  style={styles.payForInput}
                                                    keyboardType={'numeric'}
                                                    onChangeText={(text)=>{
                                                        this.setState({payNumber:text})
                                                    }}
                                                    value={this.state.payNumber}
                                                    maxLength={2}
                                                    underlineColorAndroid={'transparent'}
                                                    onBlur={this._payNumber.bind(this)}
                                                    onEndEditing={this._payNumber.bind(this)}
                                                    onSubmitEditing={this._payNumber.bind(this)}
                                                    selectTextOnFocus={true}/>
                                                    {/*需要设定金额上限*/}
                                        <Image source={require('../../img/youji/u505.png')} style={styles.formDataImage}/>
                                    </View>
                                </View>
                                </View>
                              :
                                <View/>
                        }
                    </View>
                </ScrollView>
                {
                    this.state.BtnIsShow ?
                            <TouchableOpacity style={styles.confirm}
                                              onPress={this._confirm.bind(this)}>
                                <Text style={styles.confirmText}>确认发布</Text>
                            </TouchableOpacity>
                      :
                        <View/>
                }
            </View>
        );
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ddd"
    },
    row:{
        flex:1,
        flexDirection:'column',
        marginTop:5
    },
    formView:{
        width:Width,
        borderRadius:5,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:5,
        paddingBottom:10
    },
    formDataView:{
        width:Width*0.95,
        flexDirection:'row',
        borderBottomWidth:1,
        borderColor:'#000',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5,
        marginTop:5
    },
    TitleView:{
        flexDirection:'row',
        alignItems:'center'
    },
    formDataImage:{
        width:Width*0.08,
        height:Width*0.08,
        resizeMode:'contain'
    },
    formDataText:{
        fontSize:20,
        color:'#000',
        backgroundColor:'transparent'
    },
    redText:{
        color:'#FF0000'
    },
    blueText:{
        color:'#0000FF'
    },
    formDataInput:{
        width:Width*0.55,
        textAlign:'center',
        fontSize:15,
        height:Height*0.07,
        textAlignVertical:'bottom',
        backgroundColor:'transparent'
    },
    //收费板块
    payView:{
        width:Width,
        borderRadius:5,
        alignItems:'center',
        backgroundColor:'#fff',
        paddingTop:5,
        paddingBottom:10,
        marginTop:Height*0.02
    },
    payTitleView:{
        width:Width*0.95,
        flexDirection:'row',
        borderBottomWidth:1,
        borderColor:'#000',
        justifyContent:'space-between',
        alignItems:'center',
        paddingBottom:5,
        marginTop:10
    },
    isPay:{
        width:Width*0.55,
        textAlign:'center',
        backgroundColor:'transparent'
    },
    payExplain:{
        marginTop:Height*0.02,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#ddd',
        width:Width*0.95,
        padding:10,
        paddingBottom:0
    },
    payExplainRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10
    },
    payExplainLeft:{
        width:Width*0.2,
        color:'#000',
        fontSize:16,
        backgroundColor:'transparent'
    },
    payExplainRight:{
        width:Width*0.69,
        color:'#000',
        fontSize:15,
        backgroundColor:'transparent'
    },
    payFor:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:10,
        alignItems:'center'
    },
    payForRight:{
        flexDirection:'row',
        alignItems:'center'
    },
    payForInput:{
        borderWidth:1,
        borderColor:'#000',
        borderRadius:5,
        width:Width*0.2,
        height:Height*0.055,
        textAlign:'right',
        fontSize:15,
        padding:0,
        paddingRight:5
    },
    payForTitle:{
        fontSize:20,
        color:'#e4393c',
        fontWeight:'bold',
        backgroundColor:'transparent'
    },
    confirm:{
        justifyContent:'center',
        width:Width,
        height:50,
        backgroundColor:'#1596fe',
        alignItems:'center',
        borderRadius:5
    },
    confirmText:{
        fontSize:18,
        color:'#fff',
        backgroundColor:'transparent'
    }
})