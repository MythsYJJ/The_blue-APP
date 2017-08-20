import React, { Component } from 'react';
import {
    AsyncStorage,
    Alert
} from 'react-native';
import Storage from 'react-native-storage';
import SplashScreen from 'react-native-smart-splash-screen';

//proto
import mess from './proto/msg';
import FileUtil from './Utils/fileUtil';
import ByteBuffer from 'byte-buffer';
import Register from './login/register';
import Recharge from './main/recharge';

export default class CustomSync extends React.Component {
    constructor(props) {
        super(props);
        this._currectComponent = null;
        this._alertRef = null;

        this.registerComponent = this.registerComponent.bind(this);
        this.initWebSocket = this.initWebSocket.bind(this);
        this.getTargetMessage = this.getTargetMessage.bind(this);
        this.visitor = this.visitor.bind(this); 
    }

    static visitor(component) {
        if (!global.sessionID) {
            const { navigator } = component.props;
            if (navigator) {
                navigator.resetTo({
                    name: 'Register',
                    component: Register,
                    params: {
                        navigator: navigator
                    }
                })
                Alert.alert('', '请注册并登录TheBlue');
            };
            return
        }
    }

    static getCurrentLocation() {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                (location) => resolve(location),
                (error) => resolve({coords:{longitude:0,latitude:0}})
            );
        })
    }

    static fetch(component, url, method = 'GET', headers = {}, body = null, resolveSlef = true) {
        return new Promise(async function (resolve, reject) {
            console.log('CusytomSync.fetch')
            console.log(url);
            console.log(body)
            let response = await fetch(url, method !== 'GET' ? {
                method: method,
                headers: headers,
                body: body,
                timeout: 10000
            } : 'GET');
            if (response.status == 200 || response.status == 201 || response.status == 304) {
                let responseJson = await response.json();
                let { navigator } = component.props;
                if (responseJson.status == 1) {
                    resolve(responseJson);
                } else {
                    if (resolveSlef) {
                        switch (responseJson.status) {
                            case 106:
                                await SplashScreen.close({
                                    animationType: SplashScreen.animationType.scale,
                                    duration: 850,
                                    delay: 500,
                                });
                                console.log('sync返回106', responseJson);
                                await CustomSync.removeKey('sessionID');
                                global.sessionID = null;
                                if (navigator) {
                                    navigator.resetTo({
                                        name: 'Register',
                                        component: Register,
                                        params: {
                                            navigator: navigator
                                        }
                                    })
                                }
                                break;
                            case 804:
                                Alert.alert('您的现金券不足', null, [
                                    {
                                        text: '前往充值', onPress: () => {
                                            if (navigator) {
                                                navigator.resetTo({
                                                    name: 'Recharge',
                                                    component: Recharge,
                                                    params: {
                                                        navigator: navigator
                                                    }
                                                })
                                            }
                                        }
                                    },
                                    { text: '残忍拒绝', onPress: () => console.log('custom refuse recharge') },
                                ]);
                                break;
                            default:
                                console.log(responseJson);
                                Alert.alert('',global.errorcode[responseJson.status].msg);
                                break;
                        }
                    }
                    resolve(responseJson);
                }
            } else {
                Alert.alert('','网络中断，请稍后重新连接');
                reject(response.status);
                return;
            }
        })
    }

    static registerAlert(ref) {
        this._alertRef = ref;
    }

    static getRemark(userId, nickName) {
        let remark = global.userdefined.get(userId);
        return remark ? remark : nickName;
    }

    static alertWithType(type, title, message) {
        if (this._alertRef == null) {
            return;
        }
        this._alertRef.alertWithType(type, title, message);
    }

    static getConfig(fileName) {
        return new Promise(async function (resolve, reject) {
            try {
                var saveDate = await CustomSync.getStringForKey(fileName + 'ts');
                let response = await fetch(global.configURL + fileName,
                    {
                        method: 'GET',
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Range': 'bytes=0-0',
                        },
                        timeout: 10000
                    });
                var headDate = '';
                let lastModf = response.headers.get('last-modified');
                if (lastModf !== null) {
                    headDate = (new Date(lastModf).getTime() / 1000).toString();
                }
                if (saveDate !== null) {
                    configObject = await CustomSync.getObjectForKey(fileName);
                    if (configObject !== null && saveDate === headDate) {
                        console.log('CustomSync getConfig ' + fileName + ' read from storage');
                        resolve(configObject);
                        return
                    }
                }
                response = await fetch(global.configURL + fileName, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    timeout: 10000
                }, );
                let responseJson = await response.json();
                await CustomSync.setObjectForKey(fileName, responseJson);
                await CustomSync.setStringForKey(fileName + 'ts', headDate.toString());
                console.log('CustomSync getConfig ' + fileName + ' load from url');
                resolve(responseJson);
            } catch (err) {
                reject(err);
            }
        });
    }

    static setStringForKey(key, str) {
        return AsyncStorage.setItem(key, str);
    }

    static removeKey(key) {
        return AsyncStorage.removeItem(key);
    }

    static getStringForKey(key) {
        return AsyncStorage.getItem(key)
            .then((value) => {
                if (value !== null) {
                    return value;
                }
                else {
                    return null;
                }
            }
            )
            .catch((err) => {
                throw err;
            }
            )
    }

    static setObjectForKey(key, obj) {
        return AsyncStorage.setItem(key, JSON.stringify(obj));
    }

    static getObjectForKey(key) {
        return AsyncStorage.getItem(key)
            .then((value) => {
                if (value !== null) {
                    return JSON.parse(value);
                }
                else {
                    return null;
                }
            }
            )
            .catch((err) => {
                throw err;
            }
            )
    }

    static chatMessages = {};

    static notifications = [];

    static getTargetMessage(targetUserId, targetNickName, sex = 0) {
        if (!CustomSync.chatMessages[targetUserId]) {
            CustomSync.chatMessages[targetUserId] = {};
            CustomSync.chatMessages[targetUserId].chatList = new Array();
            CustomSync.chatMessages[targetUserId].missedMessage = 0;
            CustomSync.chatMessages[targetUserId].targetId = targetUserId;
            CustomSync.chatMessages[targetUserId].targetNickname = targetNickName;
            CustomSync.chatMessages[targetUserId].sex = sex;
            CustomSync.chatMessages[targetUserId].chatList.unshift(
                {
                    _id: Math.round(Math.random() * 1000000),
                    text: "天知，地知，你知，我... ...出于对用户的隐私性负责，TheBlue不会保存您和" + targetNickName + "任何聊天记录如有重要信息，记得自行保存哟~",
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Blue',
                    },
                }
            );
        }
        return CustomSync.chatMessages[targetUserId];
    }

    static pushMissMessage(message) {
        let messageObject = CustomSync.getTargetMessage(message.userId.toString(), message.nickName, message.sex);
        messageObject.chatList.unshift(JSON.parse(message.content));
        messageObject.missedMessage++;
    }

    static registerComponent(component) {
        this._currectComponent = component;
        console.log('registerComponent');
        console.log(this._currectComponent);
    }

    static packageSend(data, packageId, ws = global.ws) {
        // 填充包头
        var buff = new ByteBuffer(8 + data.length);

        buff.writeUnsignedInt(packageId, ByteBuffer.LITTLE_ENDIAN);                           // ReqAuthentication 的包号
        buff.writeUnsignedShort(global.packageIndex, ByteBuffer.LITTLE_ENDIAN);               // 中华说这个是客户端包序列种子,每发送一次需要++
        buff.writeUnsignedShort(data.length, ByteBuffer.LITTLE_ENDIAN);                       // 后续长度
        buff.write(data);                                                                     // 写入二进制序列

        global.packageIndex++;

        var buffers = new Uint8Array(buff.buffer);
        // 发送 buffers
        ws.send(buffers);
    }

    static initWebSocket(ssid) {
        var customSync = this;
        return new Promise(function (resolve, reject) {
            let ws = new WebSocket(global.wsURL);
            global.packageIndex = 1;

            ws.onopen = () => {
                console.log("I openend the connection without troubles!");
                let auth = mess.imdef.ReqAuthentication.create({});
                console.log('connect ssid = ' + ssid)
                auth.sessionId = ssid;              // 从登录传下来的 ssid //target 497910e26814567da50bd6651cbe9828
                let data = mess.imdef.ReqAuthentication.encode(auth).finish();    // 生成二进制序列, 返回的是 Uint8Array

                console.log("encode data:");
                console.log(data);

                CustomSync.packageSend(data, 1067621048, ws);
            };

            ws.onmessage = (e) => {
                console.log('recv message');
                console.log(e.data);        // e.data 的类型是  ArrayBuffer

                var buffers = new ByteBuffer(e.data);
                let pid = buffers.readUnsignedInt(ByteBuffer.LITTLE_ENDIAN);   // 读取包号
                let seq = buffers.readUnsignedShort(ByteBuffer.LITTLE_ENDIAN); // 读取种子号
                let len = buffers.readUnsignedShort(ByteBuffer.LITTLE_ENDIAN); // 读取序列长度

                console.log('pid = ' + pid + ' , seq = ' + seq + ' , len = ' + len);

                if (len > 0) {
                    var buff = buffers.read(len);
                    var data = new Uint8Array(buff.buffer);
                }
                let message = null;
                switch (pid) {
                    case 858176124:     // imdef.AckAuthentication
                        message = mess.imdef.AckAuthentication.decode(data);
                        global.ws = ws;
                        setInterval(CustomSync._startHeartbeat, 30000);
                        resolve();
                        break;
                    case 3354950470:    // imdef.AckSendChatMsg
                        if (customSync._currectComponent && customSync._currectComponent.onAckSendChatMsg) {
                            message = mess.imdef.AckSendChatMsg.decode(data);
                            customSync._currectComponent.onAckSendChatMsg(message);
                        }
                        console.log('AckSendChatMsg', message);
                        break;
                    case 3293322557:     // imdef.AckHeartbeat
                        break;
                    case 2452655825:    // imdef.ReceiveChatMsg
                        message = mess.imdef.ReceiveChatMsg.decode(data);
                        if (customSync._currectComponent && customSync._currectComponent.onReceiveChatMsg) {
                            customSync._currectComponent.onReceiveChatMsg(message);
                        }
                        console.log(message);
                        CustomSync.pushMissMessage(message);
                        let content = JSON.parse(message.content);
                        CustomSync.alertWithType('custom', message.nickName, content.text);
                        break;
                    case 3219603525:     // imdef.ReceiveOfflineChatMsg
                        let messages = mess.imdef.ReceiveOfflineChatMsg.decode(data);
                        if (messages && messages.length > 0) {
                            messages.map(message => {
                                CustomSync.pushMissMessage(message);
                            })
                        }
                        break;
                    case 840517531:    // imdef.Notification
                        /*
                        活动中抽奖 1
                        购买产品 2
                        现金券变化 3
                        
                        游记被评论 100
                        游记被浏览 101
                        游记被收藏 102
                        游记被点赞 103
                        游记被打赏 104
                        游记被举报 105
                        游记有更新 106
                        
                        Notification param
                            noticeType
                            content
                            parameters
                            createTime
                         */
                        let notification = mess.imdef.Notification.decode(data);
                        if (notification.noticeType == 3) {
                            notification.title = '现金券变化了';
                            notification.content = '您现金券变化了，你目前的代金券数量为:' + notification.parameters;
                        }
                        if (!CustomSync.notifications) {
                            CustomSync.notifications = [];
                        }
                        CustomSync.notifications.push(notification);
                        FileUtil.writeFile('custom_notifications', 'json', CustomSync.notifications);
                        if (customSync._currectComponent && customSync._currectComponent.onReceiveNotification) {
                            customSync._currectComponent.onReceiveNotification(notification);
                        }
                        CustomSync.alertWithType('info', '通知', notification.content);
                        break;
                    case 1803721889:    // imdef.ReceiveOfflineNotification
                        let notifications = mess.imdef.ReceiveOfflineNotification.decode(data);
                        if (!CustomSync.notifications) {
                            CustomSync.notifications = [];
                        }
                        notifications.map(notification => { CustomSync.notifications.push(notification) });
                        FileUtil.writeFile('custom_notifications', 'json', CustomSync.notifications);
                        break;
                }
            };

            ws.onerror = (e) => {
                console.log("There has been an error", e);
                //alert('There has been an error');
                reject(e);
            };

            ws.onclose = (e) => {
                console.log("I'm closing it");
                console.log(e.code, e.reason);
                //alert('closed: ' + e.code + ' , ' + e.reason);
                reject(e);
            };
        });
    }

    static _startHeartbeat() {
        var auth = mess.imdef.ReqHeartbeat.create({});
        var data = mess.imdef.ReqHeartbeat.encode(auth).finish();
        CustomSync.packageSend(data, 2424756646);
    }
}