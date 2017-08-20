import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    Platform,
    Linking,
    Alert,
} from 'react-native';

import Button from '../component/button';
import Login from './login';
import Register from './register';
import { toastShort } from '../Toast/ToastUtil';
import Main from '../main/main';
import CustomSync from '../sync';

//登录注册引导
var Dimensions = require('Dimensions');//设备信息获取
var ScreenWidth = Dimensions.get('window').width;//宽度
var ScreenHeight = Dimensions.get('window').height;//高度

var Input = React.create

export default class App extends Component {
    constructor(props) {
        super(props)
        this.loadData = this.loadData.bind(this);
    }

    async loadData() {
        const {navigator} = this.props;
        try {
            if (navigator && global.sessionID) {
                console.log('快速跳转')
                navigator.resetTo({
                    name: 'Main',
                    component: Main,
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    

    componentWillMount() {

        this.loadData();

        
    }

    //登录页
    GoLogin = () => {
        //从上一级页面跳转传递进来的navigator的props参数
        const { navigator } = this.props;
        //为什么这里可以取得 props.navigator?请看上文:
        //<Component {...route.params} navigator={navigator} />
        //这里传递了navigator作为props
        if (navigator) {
            //将下一级导航压入栈
            navigator.push({
                name: 'Login',
                component: Login
            })
        }
    }

    //注册页
    GoRegister = () => {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'Register',
                component: Register
            })
        }
    }

    render() {
        return (
            
            <View style={styles.container}>
                {
                    Platform.OS === 'android' ? <StatusBar translucent={true} backgroundColor='transparent' /> :
                        <StatusBar />
                }
                <Image source={require('../img/img_login_u0.png')} style={styles.image}>
                    <View style={styles.row}>
                        <Button text='用户登录'
                            color='#fff'
                            backgroundColor='rgba(21,150,254,.6)'
                            width={ScreenWidth * 0.36}
                            height={ScreenHeight * 0.06}
                            click={this.GoLogin} />
                        <Button text='用户注册'
                            color='#fff'
                            backgroundColor='rgba(21,150,254,.6)'
                            width={ScreenWidth * 0.36}
                            height={ScreenHeight * 0.06}
                            click={this.GoRegister} />
                    </View>
                </Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        marginTop: ScreenHeight * 0.8,
        flexDirection: 'row',
        width: ScreenWidth,
        paddingLeft: ScreenWidth * 0.1,
        paddingRight: ScreenWidth * 0.1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: ScreenWidth,
        alignItems: 'center'
        //resizeMode:'contain'
    }
})