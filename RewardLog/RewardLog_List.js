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
    TouchableHighlight
} from 'react-native';
import { toastShort } from '../Toast/ToastUtil';
import CustomSync from '../sync';
import CacheImage from '../component/cacheImage';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
export default class AttentionList extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listdata: [],
            user:null

        }

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        this._loadData();
    }

    async _loadData() {
        let responseJson = await CustomSync.fetch(this,global.httpURL + 'rewardlog/1/all'
            + '?sid=' + global.sessionID
            + '&num=' + 8);
        this.setState({
            listdata: responseJson.data && responseJson.data.length > 0 ? responseJson.data : [],
            user: userInformation
        })
        console.log('我的里程数', this.state.listdata)
    }

    //单行数据-样式
    _renderRow(rowData, rowId) {
        // console.log(headImage)
        let YOUJI = rowData.title;
        YOUJI.length > 8 ? YOUJI = YOUJI.substring(0, 8) + '...' : YOUJI;
        return (
            <View style={{
                flexDirection: 'row', marginTop: 1, backgroundColor: '#fff', width: Width,
                paddingLeft: Width * .02, paddingRight: Width * .02,
                paddingTop: 5, paddingBottom: 5
            }}>
                <Image source={require('../img/myself/u826.png')} style={styles.sex} />
                <View style={{ flexDirection: 'column', width: Width * .88 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{
                            textDecorationLine: 'underline',
                            color: '#fe7a23',
                            backgroundColor:'transparent'
                        }}>
                            {CustomSync.getRemark(rowData.userid, rowData.nickname)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={{backgroundColor:'transparent'}}>
                            对
                            <Text style={{ color: '#49adfe',backgroundColor:'transparent' }}>
                                《{YOUJI}》
                            </Text>
                            进行了
                            <Text style={{color: rowData.rewardtype == 0 ?'#FF0066':'#66CC66',
                                        fontWeight:'bold',backgroundColor:'transparent'}}>
                                {rowData.rewardtype == 0 ? '打赏' : '购买'}
                            </Text>
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' ,
                                   marginTop:5}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#999',backgroundColor:'transparent'}}>获得里程数 </Text>
                            <Text style={{color:'#FF9900',fontWeight:'bold',fontSize:16,backgroundColor:'transparent'}}>
                                {rowData.num}
                            </Text>
                        </View>
                        <Text style={{color:'#999',backgroundColor:'transparent'}}>
                            {new Date(parseInt(rowData.createtime) * 1000).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    _onEndRefresh(){
        console.log('触发底部刷新')
    }

    _onTopRefresh(){
        console.log('触发顶部刷新')
    }

    _renderList(){
        // this.state.listdata = this.props.listdata
        if(this.state.listdata && this.state.listdata.length > 0 ){
            return (
                <ListView   style={{}}
                            dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                            renderRow={(rowData,sectionId,rowId)=>this._renderRow(rowData,rowId)}
                            showsVerticalScrollIndicator={false}
                            initialListSize={8}
                            enableEmptySections={true}
                            onEndReachedThreshold={0}
                            onEndReached={this._onEndRefresh}
                            refreshControl={
                                <RefreshControl onRefresh={this._onTopRefresh}
                                                refreshing={false}/>
                            }/>
            )
        }else{
            return (
                <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={false}
                contentContainerStyle={styles.no_data}
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={()=>{}}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                }
                >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                    你还没有游记被打赏哦～
                    </Text>
                    {/*<TouchableOpacity activeOpacity={0.8}
                        onPress={() => { this.goPayProductList()}}>
                        <Text style={{ fontSize: 16,textDecorationLine: 'underline' }}>
                           现在就去发布游记吧>>
                        </Text>
                    </TouchableOpacity>*/}
                </View>
                </ScrollView>
            );
        }
    }
    
    goPayProductList()
    {
        console.log('去购买界面')
    }

    render(){
        let headImage='';
        if(this.state.user){
            headImage= global.common.fileurl.imgavatar+this.state.user.avatar;
        }
        return (
            <View style={{flex:1,backgroundColor:'#ddd'}}>
                {/*头部个人信息(包括'历史记录'字样)*/}
                <View>
                    <View style={styles.container}>
                        {/*头像*/}
                        <View style={{justifyContent:'center',width:Width*.25}}>
                            <Image source={{uri:headImage}} style={styles.leftHead}/>
                            {/*<CacheImage cacheType='head'
                                        envUrl={global.common.fileurl.imgavatar}
                                        url={this.state.user.avatar}
                                        style={styles.leftHead}
                                        resizeMode='cover' />*/}
                        </View>
                        {/*信息*/}
                        <View style={styles.middleMain}>
                            <View style={{justifyContent: 'flex-start' }}>
                                <Text style={styles.Name}>{this.state.user?this.state.user.nickname:''}</Text>
                            </View>
                            <View style={{justifyContent:'flex-end',marginTop:10}}>
                                <Text style={{fontSize:15,textAlignVertical:'bottom',backgroundColor:'transparent'}}>当前里程数:</Text>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',
                                              paddingLeft:Width*.05}}>
                                    <View style={{flexDirection:'row',marginRight:Width*.05,alignItems:'center'}}>
                                        <Text style={{textAlignVertical:'center',textAlign:'center',
                                                      color:'#fa9900',fontSize:19,fontWeight:'bold',
                                                      marginRight:Width*.02,backgroundColor:'transparent'}}>
                                            {this.state.user?this.state.user.mileage:0}
                                        </Text>
                                        <Image source={require('../img/myself/u379.png')}
                                               style={{resizeMode:'contain',
                                                       width:Width*.05,height:Width*.05}}/>
                                    </View>
                                    {/*提现按钮*/}
                                    {/*<View style={{justifyContent:'center'}}>
                                        <Text style={{backgroundColor:'#1596fe',color:'#fff',
                                                      textAlignVertical:'center',textAlign:'center',
                                                      paddingLeft:8,paddingRight:8,fontSize:15,
                                                      paddingTop:3,paddingBottom:3}}
                                              onPress={()=>{alert('点击提现')}}>
                                            提现
                                        </Text>
                                    </View>*/}
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{width:Width,backgroundColor:'#fff',paddingTop:5,paddingBottom:5}}>
                        <Text style={{fontWeight:'bold',marginLeft:Width*.1,fontSize:16,backgroundColor:'transparent'}}>
                            {'历史记录'}
                        </Text>
                        <View style={{width:Width*.96,height:2,
                                      backgroundColor:'#333',alignSelf:"center",marginTop:3}}/>
                    </View>
                </View>
                {this._renderList()}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        width:Width,
        marginBottom:3,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'space-between'
    },
    sex:{
        width:Width*0.07,
        height:Width*0.07,
        resizeMode:'contain',
        position:'relative',
        top:-2
    },
    leftHead:{
        width:Width*0.2,
        height:Width*0.2,
        resizeMode:'cover',
        borderRadius:Width*0.1,
        borderWidth:2,
        borderColor:'#ffcc00'
    },
    Name:{
        fontSize:18,
        paddingLeft:3,
        color:'#222',
        backgroundColor:'transparent'
        // marginLeft: 5
    },

    Title:{
         fontSize:18,
        paddingLeft:3,
        color: '#6699FF'
    },
    smallImage:{
        width:20,
        height:20,
        resizeMode:'cover'
    },
    middleMain:{
        justifyContent:'space-between',
        paddingTop:5,
        paddingBottom:10,
        paddingRight:Width*.05,
        width:Width*0.7,
        position:'relative',
        top:5
    },
    btnImage:{
        resizeMode:"contain",
        width:Width*0.07,
        height:Height*0.05
    },
    rightBtn:{
        backgroundColor:'#1596fe',
        width:Width*0.28,
        height:Width*0.08,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    rightBtnText:{
        color:'#fff',
        fontSize:16
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
})