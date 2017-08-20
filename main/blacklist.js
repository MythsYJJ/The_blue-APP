import React,{Component,PropTypes} from 'react';
import {
    View
} from 'react-native';
import AttentionList from './attention_list';

//黑名单
export default class BlackList extends React.Component{
    render(){
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                {<AttentionList listtype={3} navigator={this.props.navigator}/>}
            </View>
        )
    }
}