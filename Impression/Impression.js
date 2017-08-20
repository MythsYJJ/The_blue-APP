import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    ListView,
    RefreshControl,
    TouchableHighlight,
    Alert
} from 'react-native';

import NavBar from '../component/navbar';
import CustomSync from '../sync';
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');
var length2 = 1;
var content = ''
export default class Impression extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listdata: [],
            isself: false,
            showkeyboard: false,
            inputHeight: 30,
            userInfo: this.props.userInfo,
            usefeatureusage:0
        }
        this._changed = false;

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        this._loadData();
    }

    async _loadData() {
        let sessionID = await CustomSync.getStringForKey('sessionID');
        let user = await CustomSync.getObjectForKey('userInformation');
        this.state.isself = (user && user.userid == this.props.userid) ? true : false
        this.state.isself ?
            this.setState({
                sessionID: sessionID, user: user, isself: this.state.isself,
                'delimpression': global.common.features.delimpression.vip[0].free,
                'usefeatureusage':this.state.usefeatureusage
            }) :
            this.setState({
                sessionID: sessionID, user: user, isself: this.state.isself,
                'publishimpression': global.common.features.publishimpression.vip[0].free,
                'usefeatureusage':this.state.usefeatureusage
            });
            console.log('免费次数'+global.common.features.delimpression.vip[0].free)

        // console.log(global.httpURL + 'comments/3/' + this.props.userid
        //     + '?sid=' + sessionID)

        // let response = await fetch(global.httpURL + 'comments/3/' + this.props.userid
        //     + '?sid=' + sessionID);
        // responseJson = await response.json();
        responseJson = await CustomSync.fetch(this, `${global.httpURL}comments/3/${this.props.userid}?sid=${sessionID}`);
        responseJson.data ?
            this.setState({ listdata: responseJson.data })
            : this.setState({ listdata: [] })

        console.log(`${global.httpURL}featureusage/${this.state.isself?`delimpression/`:`publishimpression/`}?sid=${sessionID}`)
        responseJson2 = await CustomSync.fetch(this, `${global.httpURL}featureusage/${this.state.isself?`delimpression/`:`publishimpression/`}?sid=${sessionID}`);
        console.log('usefeatureusage'+responseJson2.data)
        this.setState({ usefeatureusage: responseJson2.data })
        global.userInformation.impressionsnum = responseJson.data.length;
    }

    componentWillUnmount() {
        const {onChangeFinish} = this.props;
        if (onChangeFinish) {
            onChangeFinish(this._changed ? this.state.userInfo : null);
        }
    }

    addImpression() {
        this.setState({ showkeyboard: !this.state.showkeyboard })
    }
    _onEndRefresh() {
        console.log('触发底部刷新')
    }
    _onTopRefresh() {
        console.log('触发顶部刷新')
    }

    _listHead() {
        return (
            <View style={{ paddingBottom: 5, paddingTop: 10, backgroundColor: '#fff' }}>
                <Text style={{
                    color: '#999', fontWeight: 'bold', textAlign: 'right', width: Width * 0.92,
                    fontSize: 17, marginBottom: 3,backgroundColor:'transparent'
                }}>
                    {this.state.listdata ? '共' + this.state.listdata.length + '个印象' : '0'}
                </Text>
                <View style={{
                    height: 3, width: Width * 0.94, alignSelf: 'center',
                    backgroundColor: '#333'
                }} />
            </View>
        )
    }

    //单行数据-样式
    _renderRow(rowData, rowId) {
        return (
            <View style={{
                paddingTop: 5, paddingBottom: 5,
                backgroundColor: '#fff', width: Width
            }}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', width: Width * .92, paddingBottom: 3,
                    alignSelf: 'center'
                }}>
                    <Text style={{ width: Width * 0.6, color: '#333',backgroundColor:'transparent' }}>
                        {this.state.listdata[rowId].content}
                    </Text>
                    <Text style={{ width: Width * 0.2, color: '#999', textAlign: 'center',backgroundColor:'transparent' }}>
                        {new Date(parseInt(this.state.listdata[rowId].createtime) * 1000).toLocaleDateString()}
                    </Text>
                    {(this.state.isself || this.state.listdata[rowId].userid == this.state.user.userid) ? 
                        <Text style={{ width: Width * 0.1, color: '#169BD5', textAlign: 'center',backgroundColor:'transparent' }}
                        onPress={() => { this.removeImpression(rowData, rowId) }} >
                        删除
                    </Text> : <Text />}
                </View>
                <View style={{ width: Width * .94, height: 1, backgroundColor: '#ddd', alignSelf: 'center' }} />
            </View>
        );
    }
    async removeImpression(rowData, rowid) {
        //不是自己的印象界面能显示删除按钮的肯定是自己评论的，自己评论的删除 不算次数
        if (!this.state.isself) {
            responseJson = await CustomSync.fetch(this, `${global.httpURL}comments/${rowData.id}?sid=${global.sessionID}`, 'DELETE');
            if (responseJson.status == 1) {
                Alert.alert('','删除成功');
                this.state.listdata.splice(rowid, 1)
                console.log(this.state.listdata)
                this.state.userInfo.impressionsnum = this.state.listdata.length
                this.setState({ listdata: this.state.listdata, userInfo: this.state.userInfo })
                this._changed = true;
            }
        }
        else
        {   //如果还有免费次数
            if (this.state.delimpression - this.state.usefeatureusage > 0) {
                this._delimpression(rowData,rowid)
            }
            else
            {
                Alert.alert(
                    '免费次数用完',
                    `删除此印象将扣除${1}现金券`,
                    [
                        { text: '不了', onPress: () => console.log('Foo Pressed!') },
                        {
                            text: '删除', onPress: () => {
                                this._delimpression(rowData,rowid);
                                global.userInformation.coins--;
                            }
                        },
                    ]
                )
            }
        }
        
        // fetch(global.httpURL + 'comments/' + rowData.id + '?sid=' + global.sessionID, {
        //     method: 'DELETE'
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         if (responseJson.status == 1) {
        //             alert('删除成功')
        //             this.state.listdata.splice(rowid, 1)
        //             console.log(this.state.listdata)
        //             this.state.userInfo.impressionsnum = this.state.listdata.length
        //             this.setState({ listdata: this.state.listdata,userInfo:this.state.userInfo })
        //             this._changed = true;
        //         }

        //     }).catch((err) => { console.log(err) })
    }

    async _delimpression(rowData,rowid)
    {
        console.log('检测单行数据',rowData)
        responseJson = await CustomSync.fetch(this, `${global.httpURL}comments/${rowData.id}?sid=${global.sessionID}`, 'DELETE');
                if (responseJson.status == 1) {
                    Alert.alert('','删除成功');
                    this.state.listdata.splice(rowid, 1)
                    console.log(this.state.listdata)
                    this.state.userInfo.impressionsnum = this.state.listdata.length
                    this.setState({ listdata: this.state.listdata, userInfo: this.state.userInfo, 'usefeatureusage': this.state.usefeatureusage += 1 })
                    this._changed = true;
                }
    }

    _renderList() {
        // this.state.listdata = this.props.listdata
        if (this.state.listdata && this.state.listdata.length > 0) {
            return (
                <ListView style={{ paddingBottom: 5 }}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                    // renderHeader={this._listHead.bind(this)}
                    showsVerticalScrollIndicator={false}
                    initialListSize={8}
                    onEndReachedThreshold={0}
                    onEndReached={this._onEndRefresh}
                    enableEmptySections={true}
                    refreshControl={
                        <RefreshControl onRefresh={this._onTopRefresh}
                            refreshing={false} />
                    } />
            )
        } else {
            let who = this.state.isSelf ? '我' : ((this.state.user && this.state.user.sex == 1) ? '他' : '她');
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => { console.log('刷新了') }}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                            {this.state.isself?'暂未获得任何印象':'对方暂未获得任何印象'}
                        </Text>
                        <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                            {this.state.isself?'赶紧发布游记,增加曝光度吧～':`发表下你对${who}看法吧～`}
                        </Text>
                    </View>
                </ScrollView>
            );
        }
    }

    render() {
        let navtitle = this.state.isself ? '对我的印象' : '对TA的印象'
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavBar title={navtitle}
                    rightItemvisible={false}
                    leftitemvisible={true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                <View style={{
                    backgroundColor: '#fff', paddingLeft: Width * .03, paddingRight: Width * .03,
                    paddingTop: 5, paddingBottom: 5, marginBottom: 5
                }}>
                    <Text style={{ color: '#777', fontSize: 14, marginBottom: 3,backgroundColor:'transparent' }}>
                        {this.state.isself?'今日您还可以免费删除印象的次数：':'今日您还可以免费添加印象的次数：'}
                       <Text style={{ color: '#FF9900', fontWeight: 'bold',backgroundColor:'transparent' }}>{this.state.isself?this.state.delimpression-this.state.usefeatureusage>0?
                           this.state.delimpression-this.state.usefeatureusage:0
                       :this.state.publishimpression-this.state.usefeatureusage>0?this.state.publishimpression-this.state.usefeatureusage:0}</Text>
                    </Text>
                    <Text style={{ color: '#777', fontSize: 14, backgroundColor:'transparent'}}>
                        {'(免费次数用完后，每'+(this.state.isself?'删除':'添加')+'一个印象收取1点现金券)'}
                    </Text>
                </View>
                {this._listHead()}
                {this._renderList()}
                {this.state.showkeyboard ? <View style={styles.responseModalView}>
                    <View style={styles.responseInputView}>
                        <TextInput ref={(ref) => this._Input = ref}
                            multiline={true}
                            style={[styles.responseInput, { height: this.state.inputHeight }]}
                            onChangeText={(text) => { this._changeText(text) }}
                            underlineColorAndroid={'transparent'}
                            includeFontPadding={false} />
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.sendbtn() }}
                            style={styles.responseBtn}>
                            <Text style={styles.responseBtnText}>发送</Text>
                        </TouchableOpacity>
                    </View>
                </View> : <View />}
                {(!this.state.isself && !this.state.showkeyboard) ?
                    this.state.userInfo.ignored ?
                        <TouchableOpacity activeOpacity={0.8}
                                            style={{alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: Width,
                                                    borderRadius: 5,
                                                    backgroundColor: '#bbb',
                                                    height: 40}}
                                            disabled = {true}>
                                <Text style={{backgroundColor: 'transparent',
                                                color: '#fff',
                                                fontSize: 17}}>
                                    您已被该用户列入黑名单
                                </Text>
                        </TouchableOpacity>
                      :
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.addImpression() }}>
                            <View style={styles.btn}>
                                <Text style={{
                                    fontSize: 17, alignSelf: 'center', color: '#fff',
                                    textAlignVertical: 'center',backgroundColor:'transparent'
                                }}>添加新印象</Text>
                            </View>
                        </TouchableOpacity>
                    :
                    <View />}
            </View>
        )
    }
    async sendImpression()
    {
         let params = 'sid=' + global.sessionID + '&content=' + content
        console.log(global.httpURL + 'comments/3/' + this.state.user.userid)
        responseJson = await CustomSync.fetch(this, `${global.httpURL}comments/3/${this.props.userid}`, 'POST',
            { 'Content-Type': 'application/x-www-form-urlencoded' }, params);
        if (responseJson.status == 1) {
            console.log(responseJson);
            Alert.alert('','添加新印象成功')
            let obj = new Object()
            obj['userid'] = this.state.user.userid
            obj['content'] = content
            obj['id'] = responseJson.data;
            let date = (new Date()).toDateString();
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            date = date.getTime();
            obj['createtime'] = date / 1000;
            this.state.listdata.unshift(obj);
            this._changed = true;
            this.state.userInfo.impressionsnum = this.state.listdata.length;
            this.state.usefeatureusage+=1;
            this.setState({ listdata: this.state.listdata, showkeyboard: false, userInfo: this.state.userInfo,'usefeatureusage':this.state.usefeatureusage });
        }
    }
    async sendbtn() {
        //如果还有免费次数
            if (this.state.publishimpression - this.state.usefeatureusage > 0) {
                this.sendImpression()
            }
            else
            {
                Alert.alert(
                    '免费次数用完',
                    `添加此印象将扣除${1}现金券`,
                    [
                        { text: '不了', onPress: () => console.log('Foo Pressed!') },
                        {
                            text: '添加', onPress: () => {
                                this.sendImpression();
                                global.userInformation.coins--;
                            }
                        },
                    ]
                )
            }

       
        // fetch(global.httpURL + 'comments/3/' + this.props.userid, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     body: params,
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         if (responseJson.status == 1) {
        //             alert('添加新印象成功')
        //             let obj = new Object()
        //             obj['userid'] = this.state.user.userid
        //             obj['content'] = content
        //             let date = (new Date()).toDateString();
        //             date = new Date(Date.parse(date.replace(/-/g, "/")));
        //             date = date.getTime();
        //             obj['createtime'] = date / 1000
        //             this.state.listdata.unshift(obj)
        //             this._changed = true;
        //             this.state.userInfo.impressionsnum = this.state.listdata.length
        //             this.setState({ listdata: this.state.listdata,showkeyboard: false,userInfo:this.state.userInfo })
        //         }

        //     }).catch((err) => { console.log(err) })
    }
    _changeText(text) {
        content = text
        let test = new RegExp('\n', 'g');
        let InputHei = this.state.inputHeight
        if (text.match(test)) {
            let length1 = text.match(test).length;
            if (length1 < 3 && length1 == length2) {
                length2++;
                this.setState({
                    inputHeight: InputHei + 20
                })
            } else if (length1 < 3 && length1 + 1 < length2) {
                length2--;
                this.setState({
                    inputHeight: InputHei - 20
                })
            }
            console.log('length1:' + length1)
            console.log('length2:' + length2)
        } else if (text.match(test) == null && length2 >= 2) {
            length2--;
            this.setState({
                inputHeight: InputHei - 20
            })
        }
    }

    backView() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Width,
        marginBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
    },
    btn: {
        height: 40,
        width: Width,
        alignSelf: 'center',
        backgroundColor: '#0099FF',
        justifyContent: 'center'
    },
    Name: {
        fontSize: 18,
        paddingLeft: 3
        // marginLeft: 5
    },
    middleMain: {
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        width: Width * 0.5,
        paddingLeft: Width * 0.01
    },
    //弹出input框
    responseModalView: {
        backgroundColor: '#68bbfc',
        padding: 5
    },
    responseInputView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    responseInput: {
        width: Width * 0.8,
        backgroundColor: '#fff',
        padding: 0,
        fontSize: 16
    },
    responseBtn: {
        alignSelf: 'flex-end',
        backgroundColor: '#169bd5',
    },
    responseBtnText: {
        textAlignVertical: 'center',
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#fff',
        fontSize: 17,
        backgroundColor:'transparent'
    }
})
