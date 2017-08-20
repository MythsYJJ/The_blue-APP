import React, { Component, PropTypes } from 'react';
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
import Button from './button';
import NavBar from './navbar';
import Login from '../login/login';
import { toastShort } from '../Toast/ToastUtil';
import Swiper from 'react-native-swiper';
import ImagePicker from 'react-native-image-crop-picker';

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度
var ImageList = [];
var avatarList = [];


export default class DefaultHeadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            show1: false,
            //服务器ID
            ImageIndex: 0,
            showImage: 0,
            //选取本地图片
            fileImage: null,
            fileImagePath: null,
            fileImageName: null
        };
    }

    componentWillMount() {
        if (!this.props.ImageList) {
            let avatarHead = global.common.avatarsegment;
            for (var key in avatarHead) {
                console.log(avatarHead[key])
                for (let i = 0; i < avatarHead[key].num; i++) {
                    ImageList.push(global.common.fileurl.imgavatar + (avatarHead[key].start + 1 + i))
                    avatarList.push(avatarHead[key].start + 1 + i)
                }
            }
        } else {
            ImageList = this.props.ImageList
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ show: nextProps.show });
    }

    //控制modal按钮
    showModel = () => {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }
    //显示modal
    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
            showImage: this.state.ImageIndex,
            fileImage: null
        }, () => {
            this.props.changeImage(this.state.showImage, this.state.show)
        });
    }
    _CancelModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        }, () => {
            this.props.cancel(this.state.show)
        });
    }
    //显示选择相册modal
    _showCameraModal() {
        let isShow = this.state.show;
        let isShow1 = this.state.show1;
        this.setState({
            show: !isShow,
            show1: !isShow1
        })
    }
    //调用相册与摄像头
    getCamera() {
        /*this.setState({
            show1:false,
            show:false
        })*/
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
        }).then(image => {
            console.log('ImagePicker.openCamera get Image is ', image);
            let imagePath = `${Platform.OS === 'ios' ? 'file://' : ''}${image.path}`;
            let source = { uri: imagePath };
            let type = image.path.substring(image.path.lastIndexOf('.'));
            if(type == '.jpeg'){
                type = '.jpg';
            };
            let name = global.sessionID + new Date().getTime() + type;
            this.setState({
                fileImage: source,
                fileImageName: name,
                show1: false,
                show: false
            });
            this.props.cancel(false);
            this.completeChoice(source, name);
        }).catch(err => {
            this.setState({
                show1: false,
                show: false
            });
        });
    }
    getGallery() {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true,
        }).then(image => {
            console.log('ImagePicker.openPicker get Image is ', image);
            let imagePath = `${Platform.OS === 'ios' ? 'file://' : ''}${image.path}`;
            let source = { uri: imagePath };
            let type = image.path.substring(image.path.lastIndexOf('.'));
            if(type == '.jpeg'){
                type = '.jpg';
            };
            let name = global.sessionID + new Date().getTime() + type;
            this.setState({
                fileImage: source,
                fileImageName: name,
                show1: false,
                show: false
            });
            this.props.cancel(false);
            this.completeChoice(source, name);
        }).catch(err => {
            this.setState({
                show1: false,
                show: false
            });
        });
    }

    completeChoice = (file, name) => {
        let fileImage = new Object();
        fileImage.uri = file;
        fileImage.fileImageName = name;
        this.props.choiceFileImage(fileImage);
        console.log(fileImage);
    }

    render() {
        return (
            <View>
                {/*modal*/}
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => { }}
                    onRequestClose={this._CancelModalVisible.bind(this)}>
                    <View style={[styles.modalStyle, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <View>
                            {/*主体*/}
                            <View style={styles.subView}>
                                {/*轮播图*/}
                                <Swiper loop={false} height={Height * 0.3} width={Width * 0.8}
                                    onMomentumScrollEnd={
                                        (e, state, context) => {
                                            this.setState({ ImageIndex: state.index })
                                        }
                                    }
                                    index={this.state.ImageIndex}>
                                    {
                                        ImageList.map(function (index, i) {
                                            return <View style={styles.swiperView} key={i}>
                                                <Image source={{ uri: index }} style={styles.swiperViewImage} />
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
                                <Image source={require('../img/cameraLint.png')} style={styles.cameraLint} />
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
                    onShow={() => { }}
                    onRequestClose={this._showCameraModal.bind(this)}>
                    <View style={styles.chooseCameraModal}>
                        <View style={styles.chooseCameraView}>
                            <View style={styles.chooseCameraChoice}>
                                <TouchableHighlight style={styles.chooseCameraBtn}
                                    underlayColor={'rgba(0,0,0,.1)'}
                                    onPress={this.getCamera.bind(this)}>
                                    <Text style={[styles.chooseCameraText, { color: '#e4393c' }]}>拍照</Text>
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
    // modal的样式
    modalStyle: {
        // backgroundColor:'#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: Width,
        height: Height
    },
    // modal上子View的样式
    subView: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
        paddingTop: Height * 0.03
    },
    // 水平的分割线
    horizontalLine: {
        marginTop: 0,
        height: 0.5,
        backgroundColor: '#ccc',
    },
    // 按钮
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 竖直的分割线
    verticalLine: {
        width: 0.5,
        height: 44,
        backgroundColor: '#ccc',
    },
    buttonText: {
        fontSize: 16,
        color: '#3393F2',
        textAlign: 'center',
        backgroundColor:'transparent'
    },
    swiperView: {
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        bottom: -20,
        zIndex: 10
    },
    swiperViewImage: {
        borderRadius: Height * 0.1,
        resizeMode: 'contain',
        height: Height * 0.2,
        width: Height * .2,
        zIndex: 100
    },
    //自选提示
    camera: {
        height: Height * 0.055,
        resizeMode: 'contain'
    },
    cameraBtn: {
        position: 'absolute',
        right: Width * 0.07,
        bottom: 1,
        width: Width * 0.12,
        height: Height * 0.05
    },
    cameraLintView: {
        position: 'absolute',
        top: -Height * 0.115,
        right: -Width * 0.05
    },
    cameraLint: {
        resizeMode: 'contain',
        height: Height * 0.18
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