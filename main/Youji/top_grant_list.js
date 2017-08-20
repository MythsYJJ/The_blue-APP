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
var Coin = require('../../img/youji/u505.png');

const attentionImages = [
    require('../../img/youquan/isAttention.png'),
    require('../../img/youquan/attentionOther.png'),
    require('../../img/youquan/attentionEach.png'),
]

const rankImages = [
    require('../../img/youji/TOP1.png'),
    require('../../img/youji/TOP2.png'),
    require('../../img/youji/TOP3.png')
];
var relationshipList = [];

//打赏TOP10页面
export default class TopGrantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            indexAllData: null,
        }

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        this._loadData();
    }

    async _loadData() {
        if (this.props.indexAllData) {
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'rewardrank/1/'
                + this.props.indexAllData.id
                + '?sid=' + global.sessionID
                + '&num=10');
            this.setState({
                listData: responseJson.data,
                indexAllData: this.props.indexAllData
            })
        }
    }

    componentDidMount() {

    }

    onClickBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _relationship(index) {
        console.log('图片index:' + index);
        switch (index) {
            case 0:
                return <View />;
            case 1:
                return <Image
                    source={attentionImages[0]}
                    resizeMode={'center'}
                    style={{ width: 48, height: 25 }}
                />;
            case 256:
                return <Image
                    source={attentionImages[1]}
                    resizeMode={'center'}
                    style={{ width: 48, height: 25 }}
                />;
            case 257:
                return <Image
                    source={attentionImages[2]}
                    resizeMode={'center'}
                    style={{ width: 48, height: 25 }}
                />;
        }
    }
    //关注某人
    async _attentionSomebody(bool, user, rowID) {
        if (bool) {
            let responseJson = await CustomSync.fetch(this,global.httpURL + 'follow',
                                                        'POST',
                                                        {'Content-Type': 'application/x-www-form-urlencoded'},
                                                        'sid=' + global.sessionID + '&id=' + user)
            Alert.alert('','关注完毕');
            let list = this.state.listData;
            switch (list[rowID].relationship) {
                case 0:
                    list[rowID].relationship = 256;
                    break;
                case 1:
                    list[rowID].relationship = 257;
                    break;
            };
            this.setState({ listData: list });
        } else {
            console.log('userid:' + user)
            console.log('个人id:' + global.sessionID)
            let responseJson = await CustomSync.fetch(this,
                                                global.httpURL +
                                                    'follow/' +
                                                    user +
                                                    '?sid=' +
                                                    global.sessionID,
                                                'DELETE')
            Alert.alert('','取消关注');
            let list = this.state.listData;
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
        let rank = parseInt(rowID) + 1;
        let userHeadImg = global.common.fileurl.imgavatar + article.avatar
        console.log(rank);
        console.log('头像地址：' + userHeadImg)
        console.log(article)
        return (
            <View style={{ flex: 1, width: Width, flexDirection: 'row', backgroundColor: '#fff' }}>
                {
                    rowID < 3 ?
                        <Image source={rankImages[rowID]}
                            style={{ width: 30, height: 30, position: 'absolute', left: 5, top: 0 }}
                            resizeMode='cover' />
                        :
                        <View style={{ width: 30, height: 30, borderRadius: 3, backgroundColor: '#ff9a6a', justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 5, top: 0 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff',backgroundColor:'transparent' }}>
                                {rank}
                            </Text>
                        </View>
                }
                <TouchableOpacity onPress={() => {  }} style={{ paddingLeft: 10, paddingTop: 30, paddingBottom: 5 }}>
                    {/*<Image
                        source={{ uri: userHeadImg }}
                        resizeMode={'cover'}
                        style={{ width: 50, height: 50, borderRadius: 24,
                                borderWidth: 2, borderColor: '#000' }}
                    />*/}
                    <CacheImage cacheType='head'
                        envUrl={global.common.fileurl.imgavatar}
                        url={article.avatar}
                        style={{
                            width: 50, height: 50, borderRadius: 24,
                            borderWidth: 2, borderColor: '#000'
                        }}
                        resizeMode='cover' />
                </TouchableOpacity>
                {
                    this._relationship(article.relationship)
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
                <View style={{ flexDirection: 'row-reverse', alignSelf: 'flex-end', position: 'absolute', right: 0, bottom: 0 }}>
                    <Image
                        source={Coin}
                        resizeMode={'cover'}
                        style={{ width: 30, height: 30, paddingRight: 5, alignSelf: 'flex-end' }}
                    />
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#ffcd31', paddingRight: 10, alignSelf: 'flex-end',backgroundColor:'transparent' }}>
                        {article.num}
                    </Text>
                    <Text style={{ fontSize: 12, paddingRight: 10, alignSelf: 'flex-end',backgroundColor:'transparent' }}>
                        累计打赏:
                    </Text>
                </View>
            </View>
        );
    }

    renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 5,
                    backgroundColor: '#ddd',
                }}
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ddd' }}>
                <NavBar title={'打赏英雄TOP10'}
                    leftImageSource={Back}
                    leftItemFunc={this.onClickBack.bind(this)}
                />
                <ListView
                    initialListSize={10}
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