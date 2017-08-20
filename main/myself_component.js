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

export default class SelectList extends React.Component{
    constructor(props){
        super(props);
    }
    static propTypes = {
        tap: PropTypes.func,
        number:PropTypes.string,
        Image:PropTypes.node,
        title:PropTypes.string,
        rightImage:PropTypes.node
    }
    render(){
        var isImage=false;
        if(this.props.Image){
            isImage=true;
        }
        return(
            <View style={{marginBottom:2,backgroundColor:'#fff'}}>
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
                    <View style={styles.selectViewRow}>
                        <Text style={[styles.selectNum,
                                      styles.selectText]}>{this.props.number}</Text>
                        <Image source={this.props.rightImage} style={styles.selectForward}/>
                    </View>
                </View>
            </TouchableHighlight>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    selectView:{
        flex:1,
        height:42,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        paddingLeft:10,
        paddingRight:10
    },
    selectViewRow:{
        flexDirection:'row',
        alignItems:'center'
    },
    selectText:{
        fontSize:17,
        color:'#5c5c5c'
    },
    selectTitle:{
        paddingLeft:10,
        backgroundColor:'transparent'
    },
    selectNum:{
        paddingRight:10,
        textAlign:'center',
        width:100,
        backgroundColor:'transparent'
    },
    selectForward:{
        height:16,
        resizeMode:'contain'
    },
    leftImage:{
        resizeMode:'contain',
        height:30,
        width:30
    }
})