import React,{Component,PropTypes} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    RefreshControl,
    ScrollView,
    ListView,
    TouchableHighlight,
    Alert
} from 'react-native';

import NavBar from '../component/navbar';
import CustomSync from '../sync';
import productinfo from '../ProductView/Productinfo'
import product from '../ProductView/Product'
import {toastShort} from '../Toast/ToastUtil';
import CacheImage from '../component/cacheImage';
import BuyProduct from '../ProductView/buyProduct';
var Spinner = require('react-native-spinkit');

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');

//修改背景 or 假日优选 or 活动专区
export default class ChooseUserinfoBg extends React.Component{
    constructor(props) {
        var ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        super(props);
        this.state = {
            dataSource:ds,
            listdata:[],
            update:false
        }
        this._loadData = this._loadData.bind(this);
    }
    componentWillMount() {
        this._loadData();
    }

    async _loadData(){
        this.setState({update:true})
        if (!this.props.activity) {
            !this.props.choosebg ?
                this.state.listdata = global.product
                : [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008]
            this.setState({ listdata: this.state.listdata,update:false })
            console.log('adasdasd',this.state.listdata)
        }else{
            fetch(`${global.httpURL}group/list`)
                .then(response=>response.json())
                .then(responseJson=>{
                    console.log('主播列表',responseJson)
                    this.setState({listdata:responseJson,update:false});
                })
        }
    }

