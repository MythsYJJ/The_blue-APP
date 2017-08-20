import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ScrollView,
    Platform,
    ListView,
    RefreshControl
} from 'react-native';
import NavBar from '../component/navbar';
import Button from '../component/button';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
//import Swipeout from 'react-native-swipeout';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class Youji extends React.Component{
    constructor(props){
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            basic: true,
            listViewData: Array(20).fill('').map((_,i)=>`item #${i}`)
        }
    }

    deleteRow(secId, rowId, rowMap) {
		rowMap[`${secId}${rowId}`].closeRow();
		const newData = [...this.state.listViewData];
		newData.splice(rowId, 1);
		this.setState({listViewData: newData});
	}

    GoNewNote() {
        alert('点击新增')
    }

    onEndReached() {
        alert('触发底部刷新')
    }

    renderItem(data, secId, rowId, rowMap) {
        return (
            
                <SwipeRow
                    disableRightSwipe={true}
                    rightOpenValue={-75}
                >
                    <View style={styles.rowBack}>
                        <Text style={{backgroundColor:'transparent'}}>Left Hidden</Text>
                        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(secId, rowId, rowMap) }>
                            <Text style={styles.backTextWhite}>删除</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={()=>{alert('点击了'+data)}} activeOpacity={1}>
                        <View style={styles.rowFront}>
                            <View style={styles.rowFrontLeft}>
                                <View>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={require('../img/locate.png')} style={styles.smallImage}/>
                                        <Text style={{backgroundColor:'transparent'}}>马尔代夫</Text>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                        <Image source={require('../img/time.png')} style={styles.smallImage}/>
                                        <Text style={{backgroundColor:'transparent'}}>2016.11.12</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rowFrontRight}>
                                <Text style={styles.text_content_title}
                                >
                                    {'游记标题最长'+data+'...'}
                                </Text>
                                <Text style={styles.text_content}
                                >
                                    游记标题最长十个字啊阿斯顿发士大夫撒打算的发送到发送到发送到发送到发送到发送到发...
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </SwipeRow>
        );
    }

     _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
        return (
        <View
            key={`${sectionID}-${rowID}`}
            style={{
            height: 5,
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
            }}
        ></View>
        );
    }

    renderContent(dataSource) {
        const isEmpty = this.state.listViewData === undefined || this.state.listViewData.length === 0;
        if (isEmpty) {
            return (
                <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={false}
                contentContainerStyle={styles.no_data}
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={()=>{alert('刷新了')}}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                }
                >
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16,backgroundColor:'transparent' }}>
                    目前没有数据，请刷新重试……
                    </Text>
                </View>
                </ScrollView>
            );
        }
        return (
        <ScrollableTabView locked={true}
                           tabBarUnderlineStyle={{backgroundColor:'#1596fe'}}
                           tabBarBackgroundColor='#FFFFFF'
                           tabBarActiveTextColor='#1596fe'
                           tabBarInactiveTextColor='rgba(0,0,0,.7)'
                           tabBarTextStyle={{fontSize: 17}}>
            <SwipeListView
                tabLabel='度假时间'
                dataSource={dataSource}
                renderRow={this.renderItem.bind(this)}
                onEndReached={() => this.onEndReached()}
                onEndReachedThreshold={10}
                renderSeparator={this._renderSeperator}
                refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={()=>{alert('刷新了')}}
                    title="Loading..."
                    colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                />
                }
            />
            <SwipeListView
                tabLabel='度假地点'
                dataSource={dataSource}
                renderRow={this.renderItem.bind(this)}
                onEndReached={() => this.onEndReached()}
                onEndReachedThreshold={10}
                renderSeparator={this._renderSeperator}
                refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={()=>{alert('刷新了')}}
                    title="Loading..."
                    colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                />
                }
            />
            </ScrollableTabView>
        );
    }

    render (){
        return (
            <View style={styles.container}>
                <NavBar title={'游记管理'}
                        rightItemTitle={'新增'}
                        rightTextColor='#fff'
                        rightItemFunc={this.GoNewNote}
                        />
                {
                    this.renderContent(this.ds.cloneWithRows(this.state.listViewData))
                }
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    row:{
        flex:1
    },
    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },
    listView: {
    },
    containerItem: {
        flexDirection: 'column',
        backgroundColor: '#eee',
        width:Width,
    },
    text_content_title: {
        marginLeft: 10,
        fontSize: 15,
        color:'#1596fe',
        marginTop: 5,
        backgroundColor:'transparent'
    },
    text_content: {
        marginLeft: 10,
        marginRight:30,
        marginTop:5,
        fontSize: 10,
        marginBottom:5
    },
	backTextWhite: {
		color: '#FFF',
        backgroundColor:'transparent'
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: '#eee',
		justifyContent: 'center',
        flexDirection: 'row',
	},
    rowFrontLeft: {
        width: Width*0.35,
        flexDirection: 'column',
        borderRightWidth:1,
        borderRightColor:'rgba(0,0,0,.3)',
        alignItems:'center'
    },
    rowFrontRight: {
        width: Width*0.65,
    },
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
    smallImage:{
        width:20,
        height:20,
        resizeMode:'cover'
    },
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0
	}
})