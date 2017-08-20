import React, { Component, PropTypes } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    ListView,
    Platform,
    RefreshControl,
    Alert
} from 'react-native';
import NavBar from '../../component/navbar';
import CheckBox from 'react-native-checkbox';
import CustomSync from '../../sync';
import CacheImage from '../../component/cacheImage';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

var Back = require('../../img/back.png');
var Heart = require('../../img/youquan/payAttention.png');
var EmpHeart = require('../../img/youquan/noAttention.png');
var Mail = require('../../img/youquan/sendMessage.png');

const attentionImages = [
    require('../../img/youquan/isAttention.png'),
    require('../../img/youquan/attentionOther.png'),
    require('../../img/youquan/attentionEach.png'),
]


//谁赞过我页面
export default class LikeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            sessionID: global.sessionID,
            travelID: null,
            listData: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        this._loadData();
    }

    async  _loadData() {
        try {
            if (this.props.travelID) {
                let responseJson = await CustomSync.fetch(this,global.httpURL + 'praiselog/1/'
                    + this.props.travelID + '?sid='
                    + global.sessionID
                    + '&offset=0'
                    + '&num=50')
                console.log(responseJson)
                if (responseJson.data) {
                    console.log(responseJson.data)
                    this.setState({
                        listData: responseJson.data,
                        travelID: this.props.travelID,
                        userId: global.userInformation.userid
                    })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    onClickBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _getTime(data) {
        data = new Date(data * 1000);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        return year + '-' + month + '-' + date;
    }

    //关注某人
    async _attentionSomebody(bool, user, rowID) {
        /*点击单个按钮全体发送请求，bug待修复*/
        if (bool) {
            if (this.state.userId) {
                try {
                    let responseJson = await CustomSync.fetch(this,global.httpURL + 'follow',
                                                            'POST',
                                                            {'Content-Type': 'application/x-www-form-urlencoded'},
                                                            'sid=' + global.sessionID + '&id=' + user);
                    if (responseJson) {
                        Alert.alert('关注完毕')
                        let list = this.state.listData;
                        switch (list[rowID].relationship) {
                            case 0:
                                list[rowID].relationship = 256;
                                break;
                            case 1:
                                list[rowID].relationship = 257;
                                break;
                        }
                        this.setState({ listData: list })
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        } else {
            console.log('userid:' + user)
            console.log('个人id:' + this.state.userId)
            let responseJson = await CustomSync.fetch(this,
                                                global.httpURL +
                                                    'follow/' +
                                                    user +
                                                    '?sid=' +
                                                    global.sessionID,
                                                'DELETE');
            Alert.alert('','取消关注完成');
            let list = this.state.listData;;
            switch (list[rowID].relationship) {
                case 256:
                    list[rowID].relationship = 0;
                    break;
                case 257:
                    list[rowID].relationship = 1;
                    break;
            };
            this.setState({ listData: list });
        }
    }
    _isChecked(rela) {
        console.log('both关系数据：' + rela);
        switch (rela) {
            case 256:
                return true;
            case 257:
                return true;
            default:
                return false;
        }
    }

    renderItem(article, sectionID, rowID) {
        let HeadImage = global.common.fileurl.imgavatar + article.avatar
        return (
            <View style={{ flex: 1, width: Width, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {  }} style={{ paddingLeft: 5, paddingTop: 5, paddingBottom: 5 }}>
                    <Image
                        source={{ uri: HeadImage }}
                        resizeMode={'cover'}
                        style={{ width: 60, height: 60,
                                 borderRadius: 29, borderWidth: 2,
                                 borderColor: '#000' }}
                    />
                    {/*<CacheImage cacheType='head'
                        envUrl={global.common.fileurl.imgavatar}
                        url={article.avatar}
                        style={{
                            width: 60, height: 60,
                            borderRadius: 29, borderWidth: 2,
                            borderColor: '#000'
                        }}
                        resizeMode='cover' />*/}
                </TouchableOpacity>
                {
                    article > 2 ?
                        <View style={{ width: 48, height: 25 }} />
                        :
                        <Image
                            source={attentionImages[article]}
                            resizeMode={'center'}
                            style={{ width: 48, height: 25 }}
                        />
                }
                <Text onPress={() => {  }} style={{ fontSize: 15, fontWeight: 'bold', paddingLeft: 5, paddingTop: 10,backgroundColor:'transparent' }}>
                    {CustomSync.getRemark(article.userid, article.nickname)}
                </Text>
                <View style={{ flexDirection: 'row-reverse', position: 'absolute', right: 0, top: 0 }}>
                    <TouchableOpacity onPress={() => {  }} style={{ paddingRight: 10, paddingTop: 10 }}>
                        <Image
                            source={Mail}
                            resizeMode={'cover'}
                        />
                    </TouchableOpacity>
                    <CheckBox label={''}
                        containerStyle={{ paddingTop: 10, width: 35 }}
                        checkedImage={Heart}
                        uncheckedImage={EmpHeart}
                        checked={this._isChecked(article.relationship)}
                        onChange={(data) => {
                            this._attentionSomebody(!data, article.userid, rowID)
                        }
                        } />
                </View>
                <Text style={{ fontSize: 12, paddingRight: 10, position: 'absolute', right: 20, bottom: 0,backgroundColor:'transparent' }}>
                    {this._getTime(article.createtime)}
                </Text>
            </View>
        );
    }

    renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 5,
                    backgroundColor: '#CCCCCC',
                }}
            />
        );
    }

    render() {
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <NavBar title={'谁赞过我'}
                    leftImageSource={Back}
                    leftItemFunc={this.onClickBack.bind(this)}
                />
                <ListView
                    initialListSize={1}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.listData)}
                    renderRow={this.renderItem.bind(this)}
                    enableEmptySections={true}
                    renderSeparator={this.renderSeperator.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {  }}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: Height
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