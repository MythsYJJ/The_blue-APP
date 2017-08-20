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
    ListView,
    Animated,
    Easing
} from 'react-native';
import {toastShort} from '../Toast/ToastUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class Loading extends React.Component{
    constructor(props){
        super(props);
        this.spinValue = new Animated.Value(0);
    }

    componentDidMount () {
        this.spin()
    }

    spin () {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear
            }
        ).start(() => this.spin())
    }

    setNativeProps(nativeProps) {
        this._text.setNativeProps(nativeProps);
    }

    render(){
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <View style={styles.container}>

                <View style={styles.Modal}>
                    <Animated.View style={{alignItem:'center',justifyContent:'center',transform: [{rotate: spin}]}}>
                        <FontAwesome name='spinner' size={30} color='rgba(255,255,255,.8)'/>
                    </Animated.View>
                    {/*<Image source={require('../img/loading2.gif')}
                            style={{resizeMode:'contain',width:Width*.05,height:Width*.05,marginLeft:Width*.02}}/>*/}
                    <Text ref={ component => this._text = component } style={{padding:5,color:'#ddd',backgroundColor:'transparent'}}>正在跳转...</Text>
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
        backgroundColor :'rgba(0,0,0,0.8)',
        padding:10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row'
    }
})