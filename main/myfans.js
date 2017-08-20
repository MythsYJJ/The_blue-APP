import React,{Component,PropTypes} from 'react';
import {
    View,
} from 'react-native';
import AttentionList from './attention_list';

//我的粉丝
export default class MyFans extends React.Component{
    render(){
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                {<AttentionList listtype={1} navigator={this.props.navigator} listdata={this.props.listdata}/>}
            </View>
        )
    }
}