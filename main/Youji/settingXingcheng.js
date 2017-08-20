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
    ListView,
    Keyboard,
    BackAndroid
} from 'react-native';
import Navbar from '../../component/navbar';
import ImagePicker from 'react-native-image-crop-picker';
import CreateYoujiSetting from './createYoujiSetting';
import { toastShort } from '../../Toast/ToastUtil';
import CustomSync from '../../sync';
import WarningModal from '../../component/warningModal';

var Back = require('../../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度


//相册列表
var Images = [];
var editImages = [];
var editCreateImages = [];

export default class SettingXingcheng extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            ImageList: Images,
            title: '',
            mainText: '',
            show1: false,
            warningShow: false,
            maxImage: false,
            //选取本地图片
            chooseSettingImage: null,
            fileImage: '',
            //游记数据
            noteSid: null
        }
    }

    onBackAndroid = () => {
        //进入搜索状态判定
        if (!this.state.warningShow) {
            this._showWaringModal();
            return true;
        }
        return false;
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        /*
            新建，插入行程status1
            编辑行程status2
        */
        if (this.props.notesid) {
            console.log(this.props.notesid)
            this.setState({
                noteSid: this.props.notesid
            })
        }
        switch (this.props.status) {
            case 1:
                console.log('新建')
                break;
            case 2:
                console.log('编辑')
                if (this.props.rowData) {
                    let data = this.props.rowData
                    Images = data.coverphotos;
                    this.setState({
                        title: data.title,
                        mainText: data.content,
                        ImageList: Images
                    })
                }
                break;
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    _showWaringModal() {
        let isShow = this.state.warningShow
        this.setState({
            warningShow: !isShow
        })
    }

    _backYouji = () => {
        const { navigator } = this.props;
        if (navigator) {
            let isShow = this.state.warningShow
            this.setState({
                warningShow: !isShow
            }, () => {
                Images = [];
                editImages = [];
                editCreateImages = [];
                navigator.pop();
            })
        }
    }

    async _completeSetting() {
        Keyboard.dismiss();
        const { navigator } = this.props;
        let formData = new FormData();
        let sid = global.sessionID;
        console.log(sid)
        let notesid = this.state.noteSid;
        let title = this.state.title;
        let content = this.state.mainText;
        let remove = []; //编辑行程修改图片
        formData.append('sid', sid);
        formData.append('notesid', notesid);
        let location = await CustomSync.getCurrentLocation();
        if (location) {
            formData.append('longitude', location.coords.longitude);
            formData.append('latitude', location.coords.latitude);
        }
        if (title) {
            formData.append('title', title)
        } else {
            return toastShort('请输入标题')
        }
        formData.append('content', content)
        //判断新建/编辑
        switch (this.props.status) {
            case 1:
                //新建状态
                if (Images.length == 0 && !content) {
                    toastShort('必须包含一张图片或者一段行程')
                    return
                }
                console.log('新建状态')
                console.log(Images)
                console.log(content)
                let preordernum = parseInt(this.props.preordernum);
                formData.append('preordernum', preordernum);
                if (Images) {
                    console.log('新建状态遍历图片')
                    Images.map(item => {
                        formData.append('files', {
                            uri: item.uri,
                            type: 'multipart/form-data',
                            name: item.fileImageName
                        })
                    })
                }
                break;
            case 2:
                //编辑状态
                if (editImages.length == 0 && Images.length == 0 && !content) {
                    toastShort('必须包含一张图片或者一段行程')
                    return
                }
                console.log('编辑状态')
                console.log(editImages)
                console.log(Images)
                console.log(content)
                console.log(this.props.rowData)
                let id = this.props.rowData.id;
                formData.append('id', id);
                if (editImages && editImages.length > 0) {
                    console.log(editImages)
                    editImages.map(item => {
                        formData.append('files', {
                            uri: item.image.uri,
                            type: 'multipart/form-data',
                            name: item.image.fileImageName
                        })
                        remove.push(item.removeIdx);
                    })
                    let str = remove.join("|")
                    console.log(str)
                    formData.append('remove', str);
                }
                if (editCreateImages && editCreateImages.length > 0) {
                    console.log(editCreateImages)
                    editCreateImages.map(item => {
                        formData.append('files', {
                            uri: item.uri,
                            type: 'multipart/form-data',
                            name: item.fileImageName
                        })
                        /*if (Platform.OS === 'android') {
                            formData.append('files', {
                                uri: 'file://' + item.fileImagePath,
                                type: 'multipart/form-data',
                                name: item.fileImageName
                            })
                        } else if (Platform.OS === 'ios') {
                            formData.append('files', {
                                uri: item.fileImagePath,
                                type: 'multipart/form-data',
                                name: item.fileImageName
                            })
                        }*/
                    })
                }
        }
        console.log(formData)
        try {
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'notesrecords',
                'POST',
                { 'Content-Type': 'multipart/form-data' },
                formData)
            console.log('数据返回：')
            console.log(responseJson)
            if (responseJson.status == 1) {
                toastShort('保存完毕')
                if (navigator) {
                    //服务器给定的行程id
                    global.updateXingchengId = new Object();
                    switch (this.props.status) {
                        case 1:
                            //新建
                            global.updateXingchengId.status = 1;
                            global.updateXingchengId.rowId = this.props.preordernum;
                            break
                        case 2:
                            //编辑
                            global.updateXingchengId.status = 2;
                            global.updateXingchengId.rowId = this.props.rowId;
                            break
                    }
                    global.updateXingchengId.data = responseJson.data;
                    Images = [];
                    editImages = [];
                    editCreateImages = [];
                    global.updataMyList = true;
                    navigator.pop();
                    /*let rowData=new Object();
                    rowData.id=id;
                    rowData.createtime=new Date().getTime()/1000;
                    rowData.content=content;
                    rowData.title=title;
                    let DataImages=[];
                    if(this.props.rowData){
                        Images.map(item=>{
                            if(item.uri || item.isEdit){
                                DataImages.push(item.uri);
                            }else{
                                DataImages.push(global.common.fileurl.imgtravel+item);
                            }
                        })
                    }else{
                        console.log('新建行程时的图片列表')
                        console.log(Images);
                        Images.map(item=>{
                            DataImages.push(item.uri)
                        })
                        rowData.createXingcheng=true;
                    }
                    rowData.coverphotos=DataImages;
                    //分辨出是否为本地图片
                    rowData.isFileImage=true;
                    let listData=this.props.listData;
                    if(this.props.rowData){
                        listData.splice(this.props.rowId,1,rowData)
                    }else{
                        listData.splice(this.props.preordernum,0,rowData)
                    }
                    this.props.updateData(listData)
                    console.log(Images)
                    console.log(listData)
                    */
                }
            } else {
                console.log(responseJson);
            }
        } catch (err) {
            toastShort('master...和你开了一个小玩笑，给你制造了一点bug：\n' + err)
        }
        /*if(navigator){
            navigator.push({
                name:'CreateYoujiSetting',
                component:CreateYoujiSetting,
                //传参
            })
        }*/
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
        switch (this.props.status) {
            case 1:
                //新建
                Img.uri = rowData.uri;
                break
            case 2:
                //编辑
                if (rowData.isEdit) {
                    Img.uri = rowData.uri
                } else {
                    Img.uri = global.common.fileurl.imgtravel + rowData
                }
                break

        }
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
    //显示选择相册modal
    _showCameraModal() {
        let isShow1 = this.state.show1;
        this.setState({
            show1: !isShow1
        })
    }
    getGallery(rowId) {
        /*ImagePicker.launchImageLibrary(options, (response) => {
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
                const source = { uri: response.uri, isStatic: true };
                // or a reference to the platform specific asset location
                let type='';
                if (Platform.OS === 'ios') {
                    source = {uri: response.uri, isStatic: false};
                    type = response.uri.substring(response.uri.lastIndexOf('.'));
                  } else {
                    source = {uri: 'file://'+response.path, isStatic: false};
                    type = response.path.substring(response.path.lastIndexOf('.'));
                  }

                if (rowId) {
                    //修改图片
                    let ImageData = source;
                    ImageData.fileImageName = global.userInformation.userid+new Date().getTime()+type
                    ImageData.isEdit = true;
                    Images[rowId] = ImageData
                    this.setState({
                        show1: false,
                        ImageList: Images
                    });
                    if (this.props.status == 2) {
                        editImages.push({ removeIdx: rowId, image: ImageData })
                    }
                } else {
                    //新增图片
                    let ImageData = source;
                    ImageData.fileImageName = global.userInformation.userid+new Date().getTime()+type
                    ImageData.isEdit = true;
                    Images.push(ImageData)
                    if (this.props.status == 2) {
                        editCreateImages.push(ImageData)
                    }
                    this.setState({
                        show1: false,
                        ImageList: Images
                    });
                    if (Images.length >= 9) {
                        this.setState({
                            maxImage: true
                        })
                    }
                }
            }
        });*/
        ImagePicker.openPicker({ cropping: false, compressImageQuality: 0.8 }).then(image => {
            this.setState({
                show1: false,
            });
            console.log(image);
            let mime = image.mime.substring(0, image.mime.indexOf('/'));
            if (mime != 'image') {
                toastShort('目前仅支持上传图片')
                return;
            }
            let source = { uri: image.path };
            if (Platform.OS === 'ios') {
                source = { uri: 'file://' + image.path }
            }
            let type = image.path.substring(image.path.lastIndexOf('.'));
            console.log(type);
            if (type == '.jpeg') {
                type = '.jpg';
            };
            let name = global.userInformation.userid + new Date().getTime() + type;
            let ImageData = source;
            ImageData.fileImageName = name;
            ImageData.isEdit = true;

            if (rowId) {
                //修改图片
                Images[rowId] = ImageData
                if (this.props.status == 2) {
                    editImages.push({ removeIdx: rowId, image: ImageData })
                }
                this.setState({
                    ImageList: Images
                });
            } else {
                //新增图片
                Images.push(ImageData)
                if (this.props.status == 2) {
                    editCreateImages.push(ImageData)
                }
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
        /*ImagePicker.launchCamera(options, (response) => {
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
                const source = { uri: response.uri, isStatic: false };
                // or a reference to the platform specific asset location
                let type = response.uri.substring(response.uri.lastIndexOf('.'));

                if (rowId !== null) {
                    let ImageData = source;
                    ImageData.fileImageName = global.userInformation.userid+new Date().getTime()+type;
                    ImageData.isEdit = true;
                    Images[rowId] = ImageData
                    this.setState({
                        show1: false,
                        ImageList: Images
                    });
                    if (this.props.status == 2) {
                        editImages.push({ removeIdx: rowId, image: ImageData })
                    }
                } else {
                    let ImageData = source;
                    ImageData.fileImageName = global.userInformation.userid+new Date().getTime()+type;
                    ImageData.isEdit = true;
                    Images.push(ImageData)
                    if (this.props.status == 2) {
                        editCreateImages.push(ImageData)
                    }
                    this.setState({
                        show1: false,
                        ImageList: Images
                    });
                    if (Images.length >= 9) {
                        this.setState({
                            maxImage: true
                        })
                    }
                }
            }
        });*/
        ImagePicker.openCamera({ cropping: false, compressImageQuality: 0.8 }).then(image => {
            this.setState({
                show1: false,
            });
            let source = { uri: image.path };
            if (Platform.OS === 'ios') {
                source = { uri: 'file://' + image.path }
            }
            let mime = image.mime.substring(0, image.mime.indexOf('/'));
            if (mime != 'image') {
                toastShort('目前仅支持上传图片')
                return;
            }
            let type = image.path.substring(image.path.lastIndexOf('.'));
            if (type == '.jpeg') {
                type = '.jpg';
            };
            let name = global.userInformation.userid + new Date().getTime() + type;
            let ImageData = source;
            ImageData.fileImageName = name;
            ImageData.isEdit = true;

            if (rowId !== null) {
                Images[rowId] = ImageData
                this.setState({
                    ImageList: Images
                });
                if (this.props.status == 2) {
                    editImages.push({ removeIdx: rowId, image: ImageData })
                }
            } else {
                Images.push(ImageData)
                if (this.props.status == 2) {
                    editCreateImages.push(ImageData)
                }
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

    _navBar() {
        switch (this.props.status) {
            case 1:
                return (<Navbar title={'新建行程'}
                    rightItemTitle={'完成'}
                    rightTextColor={'#fff'}
                    rightItemFunc={this._completeSetting.bind(this)}
                    leftItemFunc={this._showWaringModal.bind(this)}
                    leftImageSource={Back} />)
            case 2:
                return (<Navbar title={'编辑行程'}
                    rightItemTitle={'完成'}
                    rightTextColor={'#fff'}
                    rightItemFunc={this._completeSetting.bind(this)}
                    leftItemFunc={this._showWaringModal.bind(this)}
                    leftImageSource={Back} />)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this._navBar()
                }
                <ScrollView keyboardShouldPersistTaps={'handled'}
                    style={styles.container}>
                    <View style={styles.row}>
                        <View style={styles.View}>
                            <Text style={styles.ViewTitle}>行程标题</Text>
                            <View style={[styles.hrLine, styles.hrTitleLine]} />
                            <View style={{ paddingTop: 10, marginBottom: 10 }}>
                                <TextInput maxLength={20}
                                    style={styles.TitleText}
                                    multiline={true}
                                    onChangeText={(text) => { this.setState({ title: text }) }}
                                    value={this.state.title}
                                    placeholder={'请输入您的行程标题(1~20个字)'}
                                    underlineColorAndroid={'transparent'} />
                            </View>
                            <Text style={styles.titleExplain}>
                                输入行程标题，将有助于为您的游记进行收费管理
                        </Text>
                        </View>
                        <View style={styles.View}>
                            <Text style={styles.ViewTitle}>行程内容</Text>
                            <View style={[styles.hrLine, styles.hrTitleLine]} />
                            <TextInput placeholder={'请输入文字内容...（最多500个字）'}
                                multiline={true}
                                maxLength={500}
                                style={styles.mainText}
                                onChangeText={(text) => { this.setState({ mainText: text }) }}
                                value={this.state.mainText} />
                        </View>
                        {/*需要改成listView 加号按钮添加在listView之后*/}
                        <View style={styles.View}>
                            <Text style={styles.ViewTitle}>行程相册</Text>
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
                            <Text style={styles.titleExplain}>
                                添加1~9张图片来为您的行程附上最有效的说明吧~
                            </Text>
                        </View>
                    </View>
                </ScrollView>
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
                {/*取消提示框*/}
                <Modal animationType='fade'
                    transparent={true}
                    visible={this.state.warningShow}
                    onRequestClose={this._showWaringModal.bind(this)}>
                    <WarningModal cancel={this._showWaringModal.bind(this)} confirm={this._backYouji.bind(this)} />
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ddd"
    },
    row: {
        flex: 1,
        flexDirection: 'column'
    },
    View: {
        width: Width,
        backgroundColor: '#fff',
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 10
    },
    hrLine: {
        width: Width * 0.96,
        height: 1,
        backgroundColor: '#999',
        alignSelf: 'center',
        marginBottom: 3
    },
    hrTitleLine: {
        height: 3,
        backgroundColor: '#000'
    },
    ViewTitle: {
        fontSize: 20,
        marginBottom: 5,
        width: Width * 0.96,
        alignSelf: 'center',
        color: '#000',
        fontWeight: 'bold',
        backgroundColor:'transparent'
    },
    TitleText: {
        width: Width * 0.96,
        fontSize: 15,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        height: 60
    },
    titleExplain: {
        textAlign: 'right',
        paddingRight: Width * 0.03,
        backgroundColor:'transparent'
    },
    ImageList: {
        width: Width * 0.96,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'center'
    },
    add: {
        width: Width * 0.12,
        height: Width * 0.12,
        resizeMode: 'contain'
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
    mainText: {
        textAlignVertical: 'top',
        width: Width * 0.96,
        height: Height * 0.3,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        alignSelf: 'center',
        marginTop: 5
    },
    ListInside: {
        flexDirection: "row",
        flexWrap: 'wrap',
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
