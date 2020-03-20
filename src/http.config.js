export default {
    //
    // SERVER_URL: 'https://fengwei.anasit.com',
    // SOURCE_URL: 'https://fengwei.anasit.com/',

    // SERVER_URL: 'http://192.168.0.194:88',
    // SOURCE_URL: 'http://192.168.0.194:88/',


    //测试版
    SERVER_URL: 'https://fwtest.anasit.com',
    SOURCE_URL: 'https://fwtest.anasit.com/',

    WEBSOCKET_URL: 'wss://www.cool1024.com:8000',
    TIMEOUT: 20000,
    getHeaders() {
        return {
            'ng-params-one': localStorage.getItem('ng-params-one'),
            'ng-params-two': localStorage.getItem('ng-params-two'),
            'ng-params-three': localStorage.getItem('ng-params-three'),
        }
    }
};