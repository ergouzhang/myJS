var netWork = /** @class */ (function () {
    function netWork(callBack) {
        this.host = "";
        this.port = "";
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var convResponse = JSON.parse(response);
                self.host = convResponse.host;
                self.port = convResponse.port;
                self.login(callBack);
            }
            else {
                console.log("get gate error>>>>");
            }
        };
        xhr.open('GET', 'http://139.199.25.194/gate?uniqueId=1231', true);
        xhr.send();
    }
    netWork.prototype.login = function (callBack) {
        var self = this;
        // socket链接
        pomelo.init({
            host: self.host,
            port: self.port,
            connectTimeout: 10 * 1000,
            maxReconnectAttempts: 1000,
            reconnect: true
        }, function () {
            console.log('socket>>>>>>>connect ');
            var testData = {};
            testData['token'] = 1231;
            testData['uniqueId'] = 2122;
            testData['serverId'] = 1;
            pomelo.request('connector.entryHandler.enter', encodeURIComponent(JSON.stringify(testData)), function (res) {
                if (res.errno != 0) {
                    return;
                }
                self.setupMessageListener();
                if (callBack) {
                    callBack();
                }
            });
        });
    };
    netWork.prototype.setupMessageListener = function () {
        var self = this;
        pomelo.on('serverMessage', function (data) {
            switch (data.route) {
                case 'broadcast':
                    break;
                case 'notify':
                    break;
                case 'shutdown':
                    pomelo.disconnect();
                    break;
                case 'syncFrame':
                    if (data.frames.length == 0) {
                        data.frames = ['sync'];
                    }
                    console.log("sync Frame>>>>>>>");
                    // frameSync.framesData.push(data.frames)
                    break;
            }
        });
    };
    /**
     * sendMsg
     */
    netWork.prototype.sendMsg = function (data) {
        var route = data.route;
        var msg = {};
        msg["action"] = data.actionName;
        msg["data"] = data.data || {};
        console.log('socket>>>>>>> msgToSend is ...' + msg["action"] + ' === ');
        if (!route) {
            console.log('socket>>>>>>> the msgId to send cannot be null');
            return;
        }
        pomelo.request(route, msg, function (res) {
            if (res.errno != 0) {
                console.log(res.errmsg);
                return;
            }
            console.log('socket>>>>>>>request response is');
        });
    };
    return netWork;
}());
//# sourceMappingURL=netWork.js.map