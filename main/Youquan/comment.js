import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Platform,
    TextInput,
    ScrollView,
    Modal,
    ListView,
    RefreshControl,
    Keyboard,
    Alert
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Navbar from '../../component/navbar';
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
var length2 = 1;
const attentionImages = [
    require('../../img/youquan/isAttention.png'),
    require('../../img/youquan/attentionOther.png'),
    require('../../img/youquan/attentionEach.png'),
]

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            indexAllData: null,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            listData: [],
            refresh: false,
            isResponseSomebody: false,
            talkToSomebody: null,
            textInputMult: 1,
            inputHeight: 30,
            isChecked: true,
        }

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        this._loadData();
    }

    async _loadData() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        if (this.props.indexAllData) {
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'comments/1/'
                + this.props.indexAllData.id
                + '?sid=' + sessionID
                + '&num=50'
                + '&offset=0')
            console.log(responseJson)
            this.setState({
                listData: responseJson.data,
                userId: global.userInformation.userid,
                indexAllData: this.props.indexAllData,
                beignored:this.props.indexAllData.beignored
            })
        }
        if(this.props.suibi){
            let responseJson = await CustomSync.fetch(this, global.httpURL + 'comments/1/'
                + this.props.suibi
                + '?sid=' + sessionID
                + '&num=50'
                + '&offset=0')
            console.log('随笔评论列表',responseJson)
            this.setState({
                listData: responseJson.data,
                userId: global.userInformation.userid,
                
            })
        }
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
    }

    _keyboardDidHide() {
        this.setState({
            isResponseSomebody: false,
            inputHeight: 30
        })
        length2 = 1
    }
    _keyboardWillHide() {
        this.setState({ isResponseSomebody: false })
    }

    backLogin() {
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
    //弹出键盘并对话
    _response(rowData = null) {
        if(rowData){
            this.setState({
                isResponseSomebody: true,
                talkToSomebody: rowData
            }, function () {
                this._Input.focus()
            })
        }else{
            this.setState({
                isResponseSomebody:true,
                talkToSomebody:null
            },()=>{
                this._Input.focus()
            })
        }
    }

    async _sendMessage(){
        let URL = '';
        if(this.props.indexAllData){
            URL = global.httpURL+'comments/1/'+this.state.indexAllData.id;
        }
        if(this.props.suibi){
            URL = global.httpURL+'comments/1/'+this.props.suibi;
        }
        let text = this.state.text;
        console.log(text);
        console.log(URL);
        let formData = new FormData();
        formData.append('sid',global.sessionID);
        formData.append('content',text);
        if(this.state.talkToSomebody){
            formData.append('refer',this.state.talkToSomebody.nickname)
        };
        try{
        let responseJson = await CustomSync.fetch(this,
                                                URL,
                                                'POST',
                                                {'Content-Type': 'multipart/form-data'},
                                                formData)
        console.log(responseJson);
        if(responseJson.status == 1){
            let list = this.state.listData;
            await this.setState({listData:[]})
            console.log('游记id,个人信息')
            console.log(this.state.indexAllData);
            console.log(global.userInformation);
            let userInfo = global.userInformation
            let rowData = new Object();
            rowData.avatar = userInfo.avatar;
            rowData.content = text;
            rowData.createtime = new Date().getTime()/1000;
            rowData.nickname = userInfo.nickname;
            //rowData.relationship =
            rowData.sex = userInfo.sex;
            rowData.userid = userInfo.userid;
            if(this.state.talkToSomebody){
                rowData.refer=this.state.talkToSomebody.nickname;
                rowData.relationship = this.state.talkToSomebody.relationship;
            }else{
                rowData.target = 1
                rowData.targetId = this.props.suibi ? this.props.suibi : this.state.indexAllData.id;
            }
            vipgrade = userInfo.vipgrade;
            list.unshift(rowData);
            this.setState({
                listData:list,
                talkToSomebody:null,
                isResponseSomebody:null
            },()=>{
                this._Input.blur();
            });
        };
        //let responseJson = await CustomSync.fetch()
        }catch(err){console.log(err)}
    }

    _hideInput() {
        if (this.state.isResponseSomebody) {
            this.setState({ isResponseSomebody: false })
        }
    }
    _changeText(text) {
        this.setState({
            text:text
        })
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
    //关注某人
    async _attentionSomebody(bool, user, rowID) {
        /*点击单个按钮全体发送请求，bug待修复*/
        if (bool) {
            let responseJson = await CustomSync.fetch(this,global.httpURL + 'follow',
                                                        'POST',
                                                        {'Content-Type': 'application/x-www-form-urlencoded'},
                                                        'sid=' + global.sessionID + '&id=' + user)
            console.log(responseJson);
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
            let responseJson = await CustomSync.fetch(this,
                                                global.httpURL +
                                                    'follow/' +
                                                    user +
                                                    '?sid=' +
                                                    global.sessionID,
                                                'DELETE')
            console.log(responseJson);
            Alert.alert('取消关注');
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
                return (<View style={{width:Width*.15}} />);
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
    _getTime(data) {
        data = new Date(data * 1000);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        return year + '-' + month + '-' + date;
    }
    _renderRow(rowData, rowId) {
        let userId = this.state.userId;
        //用户头像uri
        let userHeadImg = global.common.fileurl.imgavatar + rowData.avatar
        //当前行用户id
        let rowUser = rowData.userid;
        let masterId = this.props.suibiData ? this.props.suibiData.userid : this.state.indexAllData.userid;
        console.log('楼层id：' + rowUser)
        console.log('自己id：' + userId)
        console.log(rowData)
        return (
            <View style={styles.listDataView} key={rowId}>
                {/*增加'主人'判断*/}
                {
                    rowUser == masterId ?
                        <Text style={styles.owner}>主人</Text>
                        :
                        <View />
                }
                {/*增加‘自己’判断*/}
                {
                    rowUser == global.userInformation.userid ?
                        <Text style={styles.myself}>自己</Text>
                        :
                        <View />
                }
                <View style={styles.headImageView}>
                    <TouchableOpacity style={styles.headImageBtn}
                        activeOpacity={0.8}>
                        <Image source={{ uri: userHeadImg }}
                            style={styles.headImage} />
                        {/*<CacheImage cacheType='head'
                                    envUrl={global.common.fileurl.imgavatar}
                                    url={rowData.avatar}
                                    style={styles.headImage}
                                    resizeMode='cover' />*/}
                    </TouchableOpacity>
                </View>
                <View style={styles.dataMainView}>
                    <TouchableOpacity activeOpacity={0.9}>
                        <View style={styles.dataTitleView}>
                            {this._relationship(rowData.relationship)}
                            <Text style={styles.dataTitleText}>{CustomSync.getRemark(rowData.userid, rowData.nickname)}</Text>
                        </View>
                    </TouchableOpacity>

                    {
                        rowData.refer ?
                            <Text style={styles.responseSomebody}>
                                对&nbsp;
                                <Text style={styles.somebody}>
                                    {rowData.refer}
                                </Text>
                                &nbsp;说：
                            </Text>
                            :
                            <View style={{ marginBottom: Height * 0.02 }} />
                    }
                    <Text style={styles.commentText}>
                        {rowData.content}
                    </Text>
                    <Text style={styles.commentTime}>
                        {this._getTime(rowData.createtime)}
                    </Text>
                </View>
                {
                    rowUser == global.userInformation.userid ?
                        <View  style={styles.moreBtn}/>
                        :
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
                            <View style={styles.responseBtnView}>
                                <TouchableOpacity activeOpacity={0.8}
                                    onPress={() => { this._response(rowData) }}>
                                    <Image source={require('../../img/youquan/response.png')}
                                        style={styles.btnImage} />
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </View>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                <Navbar leftItemFunc={this.backLogin.bind(this)}
                    leftImageSource={Back}
                    barBGColor='#1596fe'
                    titleTextColor='#fff'
                    title='评论' />
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
                    }
                    keyboardDismissMode={'on-drag'}
                    onScroll={this._hideInput.bind(this)} />
                {
                    this.state.isResponseSomebody ?
                        <View style={styles.responseModalView}>
                            {this.state.talkToSomebody ?
                                <Text style={{backgroundColor:'transparent'}}>
                                    对&nbsp;
                                    <Text style={styles.somebody}>{this.state.talkToSomebody.nickname}</Text>
                                    &nbsp;说：
                                </Text>
                              :
                                <View/>
                            }
                                <View style={styles.responseInputView}>
                                    <TextInput ref={(ref) => this._Input = ref}
                                        multiline={true}
                                        style={[styles.responseInput, { height: this.state.inputHeight }]}
                                        onChangeText={(text) => { this._changeText(text) }}
                                        underlineColorAndroid={'transparent'}
                                        includeFontPadding={false} />
                                    {
                                        Platform.OS === 'iso' ? 
                                            <KeyboardSpacer topSpacing={20}/>
                                          :
                                            <View/>
                                    }
                                    <TouchableOpacity activeOpacity={0.8}
                                                    style={styles.responseBtn}
                                                    onPress={this._sendMessage.bind(this)}>
                                        <Text style={styles.responseBtnText}>发送</Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                        :
                        <View />
                }
                {
                    !this.state.isResponseSomebody ?
                        !this.state.beignored ?
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={()=>{this._response()}}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: Width,
                                    borderRadius: 5,
                                    backgroundColor: '#1596fe',
                                    height: Height * 0.06
                                }}>
                                <Text style={{
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    fontSize: 17
                                }}>发表评论</Text>
                            </TouchableOpacity>
                          :
                            <TouchableOpacity activeOpacity={0.8}
                                onPress={()=>{this._response()}}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: Width,
                                    borderRadius: 5,
                                    backgroundColor: '#bbb',
                                    height: Height * 0.06
                                }}
                                disabled = {true}>
                                <Text style={{
                                    backgroundColor: 'transparent',
                                    color: '#fff',
                                    fontSize: 17
                                }}>您已被该用户列入黑名单</Text>
                            </TouchableOpacity>
                        :
                        <View />
                }
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
        resizeMode: 'cover',
        borderRadius: Width * 0.09,
    },
    owner: {
        backgroundColor: '#ff99ff',
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#fff',
        padding: 1,
        borderRadius: 5,
        zIndex: 100
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
    responseSomebody: {
        fontSize: 15,
        marginBottom: Height * 0.01,
        color: '#999',
        backgroundColor:'transparent'
    },
    somebody: {
        fontWeight: 'bold',
        color: '#000',
        backgroundColor:'transparent'
    },
    commentText: {
        fontSize: 16,
        color: '#555',
        backgroundColor:'transparent'
    },
    commentTime: {
        alignSelf: 'flex-end',
        color: '#999',
        backgroundColor:'transparent'
    },
    myself: {
        backgroundColor: '#1596fe',
        textAlign: 'center',
        position: 'absolute',
        top: 3,
        right: 3,
        color: '#fff',
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 5,
        zIndex: 100,
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
    responseBtnView: {
        alignItems: 'flex-end'
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