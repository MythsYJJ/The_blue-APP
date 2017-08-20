import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
//资料data
export default class MyselfInformation extends React.Component{
    static PropTypes={
        Title:PropTypes.string,    //资料类型
        Data:PropTypes,            //data数据
        BgColor:PropTypes
    }
    static defaultProps={
        Title:'',
        Data:'',
        BgColor:'#ddd'
    }
    render (){
        return (
            <View style={[styles.List,{backgroundColor:this.props.BgColor}]}>
                <View style={{justifyContent:'center'}}>
                    <Text style={{width:Width*.5,backgroundColor:'transparent'}}>{this.props.Title}</Text>
                </View>
                <View>
                    <Text style={{width:120,textAlign:'center',backgroundColor:'transparent'}}>{this.props.Data}</Text>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    //资料data
    List:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:50,
        paddingRight:36,
        paddingTop:3,
        paddingBottom:3,
        marginBottom:3,
    }
})