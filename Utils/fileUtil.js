import React from 'react';
import {
    Platform
} from 'react-native';
import RNFS from 'react-native-fs';

//下面是64个基本的编码
const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

export default class FileUtil extends React.Component {
    static readFile(fileName, fileType) {
        return new Promise(async function (resolve, reject) {
            const url = RNFS.DocumentDirectoryPath;
            const path = url + '/' + fileName + '.' + fileType;
            let isExist = await RNFS.exists(path);
            if (!isExist) {
                if (fileType === 'json') {
                    resolve(null);
                } else {
                    resolve('');
                }
            } else {
                let content = await RNFS.readFile(path, 'utf8');
                if (fileType === 'json') {
                    resolve(JSON.parse(content));
                } else {
                    resolve(content);
                }
            }
        })
    }

    static readImage(imagePath) {
        return new Promise(async function (resolve, reject) {
            let isExist = await RNFS.exists(imagePath);
            if (!isExist) {
                resolve(null);
            } else {
                let content = RNFS.readFile(imagePath, 'base64');
                resolve(content);
            }
        })
    }

    static writeFile(fileName, fileType, fileContent) {
        return new Promise(async function (resolve, reject) {
            const url = RNFS.DocumentDirectoryPath;
            const path = url + '/' + fileName + '.' + fileType;
            let isExist = await RNFS.exists(path);
            let success = false;
            if (!isExist) {
                if (fileType === 'json') {
                    success = await RNFS.writeFile(path, JSON.stringify(fileContent), 'utf8');
                } else if (fileType === 'txt') {
                    success = await RNFS.writeFile(path, fileContent, 'utf8');
                }
            } else {
                let content = await RNFS.readFile(path, 'utf8');
                if (fileType === 'json') {
                    let contentJson = JSON.parse(content);
                    if (contentJson && contentJson instanceof Array) {
                        if (fileContent instanceof Array) {
                            fileContent.map(item => { contentJson.push(item) });
                        }
                        else {
                            contentJson.push(fileContent);
                        }
                    }
                    success = await RNFS.writeFile(path, JSON.stringify(contentJson), 'utf8');
                }
                else if (fileType === 'txt') {
                    success = await RNFS.appendFile(path, fileContent, 'utf8');
                }
            }
            resolve(success);
        })
    }

    static deleteFile(fileName, fileType) {
        const url = RNFS.DocumentDirectoryPath;
        const path = url + '/' + fileName + '.' + fileType;
        return RNFS.unlink(path);
    }

    static deleteCacheImage() {
        return new Promise(async function (resolve, reject) {
            let result = await RNFS.readDir(RNFS.DocumentDirectoryPath);
            result.map(async function (item) {
                let stat = await RNFS.stat(item.path);
                if (stat.isFile() && item.name.indexOf('imageCache_') >= 0) {
                    let success = await RNFS.unlink(item.path);
                }
            })
            resolve(true);
        })
    }

    static isExist(envUrl, url) {
        const dirPath = RNFS.DocumentDirectoryPath + '/';// + '/cache_images/';
        let baseUrl = 'imageCache_' + FileUtil.base64encode(url);
        const path = dirPath + baseUrl;
        return RNFS.exists(path);
    }

    static cacheImage(background, envUrl, url) {
        return new Promise(async function (resolve, reject) {
            const dirPath = RNFS.DocumentDirectoryPath + '/';// + '/cache_images/';
            let baseUrl = 'imageCache_' + FileUtil.base64encode(url);
            const path = dirPath + baseUrl;
            let isExist = await RNFS.exists(path);
            if (isExist) {
                let read = await RNFS.readFile(path, 'base64');
                let headRead = read.substring(0, 1);
                switch (headRead) {
                    case '/':
                        headRead = 'jpeg';
                        break;
                    case 'i':
                        headRead = 'png';
                        break;
                    case 'R':
                        headRead = 'gif';
                        break;
                }
                const base64URL = 'data:image/' + headRead + ';base64,' + read;
                resolve({ uri: base64URL });
            }
            else {
                // let success = await RNFS.mkdir(dirPath, { NSURLIsExcludedFromBackupKey: true });
                // console.log('mkdir = ',success);
                const progress = data => {
                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
                    const text = `Progress ${percentage}%`;
                    console.log(text)
                };

                const begin = res => {
                    console.log('Download has begun');
                };
                const downloadPath = envUrl + url;
                const progressDivider = 1;
                // try {
                const ret = RNFS.downloadFile({ fromUrl: downloadPath, toFile: path, begin, progress, background, progressDivider });
                jobId = ret.jobId;
                let res = await ret.promise;
                // } catch (err) {
                //     reject(err);
                // }
                let read = await RNFS.readFile(path, 'base64');
                let headRead = read.substring(0, 1);
                switch (headRead) {
                    case '/':
                        headRead = 'jpeg';
                        break;
                    case 'i':
                        headRead = 'png';
                        break;
                    case 'R':
                        headRead = 'gif';
                        break;
                }
                const base64URL = 'data:image/' + headRead + ';base64,' + read;
                resolve({ uri: base64URL });
            }
        })
    }

    //编码的方法
    static base64encode(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    //解码的方法
    static base64decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {

            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1)
                break;

            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }

    static utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    static utf8to16(str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
}