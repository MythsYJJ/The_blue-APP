import React, { Component, PropTypes } from 'react';
import {
    KeyboardAvoidingView,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';
import NavBar from '../../component/navbar';
import Button from '../../component/button';
import CustomSync from '../../sync';
import { Container, Content, List, ListItem, Radio } from 'native-base';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

var Back = require('../../img/back.png');

const INPUT_MAX_LENGTH = 50;

//举报页面
export default class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 1,
            restLength: 50,
            inputText: ''
        }
    }

    onClickBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    async onClickSend() {
        if (!this.state.inputText) {
            Alert.alert('','您必须输入举报描述后方可提交');
            return;
        }
        //TODO send report
        let params = `sid=${global.sessionID}&target=${this.props.target}&targetId=${this.props.targetId}&type=${this.state.selectIndex}&reason=${this.state.inputText}`;
        let responseJson = await CustomSync.fetch(this, global.httpURL + 'report', 'POST', { 'Content-Type': 'application/x-www-form-urlencoded' }, params);
        Alert.alert('','举报成功');
        let {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={'举报'}
                        leftImageSource={Back}
                        leftItemFunc={this.onClickBack.bind(this)}
                        rightItemTitle={'提交'}
                        rightTextColor={'#fff'}
                        rightItemFunc={this.onClickSend.bind(this)}
                    />
                <KeyboardAvoidingView>
                    <ScrollView style={styles.container}>
                        {
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ borderBottomWidth: 2, borderRightColor: 'rgba(0,0,0,.3)', marginTop: 20, paddingLeft: 10 }}>
                                    <Text style={{ fontSize: 20,backgroundColor:'transparent' }}>
                                        请选择举报原因
                                    </Text>
                                </View>
                                <View>
                                    <List>
                                        <ListItem style={{ height: 60 }} onPress={() => { this.setState({ selectIndex: 1 }) }}>
                                            <Radio selected={this.state.selectIndex == 1} onPress={() => { this.setState({ selectIndex: 1 }) }} />
                                            <Text style={{backgroundColor:'transparent'}}>欺诈</Text>
                                        </ListItem>
                                        <ListItem style={{ height: 60 }} onPress={() => { this.setState({ selectIndex: 2 }) }}>
                                            <Radio selected={this.state.selectIndex == 2} onPress={() => { this.setState({ selectIndex: 2 }) }} />
                                            <Text style={{backgroundColor:'transparent'}}>色情</Text>
                                        </ListItem>
                                        <ListItem style={{ height: 60 }} onPress={() => { this.setState({ selectIndex: 3 }) }}>
                                            <Radio selected={this.state.selectIndex == 3} onPress={() => { this.setState({ selectIndex: 3 }) }} />
                                            <Text style={{backgroundColor:'transparent'}}>广告</Text>
                                        </ListItem>
                                        <ListItem style={{ height: 60 }} onPress={() => { this.setState({ selectIndex: 4 }) }}>
                                            <Radio selected={this.state.selectIndex == 4} onPress={() => { this.setState({ selectIndex: 4 }) }} />
                                            <Text style={{backgroundColor:'transparent'}}>政治谣言</Text>
                                        </ListItem>
                                    </List>
                                </View>
                                <View style={{ borderBottomWidth: 2, borderRightColor: 'rgba(0,0,0,.3)', marginTop: 20, paddingLeft: 10 }}>
                                    <Text style={{ fontSize: 20,backgroundColor:'transparent' }}>
                                        请输入举报描述
                                    </Text>
                                </View>
                                <View style={{ paddingTop: 10, paddingBottom: 10, borderBottomWidth: 2, borderRightColor: 'rgba(0,0,0,.3)' }}>
                                    <TextInput maxLength={50}
                                        style={styles.inputText}
                                        multiline={true}
                                        returnKeyType={'done'}
                                        value={this.state.inputText}
                                        onChangeText={(text) => {
                                            this.setState({
                                                restLength: INPUT_MAX_LENGTH - text.length,
                                                inputText: text
                                            })
                                        }}
                                        placeholder={'请输入举报描述后方可进行提交(最多输入50个字)'} />
                                </View>
                                <View style={{ paddingTop: 10, paddingRight: 10, paddingBottom: 10, alignSelf: 'flex-end' }}>
                                    <Text style={{ fontSize: 10,backgroundColor:'transparent' }}>
                                        {'剩余还可输入' + this.state.restLength + "个字"}
                                    </Text>
                                </View>
                            </View>
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: Height,
        backgroundColor: '#fff'
    },
    inputText: {
        width: Width * 0.96,
        height: 120,
        fontSize: 15,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd'
    }
})