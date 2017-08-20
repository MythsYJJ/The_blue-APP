import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import Swiper from 'react-native-swiper';
import Main from '../main/main';
import FileUtil from '../Utils/fileUtil';
import CustomSync from '../sync';
import Setting from '../login/setting';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

const imageList = [
    require('../img/guide_1.jpg'),
    require('../img/guide_2.jpg'),
    require('../img/guide_3.jpg'),
    require('../img/guide_4.jpg'),
]

export default class Guide extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rollEnd: false,
            guideImageList: imageList
        }
        this._renderImage = this._renderImage.bind(this);
    }

    componentWillMount() {
        //FileUtil.isExist('', global.activity.list[0].url)
    }

    _touchEnd() {
        const { navigator } = this.props;
        CustomSync.setStringForKey('GUDIEVIEW_READ_VERSION', global.clientVersion);
        if (navigator && this.state.rollEnd) {
            if(global.sessionID && global.userInformation.nickname == ''){
                navigator.resetTo({
                    name: 'Setting',
                    component: Setting
                })
            }else{
                navigator.resetTo({
                    name: 'Main',
                    component: Main
                })
            }
        }
    }

    _renderImage(array) {
        let arr1 = [];
        array.map(item => {
            let index = arr1.length;
            console.log(index);
            arr1.push(
                <TouchableWithoutFeedback key={index} onPress={this._touchEnd.bind(this)}>
                    <View>
                        <Image source={item} style={{ width: Width, height: Height, alignItems:'center', justifyContent:'center' }} resizeMode='cover'>
                        {
                            index == 3 ?
                                <Text style={{marginTop:Height*0.7, fontSize:20, color:'#fff', fontWeight:'bold', backgroundColor:'rgba(0,0,0,.3)',backgroundColor:'transparent'}}>
                                    点击进入
                                </Text>
                                :
                                <View />
                        }
                        </Image>
                    </View>
                </TouchableWithoutFeedback>
            );
        })
        return arr1;
    }

    _onMomentumScrollEnd(e, state, context) {
        this.setState({ rollEnd: state.total - state.index == 1 })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Swiper autoplay={true}
                    loop={false}
                    autoplayTimeout={10}
                    onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
                    dot={<View style={{ backgroundColor: 'rgba(0,0,0,.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />}
                    activeDot={<View style={{ backgroundColor: '#ddd', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}>
                    {this._renderImage(this.state.guideImageList)}
                </Swiper>
            </View>
        )
    }
}