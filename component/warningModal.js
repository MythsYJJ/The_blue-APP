import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Platform,
    TextInput,
    ScrollView,
    Modal,
    ListView
} from 'react-native';
import {toastShort} from '../Toast/ToastUtil';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class WarningModal extends React.Component{
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.Modal}>
                    <View style={styles.ModalMain}>
                        <Text style={styles.title}>退出编辑状态</Text>
                        <Text style={styles.mainText}>
                            退出后将无法保存当前修改过的信息{'\n'}
                            {'\n'}
                            <Text style={styles.warning}>是否选择退出？</Text>
                        </Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.Btn}>
                        <TouchableHighlight style={styles.cancel}
                                            onPress={this.props.cancel}
                                            underlayColor={'#ddd'}>
                            <Text style={styles.BtnText}>取消</Text>
                        </TouchableHighlight>
                        <View style={{width:1,backgroundColor:'#ddd'}}/>
                        <TouchableHighlight style={styles.confirm}
                                           onPress={this.props.confirm}
                                           underlayColor={'#ddd'}>
                            <Text style={styles.BtnText}>确定</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'rgba(0,0,0,.4)',
        alignItems:'center',
        justifyContent:'center'
    },
    Modal:{
        backgroundColor :'#fff',
        width:Width*0.75,
        height:Height*0.3,
        borderRadius:10
    },
    ModalMain:{
        height:Height*0.24,
        padding:10
    },
    title:{
        textAlign:'center',
        alignSelf:'center',
        fontSize:16,
        fontWeight:'bold',
        backgroundColor:'transparent'
    },
    mainText:{
        textAlign:'center',
        width:Width*0.6,
        alignSelf:'center',
        height:Height*0.18,
        textAlignVertical:'center',
        fontSize:15,
        backgroundColor:'transparent'
    },
    warning:{
        color:'#e4393c',
        fontWeight:'bold',
        backgroundColor:'transparent'
    },
    line:{
        height:1,
        backgroundColor:'#ddd'
    },
    Btn:{
        flexDirection:'row'
    },
    cancel:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height:Height*0.06,
        borderBottomLeftRadius:10
    },
    confirm:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height:Height*0.06,
        borderBottomRightRadius:10
    },
    BtnText:{
        color:'#1596fe',
        fontSize:16,
        backgroundColor:'transparent'
    }
})