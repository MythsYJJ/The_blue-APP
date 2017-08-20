const RELEASE_URLS = {
    http_url: 'http://siguo1.m7games.com:9080/',
    web_url: 'http://siguo1.m7games.com:9080/',
    config_url: 'http://siguo1.m7games.com:9060/v1/',
    ws_url: 'ws://siguo1.m7games.com:9080/ws/'
};

const DEV_URLS = {
    http_url: 'http://devapi.m7games.com:8090/',
    web_url: 'http://devweb.m7games.com:8080/',
    config_url: 'http://devapi.m7games.com:8090/v1/',
    ws_url: 'ws://devapi.m7games.com:8090/ws/'
};

const BETA_URLS = {
    http_url: 'http://dev.m7games.com:19080/',
    web_url: 'http://dev.m7games.com:19060/',
    config_url: 'http://dev.m7games.com:19060/v1/',
    ws_url: 'ws://dev.m7games.com:19080/ws/'
};

const XB_URLS = {
    http_url: 'http://192.168.1.254:8090/',
    // web_url: 'http://192.168.1.254:8080/',
    web_url: 'http://192.168.1.59:8080',
    config_url: 'http://dev.m7games.com:19060/v1/',
    ws_url: 'ws://dev.m7games.com:19080/ws/'
};

export function setUrl(type) {
    console.log('setUrl = '+type)
    let urls = BETA_URLS;
    switch (type) {
        case 'debug':
            urls = DEV_URLS;
            break;
        case 'beta':
            urls = BETA_URLS;
            break;
        case 'release':
            urls = RELEASE_URLS;
            break;
        default:
            urls = BETA_URLS;
    }
    global.httpURL = urls.http_url;
    global.webURL = urls.web_url;
    global.configURL = urls.config_url;
    global.wsURL = urls.ws_url;
}
