import React,{Component,PropTypes} from 'react';
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

//按钮btn
export default class SelectList extends React.Component{
    constructor(props){
        super(props);
    }
    static propTypes = {
        tap: PropTypes.func,
        number:PropTypes.string,
        Image:PropTypes.node,
        title:PropTypes.string,
        rightImage:PropTypes.node,
        Headimg:PropTypes.object,
    }
    render(){
        var isImage=false;
        if(this.props.Image){
            isImage=true;
        }
        let headimg = false
        if(this.props.Headimg){
            headimg=true;
        } 
        return(
            <View style={{backgroundColor:'#fff'}}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,.5)'}
                                onPress={this.props.tap ? this.props.tap : ()=>{}}>
                <View style={styles.selectView}>
                        {isImage ?
                                <View style={styles.selectViewRow}>
                                    <Image source={this.props.Image} style={styles.leftImage}/>
                                    <Text style={[styles.selectTitle,
                                                  styles.selectText,
                                                  {paddingLeft:10}
                                                  ]}>{this.props.title}
                                    </Text>
                                </View>
                                  :
                                <View style={styles.selectViewRow}>
                                  <Text style={[styles.selectTitle,
                                                  styles.selectText,
                                                  {paddingLeft:40}
                                                  ]}>{this.props.title}
                                    </Text>
                                </View>
                        }
                    <View style={[styles.selectViewRow]}>
                        {
                            headimg ?
                            <View style={[styles.selectNum]}>
                            <Image source={this.props.Headimg} style={[styles.ImageHead, { borderWidth: 3, borderColor: '#fdd842' }]}/>
                            </View>
                            :
                            <Text style={[styles.selectNum,
                                      styles.selectText]}>{this.props.number}</Text>
                        }
                        
                        <Image source={this.props.rightImage} style={styles.selectForward}/>
                    </View>
                </View>
            </TouchableHighlight>
            <View style={styles.line}/>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    selectView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        paddingBottom:8
    },
    selectViewRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    selectText:{
        fontSize:17,
        color:'#5c5c5c',
        backgroundColor:'transparent'
    },
    selectTitle:{
        paddingLeft:10,
        backgroundColor:'transparent'
    },
    selectNum:{
        paddingRight:10,
        width:Width*.6
    },
    selectForward:{
        height:16,
        resizeMode:'contain'
    },
    leftImage:{
        resizeMode:'contain',
        height:30,
        width:30
    },
    ImageHead: {
        alignItems: 'center',
        alignSelf:'center',
        justifyContent:'center',
        resizeMode:'contain',
        width: Width*.2,
        height: Width*.2,
        borderRadius: Width*.1
    },
    //调试线条(记得删除)
    line:{
        height:3,
        backgroundColor:'#ddd'
    }
})