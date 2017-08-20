import React,{Component,PropTypes} from 'react';
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
    Navigator
} from 'react-native';

//注册页
import Button from '../component/button';
import NavBar from '../component/navbar';
import Login from './login';
import {toastShort} from '../Toast/ToastUtil';
import Swiper from 'react-native-swiper';
import Main from '../main/main';
import DefaultHeadImage from '../component/defaultHeadImage';

//调用相册与摄像头
import GetHead from './getHead';
import CustomSync from '../sync';

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度
var ImageList=[];
var avatarList=[];



export default class Setting extends Component{
    constructor(props) {
        super(props);
        this.state = {
          show:false,
          show1:false,
          fetchData:false,
          userName:'',
          //服务器ID
          serverID:null,
          ImageIndex:0,
          showImage:0,
          //选取本地图片
          fileImage:null
        };
    }
    componentWillMount(){
        let avatarHead = global.common.avatarsegment;
        for(var key in avatarHead){
            console.log(avatarHead[key])
            for(let i=0;i<avatarHead[key].num;i++){
                console.log(i);
                ImageList.push(global.common.fileurl.imgavatar+(avatarHead[key].start+1+i))
                avatarList.push(avatarHead[key].start+1+i)
            }
        }
        this.setState({
            serverID:this.props.serverID
        });
    }

    async getUserInfo(){
        console.log('设置页面获取个人信息')
        try{
            let sid = global.sessionID;
            let responseJson = await CustomSync.fetch(this,global.httpURL + 'profile/0?sid=' + sid);
            if(responseJson.data){
                global.userInformation = responseJson.data;
                await CustomSync.setObjectForKey('userInformation', responseJson.data);
                console.log(responseJson.data)
            }
        }catch(err){
            console.log(err)
        }
    }
    //前往主页并保存提交数据
    async goMain (){
        this.setState({
            fetchData:true
        })
        const { navigator } = this.props;
        if(navigator && global.sessionID) {
            let formData=new FormData();
            let sid = global.sessionID
            formData.append('sid',sid);
            let nick = this.state.nickname;
            if(!nick){
                this.setState({
                    fetchData:false
                },()=>{
                    toastShort('请填写昵称');
                })
                return
            }
            formData.append('nickname',nick)
            let fileImage = this.state.fileImage;
            if(fileImage){
                formData.append('files',{uri:fileImage.uri.uri,
                                         type: 'multipart/form-data',
                                         name: fileImage.fileImageName})
            }else{
                let avatarid = avatarList[this.state.showImage]
                console.log(avatarid)
                formData.append('avatarid',avatarid)
            }
            try{
                console.log('发送setting')
                console.log(formData)
                let responseJson=await CustomSync.fetch(this,
                                            global.httpURL+'profile',
                                            'POST',
                                            {'Content-Type': 'multipart/form-data'},
                                            formData)
                console.log('数据返回：')
                console.log(responseJson)
                if(responseJson.status == 1){
                    //将下一级导航压入栈
                    await this.getUserInfo();
                    navigator.resetTo({
                        name: 'Main',
                        component: Main
                    })
                }else{
                    this.setState({
                        fetchData:false
                    },()=>{
                        toastShort(global.errorcode[responseJson.status].msg)
                    })
                }
            }catch(err){
                this.setState({
                    fetchData:false
                })
                console.log(err)
            }
        }
    }
    //返回按钮
    back = ()=>{
        const {navigator} = this.props
        if(navigator){
            navigator.pop();
        }
    }

    //控制modal按钮
    showModel = ()=>{
        let isShow = this.state.show;
        this.setState({
          show:!isShow,
        });
    }

