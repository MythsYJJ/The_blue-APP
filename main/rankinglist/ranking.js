import React,{Component,PropTypes} from 'react';
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
import NavBar from '../../component/navbar';
import { toastShort } from '../../Toast/ToastUtil';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomSync from '../../sync';
import RankingList from './rankingList';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../../img/back.png');
//排行榜界面
export default class Ranking extends React.Component{
    constructor(props){
        super(props);
        this.state={
            listdata:[],
            viewtype:1,
            myindex:'0'
        }
    }
    componentWillMount(){
        //this.loadranklst(1)
    }

    async loadranklst(type){
        this.setState({
            listdata:[]
        });
         let responseJson = await CustomSync.fetch(this, global.httpURL + 'rank/' +type
            + '?sid=' + global.sessionID+'&num=20');
        responseJson.list ?
            this.setState({ listdata: responseJson.list })
            : this.setState({ listdata: [] })
            responseJson.myindex ?this.setState({ myindex: responseJson.myindex })
            : this.setState({ myindex: '未入榜' })
    }

    backView() {
        const {navigator}=this.props;
        if(navigator){
            navigator.pop();
        }
    }

    render(){
        return (
            <View style={{flex:1,backgroundColor:'#ddd'}}>
                <NavBar title={'排行榜'}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back}
                />
                <View style={{ alignItems: 'center',flex:1,justifyContent:'center' }}>
                    <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center',backgroundColor:'transparent' }}>
                        master，排行榜系统正在升级中...{'\n'}
                        爱酱稍安勿躁，小编会尽快将排行榜系统开放...
                    </Text>
                </View>
                {/*<ScrollableTabView locked={true}
                                    tabBarUnderlineStyle={{ backgroundColor: '#1596fe' }}
                                    tabBarBackgroundColor='#FFFFFF'
                                    tabBarActiveTextColor='#1596fe'
                                    tabBarInactiveTextColor='rgba(0,0,0,.7)'
                                    tabBarTextStyle={{ fontSize: 17 }}
                                    initialPage={this.props.listidx}
                                    onChangeTab={(obj) => {
                                        // this.state.viewtype = obj.i+=1
                                        // console.log(this.state.viewtype);
                                        // this.setState({viewtype:this.state.viewtype})
                                        this.loadranklst(obj.i+=1)
                                    }}>
                    <RankingList tabLabel={'粉丝榜'}
                                 listtype={1}
                                 navigator={this.props.navigator}
                                 listdata={this.state.listdata}
                                 myindex={this.state.myindex}
                                 titlename={'被关注人数最多TOP20'}
                                 mainText={'TA的粉丝数：'}
                                 onTopRefresh={this.loadranklst.bind(this)}/>
                    <RankingList tabLabel={'土豪榜'}
                                 listtype={2}
                                 navigator={this.props.navigator}
                                 listdata={this.state.listdata}
                                 myindex={this.state.myindex}
                                 titlename={'打赏最多TOP20'}
                                 mainText={'TA的打赏数：'}
                                 onTopRefresh={this.loadranklst.bind(this)}/>
                    <RankingList tabLabel='里程榜'
                                 listtype={3}
                                 navigator={this.props.navigator}
                                 listdata={this.state.listdata}
                                 myindex={this.state.myindex}
                                 titlename={'里程数最多TOP20'}
                                 mainText={'TA的里程数：'}
                                 onTopRefresh={this.loadranklst.bind(this)}/>
                </ScrollableTabView>*/}
            </View>
        )
    }
}