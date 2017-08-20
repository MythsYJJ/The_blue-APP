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
import BuyProductDetail from './buyProductDetail';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
export default class Product_list extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds,
            listdata: [],
            yuepao:1
        }

        this._loadData = this._loadData.bind(this);
    }

    componentWillMount() {
        //测试数据
        /*let arr=[];
        arr.push({
            amount:1,
            buytype:0,
            category:1,
            createtime:1475058148,
            desc:'泰国顶级岛屿度假村',
            id:"1-30003-1475058148",
            productid:1,
            status:1,
            totalprice:5000
        })*/
        this._loadData();
    }

    componentWillReceiveProps(nextProps){
        console.log('订单详情componentWillReceiveProps');
        if(global.updateProductList){
            this._loadData();
        }
    }

    async _loadData() {
        let responseJson = await CustomSync.fetch(this,global.httpURL + 'orders/'
            + '?sid=' + global.sessionID);
        if(responseJson.data){
            this.setState({ listdata: responseJson.data })
            if(global.updateProductList){
                global.updateProductList = false;
            }
        }else{
            this.setState({ listdata: [] }) 
        }
        console.log('Mount', this.state.listdata)
    }

    findProduct(id) {
        // console.log(global.product)
        for (let key in global.product) {
            if (global.product[key].id == id) {
                return global.product[key]
            }
        }
    }

    goPayProductDetail(rowData){
        let id = rowData.id.substr(0,1);
        const {navigator} = this.props;
        if(navigator){
            navigator.push({
                name:'BuyProductDetail',
                component:BuyProductDetail,
                params:{
                    data:rowData,
                    id:id
                }
            })
        }
    }

    //单行数据-样式
    _renderRow(rowData, rowId) {
        let headImage = this.findProduct(rowData.productid).cover
        // console.log(headImage)
        return (
            <TouchableHighlight underlayColor={'rgba(0,0,0,.1)'}
                                onPress={this.goPayProductDetail.bind(this,rowData)}>
            <View style={{ backgroundColor: '#fff', paddingTop: 10,paddingBottom:10, marginBottom: 5 }}>
                <View>
                    {/*产品信息*/}
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        width: Width * .96, alignSelf: 'center',marginBottom:10
                    }}>
                        {/*图片*/}
                        {/*<Image source={{ uri: headImage }}
                                style={{resizeMode: 'cover',
                                        width: Width * .25, height: Width * .25}} />*/}
                        <CacheImage envUrl={''}
                                    url={headImage}
                                    style={{resizeMode: 'cover',
                                            width: Width * .2, height: Width * .2}}
                                    resizeMode='cover' />
                        {/*详细信息*/}
                        <View style={{ width: Width * .7, justifyContent: 'space-between', height: Width * .2 }}>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: '#333', fontWeight: 'bold',backgroundColor:'transparent' }}>{rowData.desc}</Text>
                                <Text style={{ color: '#999',backgroundColor:'transparent' }}>
                                    {new Date(parseInt(rowData.createtime) * 1000).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text style={{backgroundColor:'transparent'}}>
                                订单编号：
                                <Text style={{backgroundColor:'transparent'}}>{rowData.id}</Text>
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>
                                    度假费用：
                                    <Text style={{backgroundColor:'transparent'}}>{'¥' + rowData.totalprice}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/*联系客服*/}
                    <View style={{width:Width*.96,alignSelf:'center',height:1,backgroundColor:'#ddd',marginTop:5,marginBottom:5}}/>
                    <View style={{
                        flexDirection: 'row', width: Width * .96, alignSelf: 'center',
                        alignItems: 'center',paddingTop:5,paddingBottom:5
                    }}>
                        <Text style={{ color: "#1E1E1E",backgroundColor:'transparent' }}>
                            {rowData.status == 0 ?
                                '您已成功报名!请尽快支付定金以获取正式名额'
                              :
                                '您已成功付款！请保持手机畅通，以确保客服MM可以联系到您'
                            }
                        </Text>
                    </View>
                    <View style={{width:Width*.96,alignSelf:'center',height:1,backgroundColor:'#ddd',marginTop:5,marginBottom:5}}/>
                    <View style={{flexDirection:'row',width:Width*.96,alignSelf:'center',
                                    alignItems:'center',justifyContent:'space-between'}}>
                        {rowData.status == 0 ? 
                            <Text style={{color:'#e4393c',backgroundColor:'transparent'}}>待付款</Text>
                          :
                            <Text style={{color:'#1596fe',backgroundColor:'transparent'}}>已付款</Text>
                        }
                        {rowData.status == 0 ? 
                            <Text style={{color:"#1596fe",textDecorationLine:'underline',backgroundColor:'transparent'}}>前往支付>></Text>
                          :
                            <View/>
                        }
                    </View>
                </View>  
            </View>
            </TouchableHighlight>  
        )
    }
    _onEndRefresh() {
        console.log('触发底部刷新')
    }
    _onTopRefresh() {
        console.log('触发顶部刷新')
    }
    _renderList() {
        // this.state.listdata = this.props.listdata
        if (this.state.listdata && this.state.listdata.length > 0) {
            return (
                <ListView style={{}}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                    showsVerticalScrollIndicator={false}
                    initialListSize={8}
                    enableEmptySections={true}
                    onEndReachedThreshold={0}
                    onEndReached={this._onEndRefresh}
                    refreshControl={
                        <RefreshControl onRefresh={this._onTopRefresh}
                            refreshing={false} />
                    } />
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={{ flex: 1, backgroundColor: '#fff' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {  }}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../img/myself/u1269.png')}
                            style={{ resizeMode: 'contain', width: Width * .6 }} />
                        <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                            你还没有购买过任何产品哦～
                    </Text>
                        {/*<TouchableOpacity activeOpacity={0.8}
                            onPress={() => { this.goPayProductList() }}>
                            <Text style={{ fontSize: 16, textDecorationLine: 'underline' }}>
                                现在就去查看>>
                        </Text>
                        </TouchableOpacity>*/}
                    </View>
                </ScrollView>
            );
        }
    }
    goPayProductList() {
        console.log('去购买界面')
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ddd' }}>
                {this._renderList()}
            </View>
        )
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
    leftHead: {
        width: Width * 0.15,
        height: Width * 0.15,
        resizeMode: 'cover'
    },
    Name: {
        fontSize: 18,
        paddingLeft: 3
        // marginLeft: 5
    },
    smallImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover'
    },
    middleMain: {
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        width: Width * 0.5,
        paddingLeft: Width * 0.01
    },
    btnImage: {
        resizeMode: "contain",
        width: Width * 0.07,
        height: Height * 0.05
    },
    rightBtn: {
        backgroundColor: '#1596fe',
        width: Width * 0.28,
        height: Width * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    rightBtnText: {
        color: '#fff',
        fontSize: 16
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
})