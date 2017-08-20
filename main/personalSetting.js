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
import SettingDetail from './settingDetail';
import BirthdaySetting from './birthdaySetting';
var Back = require('../img/back.png');

export default class PersonalSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: this.props.userInfo
        };

        this._changed = false;
        this._goBack = this._goBack.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._showDetail = this._showDetail.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._dateFormat = this._dateFormat.bind(this);
        this._onBirthdaySelect = this._onBirthdaySelect.bind(this);
    }

    _goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillUnmount() {
        const {onSettingFinish} = this.props;
        if (onSettingFinish) {
            onSettingFinish(this._changed ? this.state.userInfo : null);
        }
    }

    _onSelect(id, index) {
        let userInfo = this.state.userInfo;
        let item = userInfo.PersonalInfo[id];
        if (!item || item.selectedidx !== index) {
            userInfo.PersonalInfo[id] = { itemid: id, selectedidx: index };
            this.setState({ userInfo: userInfo });
            this._changed = true;
        }
    }

    _onBirthdaySelect(birthdate) {
        if(birthdate) {
            let userInfo = this.state.userInfo;
            userInfo.birthdate = birthdate;
            let item = userInfo.PersonalInfo[109];
            if(!item) {
                userInfo.PersonalInfo[109] = { itemid: 109, selectedidx: 1 };
            }
            this.setState({userInfo: userInfo});
            this._changed = true;
        }
    }

    _showDetail(item, index) {
        if (!this.props.isSelf) {
            return;
        }
        let componentName = 'SettingDetail';
        let componentClass = SettingDetail;
        if (item.name == '出生日期') {
            componentName = 'BirthdaySetting';
            componentClass = BirthdaySetting;
        }
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: componentName,
                component: componentClass,
                params: {
                    item:item,
                    index:index,
                    onBack: this._onSelect,
                    userInformation: this.state.userInfo,
                    onBirthdaySelect: this._onBirthdaySelect,
                    navigator: navigator,
                }
            })
        }
    }

    _renderItem() {
        let renderList = [];
        for (let key of Object.keys(this.props.infoData.items)) {
            let item = this.props.infoData.items[key];
            let selfChoose = this.state.userInfo.PersonalInfo[key];
            let selectInfo = '';
            let index = -1;
            if (selfChoose) {
                index = selfChoose.selectedidx;
                selectInfo = item.options[index];
            }
            item.name = (item.name == '年龄' && this.props.isSelf) ? '出生日期' : item.name;
            if (item.name == '年龄') {
                selectInfo = `${new Date().getFullYear() - new Date(parseInt(this.state.userInfo.birthdate) * 1000).getFullYear()}岁`;
            }else if(item.name == '出生日期') {
                selectInfo = this._dateFormat(this.state.userInfo.birthdate);
            }
            renderList.push(
                <SettingsList.Item
                    key={item.id}
                    hasNavArrow={this.props.isSelf}
                    title={item.name}
                    titleInfo={selectInfo}
                    titleInfoStyle={styles.titleInfoStyle}
                    onPress={() => this._showDetail(item, index)}
                />
            )
        }
        return renderList;
    }

    _dateFormat(birthdate = null) {
        let date = birthdate ? new Date(parseInt(birthdate) * 1000) : new Date();
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    render() {
        var bgColor = '#DCE3F4';
        return (
            <View style={styles.container}>
                <NavBar title={this.props.title}
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