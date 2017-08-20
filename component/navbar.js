import React, { Component, PropTypes } from 'react';
import {
    Image,
    Text,
    View,
    Platform,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

// 导航条和状态栏的高度
const STATUS_BAR_HEIGHT = 20
const NAV_BAR_HEIGHT = 55

var Dimensions = require('Dimensions');//设备信息获取
var Width = Dimensions.get('window').width;//宽度
var Height = Dimensions.get('window').height;//高度

export default class NavBar extends Component {
    static propTypes = {
        title: PropTypes.string,          // nav标题
        titleTextColor: PropTypes.string, // nav标题颜色
        titleView: PropTypes.node,        // nav自定义标题View(节点)
        titleViewFunc: PropTypes.func,    // nav的titleView点击事件
        barBGColor: PropTypes.string, // Bar的背景颜色
        barOpacity: PropTypes.number, // Bar的透明度
        barStyle: PropTypes.number,   // Bar的扩展属性,nav样式(暂未使用)
        barBorderBottomColor: PropTypes.string,  // Bar底部线的颜色
        barBorderBottomWidth: PropTypes.number,  // Bar底部线的宽度
        statusbarShow: PropTypes.bool,     // 是否显示状态栏的20高度(默认true)
        leftItemTitle: PropTypes.string,   // 左按钮title
        leftImageSource: PropTypes.node,   // 左Item图片(source)
        leftTextColor: PropTypes.string,   // 左按钮标题颜色
        leftItemFunc: PropTypes.func,      // 左Item事件
        leftImageHeight: PropTypes.number,  // 左图片高度
        rightItemTitle: PropTypes.string,  // 右按钮title
        rightImageSource: PropTypes.node,  // 右Item图片(source)
        rightTextColor: PropTypes.string,  // 右按钮标题颜色
        rightItemFunc: PropTypes.func,     // 右Item事件
        rightItemvisible: PropTypes.bool,
        rightItemHeight: PropTypes.number,
        rightTextStyle: PropTypes.object
    }
    static defaultProps = {
        title: '标题',
        titleTextColor: '#fff',
        titleViewFunc() { },
        barBGColor: '#1596fe',
        barOpacity: 1,
        barStyle: 0,
        barBorderBottomColor: '#D4D4D4',
        barBorderBottomWidth: 0.8,
        statusbarShow: true,
        leftItemTitle: '',
        leftTextColor: '#383838',
        leftItemFunc() { },
        rightItemTitle: '',
        rightTextColor: '#383838',
        rightItemFunc() { },
        leftImageHeight: 22,
        rightItemvisible: true,
        leftitemvisible: true,
        rightImageHeight: 22,
        rightTextStyle: {}
    }
    render() {
        // 判断左Item的类型
        var onlyLeftIcon = false; // 是否只是图片
        if (this.props.leftItemTitle && this.props.leftImageSource && this.props.leftitemvisible) {
            onlyLeftIcon = true;
        } else if (this.props.leftImageSource && this.props.leftitemvisible) {
            onlyLeftIcon = true;
        }
        // 左侧图片title都没有的情况下
        var noneLeft = false;
        if (!(this.props.leftItemTitle.length > 0) && !(this.props.leftImageSource) || !this.props.leftitemvisible) {
            noneLeft = true;
        }
        // 判断是否自定义titleView
        var hasTitleView = false;
        if (this.props.title && this.props.titleView) {
            hasTitleView = true;
        } else if (this.props.titleView) {
            hasTitleView = true;
        }
        // 判断右Item的类型
        var onlyRightIcon = false; // 是否只是图片
        if (this.props.rightItemTitle && this.props.rightImageSource && this.props.rightItemvisible) {
            onlyRightIcon = true;
        } else if (this.props.rightImageSource && this.props.rightItemvisible) {
            onlyRightIcon = true;
        }

        // 右侧图片title都没有的情况下
        var noneRight = false;
        if (!(this.props.rightItemTitle.length > 0) && !(this.props.rightImageSource) || !this.props.rightItemvisible) {
            noneRight = true;
        }
        // console.log(onlyRightIcon,noneRight,this.props.rightItemvisible)
        // 判断是否显示20状态栏高度
        let showStatusbar = this.props.statusbarShow;
        if (Platform.OS === 'android') {
            // 安卓不显示
            //showStatusbar = false;
        }
        return (
            <View style={[styles.container, { height: showStatusbar ? NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT : NAV_BAR_HEIGHT,
                                              zIndex: Platform.OS === 'ios' ? 999 : 0}]}>
                <View style={[styles.row, {
                    backgroundColor: this.props.barBGColor,
                    opacity: this.props.barOpacity,
                    width: Width,
                    paddingTop: STATUS_BAR_HEIGHT,
                    paddingBottom: STATUS_BAR_HEIGHT / 2,
                }]}>
                    {/*左侧item*/}
                    <View style={styles.btnItem}>
                        { // 左侧item
                            !noneLeft
                                ? <TouchableOpacity
                                    style={styles.left_btnItem}
                                    onPress={this.props.leftItemFunc}>
                                    { // 左侧是图片还是文字
                                        onlyLeftIcon
                                            ? <View style={styles.leftView}>
                                                <Image source={this.props.leftImageSource}
                                                    style={[styles.leftViewImage,
                                                    this.props.leftImageHeight ? { height: this.props.leftImageHeight } : {}]} />
                                                <Text style={styles.leftViewTitile}>{this.props.leftItemTitle}</Text>
                                            </View>
                                            : <Text style={[styles.leftTitle, { color: this.props.leftTextColor }]}>
                                                {this.props.leftItemTitle}
                                            </Text>
                                    }
                                </TouchableOpacity>
                                : null
                        }
                    </View>
                    {/*标题*/}
                    {
                        hasTitleView
                            ? <TouchableOpacity style={styles.titleView} onPress={this.props.titleViewFunc}>
                                {this.props.titleView}
                            </TouchableOpacity>
                            : <View style={styles.titleView}>
                                <Text style={[styles.title, { color: this.props.titleTextColor }]}>
                                    {this.props.title}
                                </Text>
                            </View>
                    }
                    {/*右侧item*/}
                    <View style={styles.btnItem}>
                        { // 右侧item
                            !noneRight
                                ? <TouchableOpacity
                                    style={styles.nav_rightItem}
                                    onPress={this.props.rightItemFunc}>
                                    { // 右侧是图片还是文字
                                        onlyRightIcon
                                            ? <Image style={[styles.nav_rightImage,
                                            this.props.rightImageHeight ? { height: this.props.rightImageHeight } : {}]}
                                                source={this.props.rightImageSource} />
                                            : <Text style={[styles.nav_rightTitle, { color: this.props.rightTextColor }, this.props.rightTextStyle]}>
                                                {this.props.rightItemTitle}
                                            </Text>
                                    }
                                </TouchableOpacity>
                                : null
                        }
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',

    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    //按钮View
    btnItem: {
        justifyContent: 'center',
        width: 100,
    },
    //左btn
    left_btnItem: {
        marginLeft: 8,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    //左item混合按钮图片
    leftView: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 0,
    },
    leftViewImage: {
        justifyContent: 'center',
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    leftViewTitile: {
        justifyContent: 'center',
        alignSelf: 'center',
        color: '#fff',
        fontSize: 17,
        left: -5,
        position: 'relative',
        backgroundColor:'transparent'
    },
    // 左Item为title
    leftTitle: {
        marginRight: 5,
        marginLeft: 5,
        fontSize: 17,
        backgroundColor:'transparent'
    },
    // 左图片
    leftImage: {
        margin: 0,
        resizeMode: 'contain',
    },
    // 标题纯title
    title: {
        fontSize: 20,
        backgroundColor:'transparent'
    },
    // titleView
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // 右Item
    nav_rightItem: {
        marginRight: 5,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        //backgroundColor:'#3393F2',
    },

    // 右Item为title
    nav_rightTitle: {
        marginRight: 5,
        marginLeft: 5,
        fontSize: 16,
        backgroundColor:'transparent'
    },

    // 右图片
    nav_rightImage: {
        margin: 0,
        resizeMode: 'contain',
        //backgroundColor:'#f00',
    },
})