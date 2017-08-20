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
import { toastShort } from '../../Toast/ToastUtil';
import CheckBox from 'react-native-checkbox';
import CustomSync from '../../sync';
import CacheImage from '../../component/cacheImage';

var Back = require('../../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Heart = require('../../img/youquan/payAttention.png');
var EmpHeart = require('../../img/youquan/noAttention.png');

const attentionImages = [
    require('../../img/youquan/isAttention.png'),
    require('../../img/youquan/attentionOther.png'),
    require('../../img/youquan/attentionEach.png'),
]

export default class NearGrantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            listData: [],
            refresh: false,
        }

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        this._loadData();
    }

    async _loadData() {
        if (this.props.travelID) {
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'rewardlog/1/' + this.props.travelID + '?sid='
                + global.sessionID
                + '&offset=0'
                + '&num=50');
            this.setState({
                listData: responseJson.data,
                travelID: this.props.travelID,
                sessionID: global.sessionID,
                userId: global.userInformation.userid
            })
        }
    }

    _backTravelNote() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _onTopRefresh() {
        this.setState({
            refresh: true
        })
        console.log('顶部刷新')
        setTimeout(function () {
            this.setState({
                refresh: false
            })
        }.bind(this), 5000)
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
                                                    'DELETE')
            Alert.alert('','取消关注完成');
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
    _relationship(index) {
        console.log('图片index:' + index);
        switch (index) {
            case 0:
                return (<View style={styles.dataTitleAttention} />);
            case 1:
                return (<Image source={attentionImages[0]}
                    style={styles.dataTitleAttention} />)
            case 256:
                return (<Image source={attentionImages[1]}
                    style={styles.dataTitleAttention} />)

            case 257:
                return (<Image source={attentionImages[2]}
                    style={styles.dataTitleAttention} />)

        }
    }

    _renderRow(rowData, rowId) {
        let HeadImage = global.common.fileurl.imgavatar + rowData.avatar
        return (
            <View style={styles.listDataView}>
                <View style={styles.headImageView}>
                    <TouchableOpacity style={styles.headImageBtn}
                        activeOpacity={0.8}>
                        {/*<Image source={{ uri: HeadImage }}
                            style={styles.headImage} />*/}
                        <CacheImage cacheType="head"
                            envUrl={global.common.fileurl.imgavatar}
                            url={rowData.avatar}
                            style={styles.headImage}
                            resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.dataMainView}>
                    <TouchableOpacity activeOpacity={0.9}>
                        <View style={styles.dataTitleView}>
                            {this._relationship(rowData.relationship)}
                            <Text style={styles.dataTitleText}>{CustomSync.getRemark(rowData.userid, rowData.nickname)}</Text>
                        </View>
                    </TouchableOpacity>
                    {/*打赏数量*/}
                    <View style={styles.grantTextView}>
                        <Text style={styles.grantText}>
                            给您打赏&nbsp;
                            <Text style={styles.grantNum}>{rowData.num}</Text>
                        </Text>
                        <Image source={require('../../img/youji/u505.png')} style={styles.grantImage} />
                    </View>
                    {/*打赏时间*/}
                    <Text style={styles.grantTime}>
                        {this._getTime(rowData.createtime)}
                    </Text>
                </View>
                <View style={styles.moreBtn}>
                    <View style={styles.mainBtnView}>
                        <CheckBox label={''}
                            containerStyle={styles.attentionImage}
                            checkedImage={Heart}
                            uncheckedImage={EmpHeart}
                            checked={this._isChecked(rowData.relationship)}
                            onChange={(data) => {
                                this._attentionSomebody(!data, rowData.userid, rowId)
                            }
                            } />
                        <TouchableOpacity activeOpacity={0.8}
                            onPress={() => { }}>
                            <Image source={require('../../img/youquan/sendMessage.png')}
                                style={styles.btnImage} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <NavBar leftItemFunc={this._backTravelNote.bind(this)}
                    leftImageSource={Back}
                    barBGColor='#1596fe'
                    titleTextColor='#fff'
                    title='最近打赏' />
                <ListView dataSource={this.state.dataSource.cloneWithRows(this.state.listData)}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                    initialListSize={10}
                    enableEmptySections={true}
                    onEndReachedThreshold={0}
                    onEndReached={this._onEndRefresh}
                    refreshControl={
                        <RefreshControl onRefresh={this._onTopRefresh.bind(this)}
                            refreshing={this.state.refresh}
                            colors={['#1596fe', '#e4393c', 'green', 'yellow']} />
                    } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    listDataView: {
        width: Width,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 5
    },
    headImageView: {
        width: Width * 0.2,
        alignItems: 'center',
    },
    headImage: {
        width: Width * 0.18,
        height: Width * 0.18,
        resizeMode: 'contain',
        borderRadius: Width * 0.09,
    },
    headImageBtn: {
        marginTop: 5
    },
    dataMainView: {
        width: Width * 0.6,
    },
    moreBtn: {
        width: Width * 0.2,
        justifyContent: 'space-between',
        paddingRight: Width * 0.03
    },
    dataTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Height * 0.01
    },
    dataTitleAttention: {
        resizeMode: 'contain',
        width: Width * 0.15,
    },
    dataTitleText: {
        fontSize: 20,
        marginLeft: Width * 0.01,
        fontWeight: 'bold',
        backgroundColor:'transparent'
    },
    mainBtnView: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    btnImage: {
        resizeMode: "contain",
        width: Width * 0.07,
        height: Height * 0.05
    },
    attentionImage: {
        width: Width * 0.07,
        height: Height * 0.05
    },
    grantTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    grantText: {
        alignSelf: 'center',
        color: '#666',
        fontSize: 16,
        backgroundColor:'transparent'
    },
    grantNum: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#444',
        backgroundColor:'transparent'
    },
    grantImage: {
        resizeMode: 'contain',
        width: Width * 0.07,
        height: Width * 0.07
    },
    grantTime: {
        alignSelf: 'flex-end',
        color: '#999',
        marginTop: 5,
        backgroundColor:'transparent'
    }
})