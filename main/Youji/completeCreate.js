import React, { Component } from 'react';
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
    Switch,
    DatePickerAndroid,
    Keyboard
} from 'react-native';
import Navbar from '../../component/navbar';
import Main from '../main';
import TravelNoteContent from './travel_note_content';
import CustomSync from '../../sync';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class CompleteCreate extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
        if(this.props.responseData){
            this.setState({
                notesid:this.props.responseData.notesid
            })
        }
    }
    //去到游记管理(编辑状态)
    async _confirm(){
        const {navigator} = this.props;
        let sessionID = global.sessionID;
        let userInformation = await CustomSync.getObjectForKey('userInformation');
        if(navigator){
            navigator.push({
                name:'TravelNoteContent',
                component:TravelNoteContent,
                //参数
                params:{
                    editMode:true,
                    notesid:this.state.notesid,
                    userInformation:userInformation,
                    isSelf:true,
                }
            })
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Navbar title={' '}/>
                <Image source={require('../../img/youji/u549.png')}
                       style={{flex:1,resizeMode:'contain'}}/>
                <TouchableOpacity style={styles.confirm}
                                  onPress={this._confirm.bind(this)}>
                    <Text style={styles.confirmText}>确认发布</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ddd",
        justifyContent:'center',
        alignItems:'center'
    },
    row:{
        flex:1,
        flexDirection:'column',
        marginTop:5
    },
    confirm:{
        justifyContent:'center',
        width:Width,
        height:50,
        backgroundColor:'#1596fe',
        alignItems:'center',
        borderRadius:5
    },
    confirmText:{
        fontSize:18,
        color:'#fff',
        backgroundColor:'transparent'
    }
})