    render(){
        let head = new Object();
        this.state.fileImage ?
                head = this.state.fileImage.uri
            :   head.uri = ImageList[this.state.showImage]
        return (
            <View style={styles.container}>
                <NavBar title='新用户信息'/>
                <ScrollView style={{flex:1}}>
                    <Image source={require('../img/setting_c1.jpg')} style={styles.image}>
                        <View style={{marginTop:15}}>
                            <Text style={styles.imageText}>恭喜您注册成功 !</Text>
                            <Text style={styles.imageText}>请设置您的头像和昵称</Text>
                        </View>
                        <View style={{alignSelf:'center'}}>
                            <TouchableOpacity activeOpacity={0.6}
                                              style={styles.touxiang}
                                              onPress={this.showModel.bind(this)}>
                                <Image source={head}
                                       resizeMode={'cover'}
                                       style={{
                                            width:Width*0.33,
                                            height:Width*0.33,
                                            borderRadius:Width*0.165,
                                            borderWidth:4,
                                            borderColor:'#fff'}}/>
                                <Text style={{textAlign:'center',color:'#fff',marginTop:5,fontSize:16,backgroundColor:'transparent'}}>点击更换头像</Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                    <View style={styles.row}>
                        <View style={styles.userName}>
                            <TextInput placeholder={'昵称最长八个汉字'}
                                   autoCapitalize={'none'}
                                   maxLength={8}
                                   onChangeText={(userName)=>this.setState({nickname:userName})}
                                   underlineColorAndroid={'transparent'}
                                   textAlign={'left'}
                                   fontSize={16}
                                   placeholderTextColor={'#1596fe'}
                                   textAlignVertical={'bottom'}
                                   style={{width:300}}
                                   style={{height:45,width:Width,textAlign:'center',textAlignVertical:'center'}}/>
                        </View>
                        <TouchableOpacity activeOpacity={0.5}
                                          style={[styles.fetchData,
                                                this.state.fetchData ? {backgroundColor:'#aaa'} : {backgroundColor:'#1596e3'}
                                          ]}
                                          disabled={this.state.fetchData}
                                          onPress={this.goMain.bind(this)}>
                            <Text style={{textAlign:'center',color:'#fff',fontSize:20,backgroundColor:'transparent'}}>进入首页</Text>
                        </TouchableOpacity>
                    </View>
                    {/*modal*/}
                                      {/*changeImage:默认头像改变时调用*/}
                                      {/*choiceFileImage:选取本地图片时调用*/}
                                      {/*cancel:取消时调用*/}
                    <DefaultHeadImage show={this.state.show}
                                      navigator={this.props.navigator}
                                      ImageList={ImageList}
                                      changeImage={(index,show)=>{
                                            this.setState({
                                                fileImage:null,
                                                showImage:index,
                                                show:show
                                            })
                                        }}
                                      choiceFileImage={(data)=>{
                                            this.setState({
                                                fileImage:data
                                            },()=>{console.log(this.state.fileImage)})
                                      }}
                                      cancel={(show)=>{
                                        this.setState({
                                            show:show
                                        })
                                      }}/>
                </ScrollView>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    wrapper:{

    },
    container:{
        flex:1,
        backgroundColor:'#ddd'
    },
    row:{

        alignSelf:'center'
    },
    image:{
        height:Height*0.45,
        width:Width,
    },
    imageText:{
        textAlign:'center',
        alignItems:'center',
        fontSize:24,
        color:'#1596fe',
        backgroundColor:'transparent'
    },
    touxiang:{
        marginTop:25,
    },
    // modal的样式
      modalStyle: {
        // backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent:'center',
        alignSelf:'center',
        width:Width,
        height:Height
      },
      // modal上子View的样式
      subView:{
        backgroundColor:'#fff',
        alignSelf: 'center',
        justifyContent:'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor:'#ccc',
        paddingTop:Height*0.03
      },
      // 水平的分割线
      horizontalLine:{
        marginTop:0,
        height:0.5,
        backgroundColor:'#ccc',
      },
      // 按钮
      buttonView:{
        flexDirection: 'row',
        alignItems: 'center',
      },
      buttonStyle:{
        flex:1,
        height:44,
        alignItems: 'center',
        justifyContent:'center',
      },
      // 竖直的分割线
      verticalLine:{
        width:0.5,
        height:44,
        backgroundColor:'#ccc',
      },
      buttonText:{
        fontSize:16,
        color:'#3393F2',
        textAlign:'center',
      },
      swiperView:{
        alignSelf:'center',
        justifyContent:'center',
        position:'relative',
        bottom:-20,
        zIndex:10
      },
      swiperViewImage:{
        borderRadius:Height*0.1,
        resizeMode:'contain',
        height:Height*0.2,
        width:Height*.2,
        zIndex:100
      },
    //昵称
    userName:{
        width:Width,
        flexDirection:'row',
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginTop:1
    },
    //进入首页
    fetchData:{
        borderRadius:5,
        alignSelf:'center',
        marginTop:5,
        width:Width-10,
        height:40,
        justifyContent:'center',
        backgroundColor:'#1596e3',
        marginBottom:30
    },
    //自选提示
    camera:{
        height:Height*0.055,
        resizeMode:'contain'
    },
    cameraBtn:{
        position:'absolute',
        right:Width*0.07,
        bottom:1,
        width:Width*0.12,
        height:Height*0.05
    },
    cameraLintView:{
        position:'absolute',
        top:-Height*0.115,
        right:-Width*0.05
    },
    cameraLint:{
        resizeMode:'contain',
        height:Height*0.18
    },
    //选择图片modal
    chooseCameraModal:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-end',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.4)'
    },
    chooseCameraView:{
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        paddingBottom:Height*0.02
    },
    chooseCameraChoice:{
        width:Width*0.9,
        height:Height*0.25,
        backgroundColor:'#fff',
        borderRadius:15,
        justifyContent:'space-between',
        alignItems:'center',
        paddingTop:Height*0.05,
        paddingBottom:Height*0.05,
    },
    chooseCameraCancel:{
        width:Width*0.9,
        height:Height*0.1,
        backgroundColor:'#fff',
        borderRadius:10,
        marginTop:Height*0.02,
        justifyContent:'center',
        alignItems:'center'
    },
    chooseCameraBtn:{
        width:Width,
        height:Height*0.1,
        borderTopWidth:1,
        borderColor:'#ddd',
        justifyContent:'center',
    },
    chooseCameraText:{
        textAlign:'center',
        fontSize:24,
        color:'#1596fe',
        textAlignVertical:'center',
    }
})