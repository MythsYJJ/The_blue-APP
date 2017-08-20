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

//调用相册与摄像头
import ImagePicker from 'react-native-image-picker';
import GetHead from './getHead';

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度
var ImageList=[require('../img/touxiang/t1.jpg'),
               require('../img/touxiang/t2.jpg'),
               require('../img/touxiang/t3.jpg'),
               require('../img/touxiang/t4.jpg'),
               require('../img/touxiang/t5.jpg'),
               require('../img/touxiang/t6.jpg'),
               require('../img/touxiang/t7.jpg'),
               require('../img/touxiang/t8.jpg'),
               require('../img/touxiang/t9.jpg'),
               require('../img/touxiang/t10.jpg'),]
//调用相册摄像头
var options = {
  title: 'Select Avatar', // 选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // 调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: 'Choose from Library...', // 调取相册的按钮，可以设置为空使用户不可选择相册照片
  customButtons: {
    'Choose Photo from Facebook': 'fb', // [按钮文字] : [当选择这个按钮时返回的字符串]
  },
  mediaType: 'photo', // 'photo' or 'video'
  quality:.8,
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  maxWidth: 860, // photos only默认为手机屏幕的宽，高与宽一样，为正方形照片
  maxHeight: 480, // photos only
  allowsEditing: false, // 当用户选择过照片之后是否允许再次编辑图片
};

export default class ChooseImage extends Component{
    constructor(props){
        super(props);
        this.state={
            ImageIndex:0,
            showImage:0,
            show:false,
            show1:false,
            fileImage:null
        }
    }

    componentWillMount(){

    }

    //显示modal
    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
          show:!isShow,
          showImage:this.state.ImageIndex,
          fileImage:null
        });
    }
    _CancelModalVisible(){
        let isShow = this.state.show;
        this.setState({
          show:!isShow,
        });
    }
    setEnable(name){
        this.state.userName ?
            this.setState({fetchData:false}) :
            this.setState({fetchData:true})
    }
    //显示选择相册modal
    _showCameraModal(){
        let isShow=this.state.show;
        let isShow1=this.state.show1;
        this.setState({
            show:!isShow,
            show1:!isShow1
        })
    }
    //调用相册与摄像头
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
              const { navigator } = this.props;
              this.setState({
                show1:false
              });
              if(navigator){
                  navigator.push({
                      name: 'GetHead',
                      component: GetHead,
                       //参数传递
                       params:{
                           //要传递的参数
                           userImage:source,
                           popImage:(responseImage)=>{
                                this.setState({
                                    fileImage:responseImage
                                })
                           }
                       }
                  })
                }
            }
        });
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
                    source = {uri: response.uri, isStatic: false};
                  } else {
                    source = {uri: 'file://'+response.path, isStatic: false};
                  }

              const { navigator } = this.props;
              this.setState({
                  show1:false
                });

              if(navigator){
                navigator.push({
                    name: 'GetHead',
                    component: GetHead,
                     //参数传递
                     params:{
                         //要传递的参数
                         userImage:source,
                         popImage:(responseImage)=>{
                             this.setState({
                                 fileImage:responseImage
                             })
                        }
                     }
                })
              }
            }
        });
    }

    render(){
        return (
        <View>
            <Modal animationType='fade'
                   transparent={true}
                   visible={this.state.show} this.props.show
                   onShow={() => {}}
                   onRequestClose={this._setModalVisible.bind(this)}>
               <View style={[styles.modalStyle,{backgroundColor:'rgba(0,0,0,0.5)'}]}>
                <View>
                 {/*主体*/}
                 <View style={styles.subView}>
                    {/*轮播图*/}
                    <Swiper loop={false} height={Height*0.3} width={Width*0.8}
                            onMomentumScrollEnd={
                                (e, state, context)=>{this.setState({ImageIndex:state.index})}
                            }
                            index={this.state.ImageIndex}>
                            {
                                ImageList.map(function(index,i){
                                    return <View style={styles.swiperView} key={i}>
                                               <Image source={index} style={styles.swiperViewImage}/>
                                           </View>
                                })
                            }
                    </Swiper>
                   <View style={styles.horizontalLine} />
                   <View style={styles.buttonView}>
                     <TouchableOpacity
                       style={styles.buttonStyle}
                       onPress={this._CancelModalVisible.bind(this)}>
                       <Text style={styles.buttonText}>
                         取消
                       </Text>
                     </TouchableOpacity>
                     <View style={styles.verticalLine} />
                     <TouchableOpacity
                       style={styles.buttonStyle}
                       onPress={this._setModalVisible.bind(this)}>
                       <Text style={styles.buttonText}>
                         确定
                       </Text>
                     </TouchableOpacity>
                   </View>
                 </View>
                 {/*点击自选*/}
                 <View style={styles.cameraLintView}>
                    <Image source={require('../img/cameraLint.png')} style={styles.cameraLint}/>
                    <TouchableHighlight style={styles.cameraBtn}
                                        onPress={this._showCameraModal.bind(this)}
                                        underlayColor={'rgba(255,255,255,0.4)'}>
                                        <Text></Text>
                    </TouchableHighlight>
                 </View>
                </View>
               </View>
            </Modal>
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
        backgroundColor:'transparent'
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
        height:Height*0.2
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
        backgroundColor:'transparent'
    }
})