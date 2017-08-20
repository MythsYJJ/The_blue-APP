import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import WebViewBase from '../component/webviewbase';
import Loading from '../component/loading';

class CustomWebView extends WebViewBase {
    constructor(props) {
        super(props);
        let url = `${global.webURL}${this.props.url}`;
        this.state = {
            url: url
        }
    }

    goBack() {
        const { webviewbridge } = this.refs;
        const { navigator } = this.props;
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
        if (navigator) {
            /*webviewbridge.sendToBridge(JSON.stringify({
                type: 'reload',
                value: true
            }))*/
            if (this.props.onPop != null) {
                this.props.onPop(false);
            }
            navigator.pop();
            return true;
        }
    }

    renderLoading() {
        return <Loading />;
    }

    onUnhandleMessage(json) {
        const { type, value } = json;
        switch (type) {
            case 'pop':
                console.log('pop');
                const { navigator } = this.props;
                const { webviewbridge } = this.refs;
                if (navigator) {
                    /*webviewbridge.sendToBridge(JSON.stringify({
                        type: 'reload',
                        value: true
                    }))*/

                    if (this.props.onPop != null) {
                        this.props.onPop(value);
                    }
                    navigator.pop();
                }
                break;
            default:
                super.onUnhandleMessage(json)
        }
    }


    getViewStyle() {
        return styles.viewstyle;
    }
}

const styles = StyleSheet.create({
    viewstyle: {
        flex: 1,
        backgroundColor: '#ddd'
    }
});

export default CustomWebView;