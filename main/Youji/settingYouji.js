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
    Modal
} from 'react-native';
import { Container, Content, InputGroup, Input, Icon,Header,Button } from 'native-base';
import Navbar from '../../component/navbar';
import ImagePicker from 'react-native-image-picker';
import CreateYoujiSetting from './createYoujiSetting';

var Back = require('../../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
//选择照片组件
var options = {
  title: 'Select Avatar', // 选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // 调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: 'Choose from Library...', // 调取相册的按钮，可以设置为空使用户不可选择相册照片
  customButtons: {
    'Choose Photo from Facebook': 'fb', // [按钮文字] : [当选择这个按钮时返回的字符串]
  },
  mediaType: 'photo', // 'photo' or 'video'
  quality:0.8,
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  maxWidth: 860, // photos only默认为手机屏幕的宽，高与宽一样，为正方形照片
  maxHeight: 480, // photos only
  allowsEditing: false, // 当用户选择过照片之后是否允许再次编辑图片
};

export default class SettingYouji extends React.Component{
    constructor(props){
        super(props);
        //需要接受props的参数进行编辑进入state
        this.state={
            title:null,
            show1:false,
            //选取本地图片(接受props数据，暂定假数据)
            fileImage:require('../../img/create_Avatar.jpg'),
            title:'假数据',
            main:'正文假数据'
        }
    }
    _backYouji= ()=>{
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    _GoCreateYoujiSetting= ()=>{
        alert('跳转到我的游记(编辑状态)')
        /*const {navigator}=this.props;
        if(navigator){
            navigator.push({
                name:'CreateYoujiSetting',
                component:CreateYoujiSetting,
                //传参
            })
        }*/
    }
    //显示选择相册modal
    _showCameraModal(){
        let isShow1=this.state.show1;
        this.setState({
            show1:!isShow1
        })
    }
    getGallery(){
        ImagePicker.launchImageLibrary(options, (response)  => {
          console.log('Response = ', response);

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
              // You can display the image using either data...
              const source = {uri: response.uri, isStatic: true};
              // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                  const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                  const source = {uri: response.uri, isStatic: true};
                }
                this.setState({
                    show1:false,
                    fileImage:source
                  });


            }
        });
    }
    getCamera(){
        ImagePicker.launchCamera(options, (response)  => {
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
              // You can display the image using either data...
              const source = {uri: response.uri, isStatic: false};

              // or a reference to the platform specific asset location
              if (Platform.OS === 'ios') {
                const source = {uri: response.uri.replace('file://', ''), isStatic: false};
              } else {
                const source = {uri: response.uri, isStatic: false};
              }
              this.setState({
                  show1:false,
                  fileImage:source
                });

            }
        });
    }
    render(){
        return (
            <View style={styles.container}>
                <Navbar title={'修改游记'}
                        rightItemTitle={'完成'}
                        rightTextColor={'#fff'}
                        rightItemFunc={this._GoCreateYoujiSetting}
                        leftItemFunc={this._backYouji}
                        leftImageSource={Back}/>
                <ScrollView keyboardShouldPersistTaps={'handled'}
                            style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.View}>
                        <Text style={styles.ViewTitle}>游记的标题</Text>
                        <View style={[styles.hrLine,styles.hrTitleLine]}/>
                        <View style={{paddingTop:10,marginBottom:10}}>
                            <TextInput maxLength={80}
                            style={styles.TitleText}
                            multiline={true}
                            onChangeText={(text)=>{this.setState({title:text})}}
                            placeholder={'请输入标题(最多输入40个字)'}
                            defaultValue={this.state.title}/>
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
                                    style={styles.mainText}
                                    defaultValue={this.state.main}/>
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
