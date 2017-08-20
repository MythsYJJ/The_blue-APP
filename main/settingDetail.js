import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert
} from 'react-native';

import SettingsList from 'react-native-settings-list';
import NavBar from '../component/navbar';
var Back = require('../img/back.png');

export default class SettingDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: this.props.index
        }

        this._goBack = this._goBack.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    _goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillUnmount() {
        const {onBack} = this.props;
        if (onBack) {
            onBack(this.props.item.id, this.state.selectIndex);
        }
    }

    _renderItem() {
        let renderList = [];
        this.props.item.options.forEach((value, index) => {
            renderList.push(
                <SettingsList.Item
                    key={index}
                    hasNavArrow={false}
                    title={value}
                    titleInfo={index == this.state.selectIndex ? '当前选择' : ''}
                    titleInfoStyle={styles.titleInfoStyle}
                    onPress={() => this.setState({ selectIndex: index })}
                />
            )
        })
        return renderList;
    }

    render() {
        var bgColor = '#DCE3F4';
        return (
            <View style={styles.container}>
                <NavBar title={this.props.item.name}
                    leftImageSource={Back}
                    leftItemFunc={this._goBack}
                    leftImageHeight={22}
                />
                <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                    <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                            {this._renderItem()}
                        </SettingsList>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    titleInfoStyle: {
        fontSize: 16,
        color: '#8e8e93'
    }
});