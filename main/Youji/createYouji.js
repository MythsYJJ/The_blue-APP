import React,{Component} from 'react';
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
    Keyboard,
    BackAndroid
} from 'react-native';
import { Container, Content, InputGroup, Input, Icon,Header,Button } from 'native-base';
import Navbar from '../../component/navbar';
import ImagePicker from 'react-native-image-crop-picker';
import CreateYoujiSetting from './createYoujiSetting';
import {toastShort} from '../../Toast/ToastUtil';
import WarningModal from '../../component/warningModal';

var Back = require('../../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

var isChoiceFileImage=false;

export default class CreateYouji extends React.Component{
    constructor(props){
        super(props);
        this.state={
            title:'',
            mainText:'',
            show1:false,
            warningShow:false,
            //选取本地图片
            fileImage:'',
            fileImagePath:''
        }
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        if(!this.state.warningShow){
            this._showWaringModal();
            return true;
        }
        return false;
    };
    

    componentWillMount(){
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        isChoiceFileImage=false;
        //编辑状态
        if(this.props.status == 2 || this.props.editYoujiData){
            console.log('编辑状态')
            let data=this.props.editYoujiData
            console.log(data);
            this.setState({
                title:data.title,
                mainText:data.content,
                fileImage:{uri:global.common.fileurl.imgtravel+data.coverphotos[0]}
            })
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    _showWaringModal(){
        let isShow=this.state.warningShow
        this.setState({
            warningShow:!isShow
        })
    }
    _backYouji= ()=>{
        Keyboard.dismiss();
        const {navigator}=this.props;
        if(navigator){
            let isShow=this.state.warningShow
            this.setState({
                warningShow:!isShow
            },()=>{
                navigator.pop();
            })
        }
    }
    _GoCreateYoujiSetting= ()=>{
        Keyboard.dismiss();
        const {navigator}=this.props;
        let title=this.state.title;
        let mainText=this.state.mainText;
        let imageData;
        //选取本地图片时上传图片
        if(isChoiceFileImage){
            imageData=new Object();
            imageData.fileImage=this.state.fileImage
            imageData.fileImageName=this.state.fileImageName
        }
        if(!title || title.replace(/(^\s*)|(\s*$)/g, "")==""){
            toastShort('标题不能为空');
            return;
        }
        if(!this.state.fileImage){
            toastShort('必须有封面')
            return;
        }
        try{
            if(navigator){
                if(this.props.status == 1){
                    //新建状态
                    console.log('新建状态')
                    navigator.push({
                        name:'CreateYoujiSetting',
                        component:CreateYoujiSetting,
                        //传参
                        params:{
                            title:title,
                            mainText:mainText,
                            imageData:imageData,
                            isChoiceFileImage:isChoiceFileImage,
                            status:1,
                            createYouji:true
                            /*YoujiList:this.props.YoujiList,
                            updateYoujiList:this.props.updateYoujiList,
                            userId:this.props.userId,*/
                        }
                    })
                    return
                }
                if(this.props.status == 2 || this.props.editYoujiData){
                    //编辑状态
                    console.log('编辑状态')
                    navigator.push({
                        name:'CreateYoujiSetting',
                        component:CreateYoujiSetting,
                        //传参
                        params:{
                            title:title,
                            mainText:mainText,
                            imageData:imageData,
                            editYoujiData:this.props.editYoujiData,
                            isChoiceFileImage:isChoiceFileImage,
                            createYouji:true,
                            status:2
                        }
                    })
                    return
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    //显示选择相册modal
    _showCameraModal(){
        let isShow1=this.state.show1;
        this.setState({
            show1:!isShow1
        })
    }
    getGallery(){
        /*ImagePicker.launchImageLibrary(options, (response)  => {

            if (response.didCancel) {
              //console.log('User cancelled image picker');
            }
            else if (response.error) {
              //console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              //console.log('User tapped custom button: ', response.customButton);
            }
            else {
              console.log('相册：',response)
              // You can display the image using either data...
              const source = {uri: response.uri, isStatic: true};
              // or a reference to the platform specific asset location
              let type='';
              if (Platform.OS === 'ios') {
                  source = {uri: response.uri, isStatic: false};
                  type = response.uri.substring(response.uri.lastIndexOf('.'));
                } else {
                  source = {uri: 'file://'+response.path, isStatic: false};
                  type = response.path.substring(response.path.lastIndexOf('.'));
                }

              this.setState({
                    show1:false,
                    fileImage:source,
                    fileImageName:global.userInformation.userid+new Date().getTime()+type
                  },()=>{isChoiceFileImage=true;});
            }
        });*/
        ImagePicker.openPicker({
            width: 1136,
            height: 640,
            cropping: true,
        }).then(image => {
            let source = {uri:image.path};
            if (Platform.OS === 'ios') {
                source = {uri:'file://'+image.path}
            }
            let type = image.path.substring(image.path.lastIndexOf('.'));
            if(type == '.jpeg'){
                type = '.jpg';
            };
            let name = global.userInformation.userid+new Date().getTime()+type;
            this.setState({
                show1:false,
                fileImage:source,
                fileImageName:name
            },()=>{isChoiceFileImage=true;});
        });
    }
    getCamera(){
        /*ImagePicker.launchCamera(options, (response)  => {
          if (response.didCancel) {
              //console.log('User cancelled image picker');
            }
            else if (response.error) {
              //console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              //console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log('拍照',response)
              // You can display the image using either data...
              // or a reference to the platform specific asset location
              const source = {uri: response.uri, isStatic: true};
              let type = response.uri.substring(response.uri.lastIndexOf('.'));
              this.setState({
                  show1:false,
                  fileImage:source,
                  fileImageName:global.userInformation.userid+new Date().getTime()+type
                },()=>{isChoiceFileImage=true;});

            }
        });*/
        ImagePicker.openCamera({
            width: 1136,
            height: 640,
            cropping: true,
        }).then(image => {
            let source = {uri:image.path};
            if (Platform.OS === 'ios') {
                source = {uri:'file://'+image.path}
            }
            let type = image.path.substring(image.path.lastIndexOf('.'));
            if(type == '.jpeg'){
                type = '.jpg';
            };
            let name = global.userInformation.userid+new Date().getTime()+type;
            this.setState({
                show1:false,
                fileImage:source,
                fileImageName:name
            },()=>{isChoiceFileImage=true;});
        });
    }
    render(){
        return (
            <View style={styles.container}>
                <Navbar title={this.props.status == 1 ? '新建游记' : '编辑游记'}
                        rightItemTitle={'下一步'}
                        rightTextColor={'#fff'}
                        rightItemFunc={this._GoCreateYoujiSetting}
                        leftItemFunc={this._showWaringModal.bind(this)}
                        leftImageSource={Back}/>
                <ScrollView keyboardShouldPersistTaps={'handled'}
                            style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.View}>
                        <Text style={styles.ViewTitle}>游记的标题</Text>
                        <View style={[styles.hrLine,styles.hrTitleLine]}/>
                        <View style={{paddingTop:10,marginBottom:10}}>
                            <TextInput maxLength={40}
                                       style={styles.TitleText}
                                       onChangeText={(text)=>{this.setState({title:text})}}
                                       value={this.state.title}
                                       placeholder={'请输入标题(最多输入40个字)'}
                                       underlineColorAndroid={'transparent'}/>
                        </View>
                        <Text style={styles.titleExplain}>
                            一个有个性的游记标题可以增加更多的粉丝哦~
                        </Text>
                    </View>
                    {/*需要改成listView 加号按钮添加在listView之后*/}
                    <View style={styles.View}>
                        <Text style={styles.ViewTitle}>游记的封面</Text>
                        <View style={[styles.hrLine,styles.hrTitleLine]}/>
                        <View style={styles.ImageList}>
                            <TouchableOpacity style={styles.addImage}
                                              activeOpacity={0.8}
                                              onPress={this._showCameraModal.bind(this)}>
                                {
                                    this.state.fileImage ?
                                        <Image source={this.state.fileImage}
                                                style={{width:Width*0.96,height:Height*0.35,resizeMode:'cover'}}/>
                                        :
                                        <Image source={require('../../img/youji/add.png')}
                                                style={styles.add}/>
                                }
                                {this.state.fileImage ? <Text></Text> : <Text style={{backgroundColor:'transparent'}}>选择图片</Text>}
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleExplain}>
                            为您的游记添加绚丽的封面吧
                        </Text>
                    </View>
                    <View style={styles.View}>
                        <Text style={styles.ViewTitle}>游记开始的话</Text>
                        <View style={[styles.hrLine,styles.hrTitleLine]}/>
                        <TextInput placeholder={'最多200个字...(选填)'}
                                    multiline={true}
                                    maxLength={200}
                                    onChangeText={(text)=>{this.setState({mainText:text})}}
                                    value={this.state.mainText}
                                    style={styles.mainText}/>
                    </View>
                </View>
                </ScrollView>
                {/*选择相册*/}
                <Modal animationType='fade'
                       transparent={true}
                       visible={this.state.show1}
                       onShow={() => {}}
                       onRequestClose={this._showCameraModal.bind(this)}>
                    <View style={styles.chooseCameraModal}>
                        <View style={styles.chooseCameraView}>
                            <View style={styles.chooseCameraChoice}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                                    underlayColor={'rgba(0,0,0,.1)'}
                                                    onPress={this.getCamera.bind(this)}>
                                    <Text style={[styles.chooseCameraText,{color:'#e4393c'}]}>拍照</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                                    underlayColor={'rgba(0,0,0,.1)'}
                                                    onPress={this.getGallery.bind(this)}>
                                    <Text style={styles.chooseCameraText}>从手机相册选择</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.chooseCameraCancel}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                                    underlayColor={'rgba(0,0,0,.1)'}
                                                    onPress={this._showCameraModal.bind(this)}>
                                    <Text style={[styles.chooseCameraText,{borderTopWidth:0,fontWeight:'bold'}]}>取消</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
                {/*取消提示框*/}
                <Modal animationType='fade'
                       transparent={true}
                       visible={this.state.warningShow}
                       onRequestClose={this._showWaringModal.bind(this)}>
                    <WarningModal cancel={this._showWaringModal.bind(this)} confirm={this._backYouji.bind(this)}/>
                </Modal>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ddd"
    },
    row:{
        flex:1,
        flexDirection:'column'
    },
    View:{
        width:Width,
        backgroundColor:'#fff',
        marginBottom:5,
        paddingTop:10,
        paddingBottom:10
    },
    hrLine:{
        width:Width*0.96,
        height:1,
        backgroundColor:'#999',
        alignSelf:'center',
        marginBottom:3
    },
    hrTitleLine:{
        height:3,
        backgroundColor:'#000'
    },
    ViewTitle:{
        fontSize:20,
        marginBottom:5,
        width:Width*0.96,
        alignSelf:'center',
        color:'#000',
        fontWeight:'bold',
        backgroundColor:'transparent'
    },
    TitleText:{
        width:Width*0.96,
        height:60,
        fontSize:15,
        alignSelf:'center',
        borderWidth:1,
        borderColor:'#ddd'
    },
    titleExplain:{
        textAlign:'right',
        paddingRight:Width*0.03,
        backgroundColor:'transparent'
    },
    ImageList:{
        width:Width*0.9,
        flexDirection:'column',
        alignSelf:'center',
        paddingTop:10,
        paddingBottom:10
    },
    add:{
        width:Width*0.15,
        height:Width*0.15,
        resizeMode:'contain'
    },
    addImage:{
        width:Width*0.96,
        height:Width*0.35,
        borderWidth:1,
        borderColor:'#ddd',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    mainText:{
        textAlignVertical:'top',
        width:Width*0.96,
        height:Height*0.3,
        fontSize:15,
        borderWidth:1,
        borderColor:'#ddd',
        alignSelf:'center',
        marginTop:5
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
        backgroundColor:'transparent'
    }
})
