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
    BackAndroid,
    Keyboard,
    ListView
} from 'react-native';

import NavBar from '../../component/navbar';
import WarningModal from '../../component/warningModal';
import ImagePicker from 'react-native-image-crop-picker';
import { toastShort } from '../../Toast/ToastUtil';
import CustomSync from '../../sync';
import suibi_Content from './Suibi_content';

var Back = require('../../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

//相册列表
var Images = [];

export default class CreateSuibi extends React.Component {
    constructor(props){
        super(props);
        this.state={
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            warningShow:false,
            mainText:'',
            ImageList:Images,
            maxImage: false,
            chooseSettingImage:null,
            show1:false
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
        Images = [];
        this.setState({
            ImageList:Images
        })
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


    _showCameraModal() {
        let isShow1 = this.state.show1;
        this.setState({
            show1: !isShow1
        })
    }
    getGallery(rowId) {
        ImagePicker.openPicker({cropping:false,compressImageQuality:0.8}).then(image => {
            this.setState({
                show1: false,
            });
            console.log(image);
            let mime = image.mime.substring(0,image.mime.indexOf('/'));
            if(mime != 'image'){
                toastShort('目前仅支持上传图片')
                return;
            }
            let source = { uri:image.path };
            if (Platform.OS === 'ios') {
                source = {uri:'file://'+image.path}
            }
            let type = image.path.substring(image.path.lastIndexOf('.'));
            console.log(type);
            if(type == '.jpeg'){
                type = '.jpg';
            };
            let name = global.userInformation.userid+new Date().getTime()+type;
            let ImageData = source;
            ImageData.fileImageName = name;
            ImageData.isEdit = true;

            if (rowId) {
                //修改图片
                Images[rowId] = ImageData
                this.setState({
                    ImageList: Images
                });
            } else {
                //新增图片
                Images.push(ImageData)
                this.setState({
                    ImageList: Images
                });
                if (Images.length >= 9) {
                    this.setState({
                        maxImage: true
                    })
                }
            }
        });
    }
    getCamera(rowId) {
        ImagePicker.openCamera({cropping:false,compressImageQuality:0.8}).then(image => {
            this.setState({
                show1: false,
            });
            let source = { uri: image.path };
            if (Platform.OS === 'ios') {
                source = {uri:'file://'+image.path}
            }
            let mime = image.mime.substring(0,image.mime.indexOf('/'));
            if(mime != 'image'){
                toastShort('目前仅支持上传图片')
                return;
            }
            let type = image.path.substring(image.path.lastIndexOf('.'));
            if(type == '.jpeg'){
                type = '.jpg';
            };
            let name = global.userInformation.userid+new Date().getTime()+type;
            let ImageData = source;
            ImageData.fileImageName = name;
            ImageData.isEdit = true;

            if (rowId !== null) {
                Images[rowId] = ImageData
                this.setState({
                    ImageList: Images
                });
            } else {
                Images.push(ImageData)
                this.setState({
                    ImageList: Images
                });
                if (Images.length >= 9) {
                    this.setState({
                        maxImage: true
                    })
                }
            }
        });
    }

    //图片列表
    _addImage() {
        return (
            <TouchableOpacity style={styles.addImage}
                activeOpacity={0.8}
                onPress={this._addId.bind(this)}>
                <Image source={require('../../img/youji/add.png')}
                    style={styles.add} />
                <Text style={{backgroundColor:'transparent'}}>选择图片</Text>
            </TouchableOpacity>
        )
    }
    _addId() {
        this.setState({
            chooseSettingImage: null
        })
        this._showCameraModal()
    }
    _chooseId(rowId) {
        this.setState({
            chooseSettingImage: rowId
        });
        this._showCameraModal()
    }

    _renderRow(rowData, rowId) {
        let Img = new Object();
        Img.uri = rowData.uri;
        console.log('图片路径')
        console.log(rowData)
        console.log(Img)
        return (
            <TouchableOpacity style={styles.addImage}
                activeOpacity={0.8}
                onPress={() => { this._chooseId(rowId) }}>
                <Image source={Img}
                    style={{ width: Width * 0.2, height: Width * 0.2, resizeMode: 'cover' }} />
                {/*<CacheImage source={Img}
                            envUrl={global.common.fileurl.imgtravel}
                            url={rowData}
                            style={{ width: Width * 0.2, height: Width * 0.2, resizeMode: 'cover' }}
                            resizeMode='cover' />*/}
            </TouchableOpacity>
        )
    }
    async CreateSuibi(){
        Keyboard.dismiss();
        let sessionID = global.sessionID;
        const {navigator}=this.props;
        let mainText=this.state.mainText;
        let imageData;
        //要么有文字，要么有图片
        if(this.state.ImageList.length ==0){
            toastShort('随笔图片不能为空');
            return;
        }
         let formData=new FormData();
        formData.append('sid',sessionID)
        formData.append('content',mainText)
        if (this.state.ImageList) {
            console.log('新建状态遍历图片')
            this.state.ImageList.map(item => {
                formData.append('files', {
                    uri: item.uri,
                    type: 'multipart/form-data',
                    name: item.fileImageName
                })
            })
        }
        console.log('上传随笔数据')
        console.log(formData)
        try{
            let responseJson=await CustomSync.fetch(this,
                                                global.httpURL+'essays',
                                                'POST',
                                                {'Content-Type': 'multipart/form-data'},
                                                formData);
            console.log('数据返回：')
            console.log(responseJson)
            // toastShort(responseJson)
            //新建成功后跳转
            if(responseJson.status == 1
                && navigator){
                    global.updateSuibi = true;
                    //新建状态
                    navigator.push({
                        name:'suibi_Content',
                        component:suibi_Content,
                        params:{
                            viewtye:1,
                            id:responseJson.data,
                            userinfo:global.userInformation
                        }
                    })
                }

        }
        catch(err){
            console.log(err)
             toastShort(err)
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <NavBar title={'新建随笔'}
                        rightItemTitle={'发送'}
                        rightTextColor={'#fff'}
                        rightItemFunc={()=>{this.CreateSuibi()}}
                        leftItemFunc={this._showWaringModal.bind(this)}
                        leftImageSource={Back}/>
                <ScrollView keyboardShouldPersistTaps={'handled'}
                            style={styles.container}>
                    <View style={styles.row}>
                        <View style={styles.View}>
                            <Text style={styles.ViewTitle}>随笔文字</Text>
                            <View style={[styles.hrLine,styles.hrTitleLine]}/>
                            <View style={{paddingTop:10,marginBottom:10}}>
                                <TextInput placeholder={'输入文字最多200字...'}
                                            multiline={true}
                                            maxLength={200}
                                            onChangeText={(text)=>{this.setState({mainText:text})}}
                                            style={styles.mainText}/>
                            </View>
                        </View>
                        
                    </View>
                    {/*需要改成listView 加号按钮添加在listView之后*/}
                    <View style={styles.View}>
                        <Text style={styles.ViewTitle}>随笔相册</Text>
                        <View style={[styles.hrLine, styles.hrTitleLine]} />
                        <View style={styles.ImageList}>
                            <ListView style={{ marginTop: 5 }}
                                dataSource={this.state.dataSource.cloneWithRows(this.state.ImageList)}
                                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                                showsVerticalScrollIndicator={false}
                                enableEmptySections={true}
                                initialListSize={9}
                                contentContainerStyle={styles.ListInside}
                                renderFooter={
                                    this.state.maxImage ?
                                        () => { }
                                        :
                                        this._addImage.bind(this)
                                } />
                        </View>
                    </View>
                </ScrollView>
                {/*取消提示框*/}
                <Modal animationType='fade'
                       transparent={true}
                       visible={this.state.warningShow}
                       onRequestClose={this._showWaringModal.bind(this)}>
                    <WarningModal cancel={this._showWaringModal.bind(this)} confirm={this._backYouji.bind(this)}/>
                </Modal>
                {/*选择相册*/}
                <Modal animationType='fade'
                    transparent={true}
                    visible={this.state.show1}
                    onShow={() => { }}
                    onRequestClose={this._showCameraModal.bind(this)}>
                    <View style={styles.chooseCameraModal}>
                        <View style={styles.chooseCameraView}>
                            <View style={styles.chooseCameraChoice}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={() => { this.getCamera(this.state.chooseSettingImage) }}>
                                    <Text style={[styles.chooseCameraText, { color: '#e4393c' }]}>拍照</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={() => { this.getGallery(this.state.chooseSettingImage) }}>
                                    <Text style={styles.chooseCameraText}>从手机相册选择</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.chooseCameraCancel}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this._showCameraModal.bind(this)}>
                                    <Text style={[styles.chooseCameraText, { borderTopWidth: 0, fontWeight: 'bold' }]}>取消</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#ddd',
        flex:1
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
    ViewTitle:{
        fontSize:20,
        marginBottom:5,
        width:Width*0.96,
        alignSelf:'center',
        color:'#000',
        fontWeight:'bold',
        backgroundColor:'transparent'
    },
    ListInside: {
        flexDirection: "row",
        flexWrap: 'wrap',
    },
    addImage: {
        width: Width * 0.2,
        height: Width * 0.2,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: Width * 0.05,
        marginRight: Width * 0.05,
        marginBottom: Width * 0.05
    },
    add: {
        width: Width * 0.12,
        height: Width * 0.12,
        resizeMode: 'contain'
    },
    ImageList: {
        width: Width * 0.96,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'center'
    },
    //选择图片modal
    chooseCameraModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    chooseCameraView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: Height * 0.02
    },
    chooseCameraChoice: {
        width: Width * 0.9,
        height: Height * 0.25,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Height * 0.05,
        paddingBottom: Height * 0.05,
    },
    chooseCameraCancel: {
        width: Width * 0.9,
        height: Height * 0.1,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: Height * 0.02,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chooseCameraBtn: {
        width: Width,
        height: Height * 0.1,
        borderTopWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
    },
    chooseCameraText: {
        textAlign: 'center',
        fontSize: 24,
        color: '#1596fe',
        textAlignVertical: 'center',
        backgroundColor:'transparent'
    }
})