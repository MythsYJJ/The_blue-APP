import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Animated
} from 'react-native';
import CustomSync from '../sync';
import NavBar from '../component/navbar';


import { GiftedChat, Actions, Bubble, Composer, Send, Avatar } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import Swiper from 'react-native-swiper';

import Emoji from 'node-emoji';

//proto
import mess from '../proto/msg';
import ByteBuffer from 'byte-buffer';

var Dimensions = require('Dimensions');//设备信息获取
const Width = Dimensions.get('window').width;//宽度
const Height = Dimensions.get('window').height;//高度
var Back = require('../img/back.png');

const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});

const emoji1 = [
  'grinning',
  'grin',
  'joy',
  'smiley',
  'smile',
  'sweat_smile',
  'laughing',
  'innocent',
  'smiling_imp',
  'wink',
  'blush',
  'yum',
  'relieved',
  'heart_eyes',
  'sunglasses',
  'smirk',
  'neutral_face',
  'expressionless',
  'unamused',
  'sweat',
  'pensive',
  'confused',
  'confounded',
  'kissing',
  'kissing_heart',
  'kissing_smiling_eyes',
  'kissing_closed_eyes',
  'stuck_out_tongue',
  'stuck_out_tongue_winking_eye',
  'stuck_out_tongue_closed_eyes',
  'disappointed',
  'worried',
  'angry',
  'rage',
  'cry',
  'persevere',
  'triumph',
  'disappointed_relieved',
  'frowning',
  'anguished'
]

const emoji2 = [
  'fearful',
  'weary',
  'sleepy',
  'tired_face',
  'grimacing',
  'sob',
  'open_mouth',
  'hushed',
  'cold_sweat',
  'scream',
  'astonished',
  'flushed',
  'sleeping',
  'dizzy_face',
  'no_mouth',
  'mask',
  'slightly_frowning_face',
  'slightly_smiling_face',
  'upside_down_face',
  'face_with_rolling_eyes',
  'zipper_mouth_face',
  'money_mouth_face',
  'face_with_thermometer',
  'nerd_face',
  'thinking_face',
  'face_with_head_bandage',
  'robot_face',
  'hugging_face',
  'smile_cat',
  'joy_cat',
  'smiley_cat',
  'heart_eyes_cat',
  'smirk_cat',
  'kissing_cat',
  'pouting_cat',
  'crying_cat_face',
  'scream_cat'
]

