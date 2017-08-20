import React from 'react';
import {
    StyleSheet,
    Dimensions,
} from 'react-native';
import CustomWebView from './customWebView';
import WebViewBase from '../component/webviewbase';
import Loading from '../component/loading';

const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

class Group extends WebViewBase {
    constructor(props) {
        super(props);
        let sessionId = global.sessionID ? global.sessionID : null;
        let userId = global.userInformation ? global.userInformation.userid : null;
        let url = `${global.webURL}list?sid=${sessionId}&uid=${userId}`;
        console.log('connect url = ' + url);
        this.state = {
            url: url
        }
    }

    goBack() {
        const { webviewbridge } = this.refs;
        if (this.isPopUp) {
            webviewbridge.sendToBridge(JSON.stringify({
                type: 'popup',
                value: false
            }));
            return true;
        }

        if (this.canGoBack) {
            webviewbridge.goBack();
            return true;
        }
    }

    getViewStyle() {
        return styles.viewstyle;
    }
    
    renderLoading() {
        return <Loading />;
    }

    onPop(needReload) {
        const { webviewbridge } = this.refs;
        if( webviewbridge && needReload ) {
            webviewbridge.sendToBridge(JSON.stringify({
                type: 'reload',
                value: true
            }));
        }
    }

    onUnhandleMessage(json) {
        const { type, value } = json;
        switch (type) {
            case 'jumpto':
                console.log('jumpto url = ' + value);
                const { navigator } = this.props;
                if (navigator) {
                    navigator.push({
                        name: 'CustomWebView',
                        component: CustomWebView,
                        params: {
                            navigator: navigator,
                            url: value,
                            onPop: this.onPop.bind(this)
                        }
                    })
                }
                break;
            default:
                super.onUnhandleMessage(json)
        }
    }
}

const styles = StyleSheet.create({
    viewstyle: {
        height: Height - 55,
        backgroundColor: '#ddd'
    }
});

export default Group;