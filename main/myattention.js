import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet
    
} from 'react-native';
import AttentionList from './attention_list';

//我的关注
export default class MyAttention extends React.Component{
    render(){
        return (
            <View style={{ flex: 1,marginTop:3,backgroundColor:'#fff' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start',
                               backgroundColor:'#fff'}}>
                    <Text style={styles.Name}>
                        {this.props.titlename}
                        <Text style={{color:'#F90',backgroundColor:'transparent'}}>{this.props.listdata.length}</Text>
                    </Text>
                </View>
                <View style={{height:1}}/>
                <AttentionList listtype={this.props.listtype}
                               navigator={this.props.navigator}
                               listdata={this.props.listdata}
                               showblack={this.props.showblack}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    Name:{
        fontSize:16,
        paddingLeft:10,
        color:'#999',
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:'transparent'
    },
})