export default class ChatView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: '',
      loadEarlier: false,
      typingText: null,
      isLoadingEarlier: false,
      isShowEmoji: false,
      isAnimated: true,
      emojiY: new Animated.Value(Height * 0.4),
    };

    this._isMounted = false;
    this._isKeyboardShow = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.renderSend = this.renderSend.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.customKeyboardMove = this.customKeyboardMove.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onAckSendChatMsg = this.onAckSendChatMsg.bind(this);
    this.onReceiveChatMsg = this.onReceiveChatMsg.bind(this);
    this.__sendReqSendChatMsg = this.__sendReqSendChatMsg.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    const userId = this.props.targetUserId.toString();
    const nickname = this.props.targetUserName;
    const sex = this.props.sex;
    this.setState(() => {
      return {
        messages: CustomSync.getTargetMessage(userId, nickname, sex).chatList
      };
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));
    CustomSync.registerComponent(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    try {
      if (!global.ws) {
        await CustomSync.initWebSocket(global.sessionID);
      }
    } catch (err) {
      console.log(err);
    }
  }

  onAckSendChatMsg(message) {
    console.log('decode AckSendChatMsg:');
    console.log('errorcode = ' + message.errorcode);
    console.log('createTime = ' + message.createTime);
  }

  onReceiveChatMsg(message) {
    console.log('decode ReceiveChatMsg:');
    console.log('userId = ' + message.userId);
    console.log('nickName = ' + message.nickName);
    console.log('content = ' + message.content);
    console.log('createTime = ' + message.createTime);
    message.nickName = CustomSync.getRemark(message.userId, message.nickName);
    if (message.userId == this.props.targetUserId) {
      this.onReceive([JSON.parse(message.content)]);
    } else {
      CustomSync.pushMissMessage(message);
    }
  }

  __sendReqSendChatMsg(msg) {
    var auth = mess.imdef.ReqSendChatMsg.create({});
    auth.userId = this.props.targetUserId;
    auth.content = msg;
    var data = mess.imdef.ReqSendChatMsg.encode(auth).finish();
    console.log("encode data:");
    console.log(data);

    CustomSync.packageSend(data, 948952973);
  }

  onClickBack() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.keyboardWillHideListener.remove();
  }

  _keyboardDidShow() {
    this._customActions.setModalVisible(false);
    this._isKeyboardShow = true;
    Animated.timing(this.state.emojiY, {
      toValue: Height * 0.4,
      duration: 20,
    }).start();
  }

  _keyboardDidHide() {
    this._isKeyboardShow = false;
  }

  _keyboardWillHide() {
    if (!this.state.isShowEmoji) {
      Animated.timing(this.state.emojiY, {
        toValue: Height * 0.4,
        duration: 210,
      }).start();
    }
  }

  /*onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }*/

  onSend(messages = []) {
    messages[0].user.avatar = global.common.fileurl.imgavatar + global.userInformation.avatar;
    messages[0].user._id = global.userInformation.userid;
    let sendMessageStr = JSON.stringify(messages[0]);
    let chatObject = CustomSync.getTargetMessage(this.props.targetUserId.toString(), this.props.targetUserName);
    chatObject.chatList.unshift(messages[0]);
    this.__sendReqSendChatMsg(sendMessageStr);
    this.setState({ text: '' });
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  onReceive(message) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: message[0].text,
          createdAt: message[0].createdAt,
          user: {
            _id: 2,
            name: this.props.targetUserName,
            avatar: message[0].user.avatar,//TODO change to avatar url
          },
        }),
      };
    });
  }

  offestCallBack(show) {
    this.setState({ isShowEmoji: show });
    if (this._isKeyboardShow && show) {
      setTimeout(() => {
        this.customKeyboardMove(show ? -(Height * 0.4) : 0);
      }, 210);
      Keyboard.dismiss();
    }
    else if (!this._isKeyboardShow && !show) {
      this._composer.refs._textInput.focus();
    }
    else {
      this.customKeyboardMove(show ? -(Height * 0.4) : 0);
    }
  }

  _setInputText(text) {
    this.setState({ text: text })
    this._giftedChat.setState({ text: text })
  }

  _renderEmoji(item) {
    let nowText = this.state.text
    return (
      <Text key={item} style={{ fontSize: 35, height: 40,backgroundColor:'transparent' }} onPress={() => { this._setInputText(nowText + Emoji.get(item)) }}>
        {Emoji.get(item)}
      </Text>
    )
  }

  _renderEmojiTable(arr) {
    return arr.map(item => this._renderEmoji(item))
  }

  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
        offestCallBack={this.offestCallBack.bind(this)}
        ref={(a) => { this._customActions = a }}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  onChangeText(text) {
    this.setState({ text: text })
  }

  renderComposer(props) {
    return (
      <Composer
        {...props}
        text={this.state.text}
        placeholder={'请输入聊天内容'}
        ref={(c) => { this._composer = c }}
        textInputProps={
          {
            ref: '_textInput',
            onChangeText: this.onChangeText.bind(this),
            blurOnSubmit: true
          }
        }
      />
    );
  }

  renderAvatar(props) {
    return (
      <Avatar
        {...props}
        avatarProps={
          {
            onPress: this.onPressAvatar.bind(this),
          }
        }
      />
    );
  }

  onPressAvatar(param) {
    console.log('onPressAvatar', param);
  }

  renderSend(props) {
    return (
      <Send
        {...props}
        label='发送'
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  customKeyboardMove(offest) {
    this._giftedChat.setIsTypingDisabled(true);
    this._giftedChat.setBottomOffset(offest);
    const newMessagesContainerHeight = (this._giftedChat.getMaxHeight() - (this._giftedChat.state.composerHeight
      + (this._giftedChat.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT))) - this._giftedChat.getKeyboardHeight()
      + this._giftedChat.getBottomOffset();
    if (this.state.isAnimated == true) {

      Animated.timing(this._giftedChat.state.messagesContainerHeight, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start();

      let absOffest = Math.abs(offest)
      Animated.timing(this.state.emojiY, {
        toValue: absOffest > 0 ? 0 : absOffest,
        duration: 210,
      }).start();
    } else {
      this._giftedChat.setState((previousState) => {
        return {
          messagesContainerHeight: newMessagesContainerHeight,
        };
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'#fff' }}>
        <NavBar title={this.props.targetUserName}
          leftImageSource={Back}
          leftItemFunc={this.onClickBack.bind(this)}
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}
          isAnimated={this.state.isAnimated}
          user={{
            _id: global.userInformation.userid, // sent messages should have same user._id
          }}
          renderAvatar={this.renderAvatar}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          renderComposer={this.renderComposer}
          renderSend={this.renderSend}
          ref={(g) => { this._giftedChat = g }}
        />
        {this.props.userinfo.ignored?
          <View style={{ position: 'absolute',bottom: 0,left:0,width:Width,height:44, backgroundColor: '#bbb',
                         alignItems:'center',justifyContent:'center'}}>
            <Text style={{
              color: '#fff',
              fontSize: 17,
              backgroundColor:'transparent'
            }}>您已被该用户列入黑名单</Text>
          </View>
         :
          <View/>}
        <Animated.View style={{ position: 'absolute', bottom: 0, height: Height * 0.4, alignItems: 'center', justifyContent: 'flex-end', transform: [{ translateY: this.state.emojiY }] }}>
          <Swiper autoplay={false}
            height={Height * 0.4}
            dot={<View style={{ backgroundColor: 'rgba(0,0,0,.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />}
            activeDot={<View style={{ backgroundColor: '#ddd', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}>
              {this._renderEmojiTable(emoji1)}
            </View>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}>
              {this._renderEmojiTable(emoji2)}
            </View>
          </Swiper>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
    backgroundColor:'transparent'
  },
});

ChatView.defaultProps = {
  targetUserId: 30324,
  targetUserName: '沃尔沃扫地僧',
  sex: 0
};

ChatView.propTypes = {
  targetUserId: React.PropTypes.number,
  targetUserName: React.PropTypes.string,
  sex: React.PropTypes.number
};
