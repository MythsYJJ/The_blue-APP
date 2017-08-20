import React, { PropTypes } from 'react';
import {
    StyleSheet,
    BackAndroid,
    View,
    Alert,
    Dimensions,
    Text
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import PaymentUtil from '../Utils/paymentUtil';
import Loading from './loading';
import Register from '../login/register';

const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

class WebViewBase extends React.Component {
    constructor(props) {
        super(props);
        this.callAlipay = this.callAlipay.bind(this);
        this.canGoBack = false;
        this.isPopUp = false;
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
    }

    onNavigationStateChange(navState) {
        this.canGoBack = navState.canGoBack;
    }

    onBridgeMessage(message) {
        const { webviewbridge } = this.refs;

        let passData;
        try {
            passData = JSON.parse(message);
            if (passData != null) {
                const { type, value } = passData;
                switch (type) {
                    case 'alipay':
                        console.log('call alipay url = ' + value);
                        this.callAlipay(value);
                        break;
                    case 'login':
                        const { navigator } = this.props;
                        if (navigator) {
                            navigator.resetTo({
                                name: 'Register',
                                component: Register,
                                params: {
                                    navigator: navigator
                                }
                            })
                            Alert.alert('', '请注册并登录TheBlue');
                        };
                        break;
                    case 'popup':
                        this.isPopUp = value;
                        break;
                    case 'log':
                        console.log('weblog:', ...value);
                        break;
                    default:
                        this.onUnhandleMessage(passData);
                        break;
                }
            }
        } catch (err) {
            console.warn('onBridgeMessage message = ' + message + 'err = ', err);
        }
    }

    onUnhandleMessage(json) {
        console.log("unhandle message:", json);
    }

    async callAlipay(url) {
        try {
            let result = await PaymentUtil.AlipayByUrl(null, null, url);
            const { webviewbridge } = this.refs;
            if (webviewbridge) {
                console.log('pay result = ', result);
                webviewbridge.sendToBridge(JSON.stringify({
                    type: 'alipay_callback',
                    ...result
                }))
            }
        } catch (err) {
            Alert.alert('', '支付失败');
        }
    }

    getWebViewBridge() {
        const { webviewbridge } = this.refs;
        return webviewbridge;
    }

    render() {
        return (
            <View style={this.getViewStyle()}>
                <WebViewBridge
                    ref='webviewbridge'
                    automaticallyAdjustContentInsets={false}
                    style={styles.base}
                    source={{ uri: this.state.url }}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    scalesPageToFit
                    bounces={false}
                    decelerationRate="normal"
                    onShouldStartLoadWithRequest={() => {
                        const shouldStartLoad = true;
                        return shouldStartLoad;
                    }}
                    onBridgeMessage={this.onBridgeMessage.bind(this)}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                    renderLoading={this.renderLoading.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        flex: 1
    }
});

export default WebViewBase;
