import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    ListView,
    Platform,
    RefreshControl,
    Navigator,
    ScrollView
} from 'react-native';
import Navbar from '../component/navbar';

var Back = require('../img/back.png');
var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度

export default class Clause extends React.Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }

    componentWillMount(){

    }

    backView(){
        const {navigator} = this.props;
        if(navigator){
            navigator.pop();
        }
    }

    render(){
        return(
            <View style={{flex:1,bakcgroundColor:'#fff'}}>
                <Navbar title={'预定须知'}
                    leftItemFunc={this.backView.bind(this)}
                    leftImageSource={Back} />
                <ScrollView>
                    <Text style={styles.row}>1.【年龄限制】本产品暂不接受2周岁以下婴儿，75周岁以上（含75周岁）老人报名预订。</Text>
                    <Text style={styles.row}>2.【持非中国护照】本产品仅对持中国大陆签发的护照，且该护照不能持其他任何国家的居留文件的客人提供签证咨询及代为办理服务。若持非中国大陆护照客人预定此产品，鸿鹄逸游仅提供签证外的相关旅游服务，须由客人自行确认签证信息或自备签证，若因签证问题导致的一切行程损失均由客人自行承担。</Text>
                    <Text style={styles.row}>3.【拒签】因拒签无法出行者，我们将只收取签证成本费，具体金额以届时实际产生成本为准。</Text>
                    <Text style={styles.row}>4.【庆典赛事】行程中的住宿如果遇到当地大型活动、大型展会、体育赛事等，酒店及房型可能有所调整，所有确认入住的酒店及房型以我公司的"行前册"为准。</Text>
                    <Text style={styles.row}>5.【不可抗力】景点如遇当地假期、关闭日期或罢工、暴动等临时通知关闭的，请以我公司“行前册”确认为准。</Text>
                    <Text style={styles.row}>6.【安全须知】为了您的安全起见，当您参加有一定危险性的室内或户外活动时，请务必了解当天的天气情况及您个人身体状况是否适宜参加此类项目，鸿鹄逸游提醒您注意人身安全。</Text>
                    <Text style={styles.row}>7.【行程变更】网上公布行程仅供参考，在出发前或旅行期间，鸿鹄逸游保留因不可抗力（如天气、天灾、战争、罢工等）因素对具体行程进行适当调整的权利。</Text>
                    <Text style={styles.row}>8.【行程变更】出境社的违约责任
出境社在出发前提出解除预订须知的，向旅游者退还全额旅游费用（不得扣除签证／签注等费用）。</Text>
                    <Text style={styles.row}>9.【旅游者的违约责任】
1）旅游者在出发前提出解除预订须知的，出境社在扣除业务损失费后，将余款退还旅游者。
2）出境社送签后，旅游者取消旅游产品的（一般是收到所需材料后的下一个工作日送签），出境社有权收取全部签证/签注费用并要求旅游者注销签证/签注。
3）旅游者行程期间因自身原因致使人身、财产权益受到损害的，出境社不承担赔偿责任，若因此造成出境社损失的，还应对出境社承担赔偿责任。
4）与出境社出现纠纷时，旅游者应当积极采取措施防止损失扩大，否则应当就扩大的损失承担责任。</Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row:{
        width:Width*.96,
        alignSelf:'center',
        marginTop:10,
        marginBottom:10,
        backgroundColor:'transparent'
    }
})