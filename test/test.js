import React from 'react';
import {
  Component,
  StyleSheet,
  Text,
  View,
  WebView,
  TextInput,
  TouchableOpacity,
  Image,
  Slider,
  Animated,
  ScrollView,
  NativeModules,
  Platform,
  Easing
} from 'react-native';
import FileUtil from '../Utils/fileUtil';
import CacheImage from '../component/cacheImage';
import RNFS from 'react-native-fs';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cacheDir: RNFS.DocumentDirectoryPath,
    }
  }

  async testAsync() {
    try {
      // let sessionID = await CustomSync.getStringForKey('sessionID');
      // console.log(sessionID);
      // let params = 'sid='+sessionID+'&productid=1&buytype=0&category=1&amount=1';
      // let result = await PaymentUtil.AlipayByUrl(sessionID, 'pay', params);
      // console.log(result);
      // let success = await FileUtil.writeFile('custom_notification', 'json', {'type':1});
      // let response = await fetch('http://dev.m7games.com:19060/img/travel/30001/5791cb8a1009b31230e667c3/5791cb8a1009b31230e667c4',
      //               {
      //                   method: 'HEAD',
      //                   headers: {
      //                       'Cache-Control': 'no-cache'
      //                   }
      //               }, );
      // console.log(response);
      FileUtil.deleteCacheImage();
    } catch (err) {
      console.log('catch testAsync' + err);
    }
  }

  componentDidMount() {
    // var CustomBridge = NativeModules.CustomBridge;
    // CustomBridge.IapPay(['com.M7Game.LuChen.cash_30'], ticket => {
    //   console.log('iap pay finish ticket = ' + ticket);
    // });


    // this.testAsync();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CacheImage defaultSource={require('../img/1.jpg')}
          envUrl='http://dev.m7games.com:19060/img/travel/'
          url='30001/5791cb8a1009b31230e667c3/5791cb8a1009b31230e667c5'
          resizeMode='cover'
          style={{ width: 150, height: 150 }} />
        <Text>
          {this.state.cacheDir}
        </Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  modalView: {
    width: Width * 0.8,
    height: 200,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },

  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  },
  default: {
    height: Height,
    width: Width,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    flex: 1,
    fontSize: 13,
    padding: 4,
    alignSelf: 'center'
  },
});