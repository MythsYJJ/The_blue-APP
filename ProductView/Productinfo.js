import React,{Component,PropTypes} from 'react';
import {
    View,
    WebView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    RefreshControl,
    TouchableHighlight,
    StatusBar
} from 'react-native';

import NavBar from '../component/navbar';
import LoadingView from '../component/loadingView';
import buyproduct from './buyProduct';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
var WEBVIEW_REF = 'webview';
var BGWASH = 'rgba(255,255,255,0.8)';

/*const girlActivityJS = `
                (function(){
                  var personNum = document.getElementById('personNum');
                  var personAll = document.getElementById('personAll');
                  personNum = ${this.props.data.personlist.length};
                  personAll = ${this.props.data.total}
                })()
            `;*/
//产品信息h5界面
export default class Productinfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            scalesPageToFit: true,
            listdata:[]
        }
    }

    componentWillMount(){
        if(this.props.url){
            console.log(this.props.url);
        }
    }

    componentWillUnMount(){
    }

    componentDidMount(){
        console.log('webview',this._webview)
        this.setState({
            web:true
        })
    }

    onMessage = (e)=>{
        let test = JSON.parse(e.nativeEvent.data)
        if(test.test){
            this.backView()
        }
        if(test.buyProduct){
            this.goBuyProduct(this.state.listdata)
        }
        if(test.girlActivity && this.props.data && this.props.girlActivity){
            this._girlBuy(this.props.data)
        }
    }
    _girlBuy(rowData){
        const {navigator} = this.props;
        if(navigator){
            navigator.push({
                name: 'buyproduct',
                component: buyproduct,
                params: {
                    data: rowData,
                    buyProduct:true
                }
            })
        }
    }
    goBuyProduct(rowdata){
       console.log(rowdata)
       const {navigator} = this.props;
       if (navigator) {
           navigator.push({
               name: 'buyproduct',
               component: buyproduct,
               params: {
                   data: rowdata,
                   buyProduct:false
               }
           })
       }
    }
    backView() {
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
    render(){
        console.log(this.props.data)
        this.state.listdata = this.props.data
        console.log(this.state.listdata)
        // this.setState({ listdata: this.state.listdata })
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                {this.state.web ? 
                    <WebView
                        ref={ref =>this._webview = ref}
                        automaticallyAdjustContentInsets={false}
                        style={styles.webView}
                        source={{
                            uri: this.props.url
                        }}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        decelerationRate="normal"
                        // onNavigationStateChange={this.onNavigationStateChange}
                        // onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                        startInLoadingState={true}
                        scalesPageToFit={this.state.scalesPageToFit}
                        onMessage={this.onMessage.bind(this)}
                        onError={()=>{}}
                        //showsVerticalScrollIndicator={false}
                    />
                  :
                    <LoadingView/>
                }
                {/*this.props.activity?
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:Width*.96,
                                  alignSelf:'center'}}>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { }}>
                            <View style={styles.btn1}>
                                <Text style={{
                                    fontSize: 17, alignSelf: 'center', color: '#fff',
                                }}>免费获取</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => {this.goBuyProduct(this.state.listdata)}}>
                            <View style={styles.btn1}>
                                <Text style={{
                                    fontSize: 17, alignSelf: 'center', color: '#fff',
                                    textAlignVertical: 'center'
                                }}>点击购买</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                :<View/>*/}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#fff'
    },
    webView: {
    backgroundColor: '#fff',
    width:Width,
    height:Height
  },
  btn1: {
    height: 35,
    width: Width*.45,
    alignSelf: 'center',
    backgroundColor: '#0099FF',
    justifyContent:'center'
}
})