        //单行数据-样式
    _renderRow(rowData,rowId){
        // console.log('rowData',rowData)
        let img =''
        if (!this.props.activity) {
            img = (this.props.choosebg?global.common.fileurl.imgbgurl + rowData + '.jpg':
        rowData.cover)
        }else{
            //img = rowData.url
            img = `${global.httpURL}static/group/${rowData.id}/banner.jpg`;
        }
        console.log('img',img)
        return (
            <View style={styles.container} key={rowId}>
                <TouchableOpacity activeOpacity={0.8}
                    onPress={() => { this.alartChooseInfo(rowData) }}>
                    <View style={{alignSelf:'center',marginBottom:3}}>
                        <Image source={{ uri:  img}} style={styles.leftHead}>
                            {this.props.activity ? 
                                rowData.is_open == 1 ?
                                    (new Date().getTime() >= parseInt(rowData.deadline*1000)) ?
                                        <View style={{position:'absolute',bottom:0,backgroundColor:'rgba(0,0,0,.5)',width:Width*.98,
                                                        flexDirection:'row',justifyContent:'flex-end',alignItems:'center',
                                                        paddingRight:Width*.03}}>
                                            <Text style={{color:'#fff',fontSize:17,fontWeight:'bold',backgroundColor:'transparent'}}>报名已截止</Text>
                                        </View>
                                      :
                                        <View style={{position:'absolute',bottom:0,backgroundColor:'rgba(0,0,0,.5)',width:Width*.98,
                                                        flexDirection:'row',justifyContent:'flex-end',alignItems:'center',
                                                        paddingRight:Width*.03}}>
                                            {/*<Text style={{color:'#fff',fontSize:17,fontWeight:'bold',backgroundColor:'transparent'}}>参与人数：</Text>
                                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginLeft:Width*.01}}>
                                                <Text style={{position:'relative',top:-5,right:0,fontSize:20,color:'rgba(255, 153, 0, 0.8)'
                                                                ,fontWeight:'bold',backgroundColor:'transparent'}}>{rowData.personlist.length}</Text>
                                                <Text style={{fontSize:30,color:'#fff',backgroundColor:'transparent'}}>/</Text>
                                                <Text style={{position:'relative',bottom:-5,left:0,fontSize:18,color:'#fff',
                                                                fontWeight:'bold',backgroundColor:'transparent'}}>{rowData.total}</Text>
                                            </View>*/}
                                            {
                                                (parseInt(rowData.personlist.length) >= parseInt(rowData.total)) ? 
                                                    <Text style={{color:'#fff',fontSize:17,fontWeight:'bold',backgroundColor:'transparent',padding:3}}>
                                                        报名人数已满
                                                    </Text>
                                                  :
                                                    ((parseInt(rowData.min_person) -  parseInt(rowData.personlist.length)) >= 0) ? 
                                                        <Text style={{color:'#fff',fontSize:17,fontWeight:'bold',backgroundColor:'transparent',padding:3}}>
                                                            剩余可报名人数为
                                                            <Text style={{fontSize:17,color:'rgba(255, 153, 0, 0.8)',fontWeight:'bold',backgroundColor:'transparent',
                                                                            paddingLeft:3,paddingRight:3}}>
                                                                {parseInt(rowData.total) -  parseInt(rowData.personlist.length)}
                                                            </Text>
                                                            人
                                                        </Text>
                                                    :
                                                        <Text style={{color:'#fff',fontSize:17,fontWeight:'bold',backgroundColor:'transparent',padding:3}}>
                                                            再有
                                                            <Text style={{fontSize:17,color:'rgba(255, 153, 0, 0.8)',fontWeight:'bold',backgroundColor:'transparent',
                                                                            paddingLeft:3,paddingRight:3}}>
                                                                {parseInt(rowData.min_person) -  parseInt(rowData.personlist.length)}
                                                            </Text>
                                                            人报名即可成团
                                                        </Text>
                                            }
                                        </View>
                                  :
                                    <View style={{position:'absolute',bottom:0,backgroundColor:'rgba(0,0,0,.5)',width:Width*.98,
                                                    flexDirection:'row',justifyContent:'flex-end',alignItems:'center',
                                                    paddingRight:Width*.03}}>
                                        <Text style={{color:'#fff',fontSize:17,fontWeight:'bold',backgroundColor:'transparent'}}>敬请期待</Text>
                                    </View>
                              :
                                <View/>
                            }
                        </Image>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

     alartChooseInfo(rowData){
        !this.props.activity?
            (this.props.choosebg?
                Alert.alert(
                        '确认使用',
                        '确认使用此背景吗',
                        [
                            { text: '取消', onPress: () => console.log('Foo Pressed!') },
                            {
                                text: '确认', onPress: () => {
                                    // this.payotherpeopleinfo.bind(this)(group.Id)
                                    this.ChooseInfo(rowData)
                                }
                            },
                        ]
                    )
              :
                this.goProductInfo(rowData))
          :
            this._girlHtml(rowData)
    }

    _girlHtml(rowData){
        let list = rowData.personlist;
        let arr = [];
        list.forEach(value => arr.push(value));
        const {navigator} = this.props;
        if(navigator){
            let canApply = true;
            let isOpen = true;
            if(rowData.is_open == 0){
                isOpen = false;
            }
            if(rowData.deadline){
                let time = new Date().getTime();
                console.log(time);  
                if(time >= parseInt(rowData.deadline*1000)){
                    canApply = false;
                }
            }
            console.log(canApply);
            navigator.push({
                name:'productinfo',
                component:productinfo,
                params:{
                    data:rowData,
                    url:`${global.httpURL}static/group/${rowData.id}/index.html?personNum=${arr.length}&personAll=${rowData.total}&canApply=${canApply}&isOpen=${isOpen}&minPerson=${rowData.min_person}`,
                    girlActivity:true
                }
            })
        }
        
    }

    goProductInfo(rowData,act=true){
        let url = !this.props.activity?rowData.desc:rowData.args
        const {navigator}=this.props;
         if(navigator){
            navigator.push({
                name:'productinfo',
                component:productinfo,
                params:{
                    url:url,
                    activity:act,
                    data:rowData
                }
            })
        }
    }
    async ChooseInfo(rowData){
        let params = 'sid=' + global.sessionID
                    + '&bgimg=' + rowData
                    console.log(rowData)
        try {
            let responseJson = await CustomSync.fetch(this,
                                        global.httpURL + 'profile',
                                        'PUT',
                                        {'Content-Type': 'application/x-www-form-urlencoded'},
                                        params)
            console.log(responseJson)
            if (responseJson.status == 1) {
                Alert.alert('','使用成功')
                this.backView()
                // await CustomSync.setObjectForKey('userInformation', this.state.userInformation);
            }
        } catch (err) {
            console.log(err)
        }
   }

     _onEndRefresh(){
        console.log('触发底部刷新')
    }
    _onTopRefresh(){
        this._loadData();
        console.log('触发顶部刷新')
    }
    _renderList() {

        if (this.state.listdata) {
            return (
                <ListView style={{marginTop:5}}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.listdata)}
                    renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, rowId)}
                    showsVerticalScrollIndicator={false}
                    initialListSize={8}
                    refreshControl={
                        <RefreshControl onRefresh={this._onTopRefresh.bind(this)}
                            refreshing={false} />
                    } />
            )
        } else {
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => { }}
                            title="Loading..."
                            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                        />
                    }
                >
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                            {this.props.choosebg?'没有任何图片可以选择做背景哦~':''}
                    </Text>
                    </View>
                </ScrollView>
            );
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <NavBar title={!this.props.activity?(this.props.choosebg?'背景图库':'假日优选'):'活动专区'}
                    rightItemvisible={!this.props.activity?(!this.props.choosebg):false}
                    rightItemTitle={'已买到的'}
                    rightTextColor={'#fff'}
                    rightItemFunc={this.goMyProduct.bind(this)}
                    leftitemvisible={true}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                {this.state.update ? 
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',
                                    backgroundColor:'#fff'}}>
                        <Spinner style={styles.spinner}
                        isVisible={true}
                        size={100}
                        type={'ChasingDots'} color={'#1596fe'}/>
                    </View>
                  :
                    <View style={{ flex: 1 }}>
                        {this._renderList()}
                    </View>
                }
            </View>
        )
    }
    goMyProduct(){
        const {navigator}=this.props;
         if(navigator){
            navigator.push({
                name:'product',
                component:product,
            })
        }
    }
    backView() {
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#fff',
    },
    middleMain:{
        flexDirection:'row',
        justifyContent:'flex-start',
        width:Width,
        marginBottom:3,
        paddingLeft:10,

    },
    leftHead: {
        width: Width*.98,
        height:Height*.25,
        resizeMode: 'cover',
    },
    Name:{
        width:Width*.25,
        fontSize:18,
        paddingLeft:3,
        alignSelf:'flex-start',
        // marginLeft: 5
    },
})
