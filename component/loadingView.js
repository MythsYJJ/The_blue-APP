import React, { Component } from 'react';
import {
    View,
    Image,
    Modal
} from 'react-native';

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度

export default class Index extends React.Component {
    static defaultProps = {
        image:require('../img/loading.gif')
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#fff',
                          alignItems:'center',
                          justifyContent:'center'}}>
                <Image source={this.props.image}
                       style={{resizeMode:'contain',width:Width*.5,height:Width*.5}}/>
            </View>
        )
    }
}