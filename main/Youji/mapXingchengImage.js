import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    ListView,
    RefreshControl,
    TouchableHighlight
} from 'react-native';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class MapXingchengImage extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
                <TouchableHighlight style={{width:Width*0.25,height:Width*0.25,margin:5,backgroundColor:'#e4393c'}}
                                    >
                     <Image
                             source={require('../../img/touxiang/t1.jpg')}
                             resizeMode={'cover'}
                             style={{width:Width*0.25,height:Width*0.25}}
                         />
                 </TouchableHighlight>
        )
    }
}