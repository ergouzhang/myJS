
    class netWork {
    public host = ""
    public port = ""
    constructor(callBack) {
        let self = this
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            let response = xhr.responseText
            let convResponse = JSON.parse(response)
            self.host = convResponse.host
            self.port = convResponse.port
            self.login(callBack)

        }
        else {
            console.log("get gate error>>>>")
        }
        }
        xhr.open('GET', 'http://139.199.25.194/gate?uniqueId=1231', true)
        xhr.send()
    }
    public login(callBack){
        let self = this 
    // socket链接
        pomelo.init({
        host: self.host,
        port: self.port,
        connectTimeout: 10 * 1000,
        maxReconnectAttempts : 1000,
        reconnect: true
    }, function () {
        console.log('socket>>>>>>>connect ')

        let testData = {}
        testData['token'] = 123//Math.round(Math.random()*100)
        testData['uniqueId'] = 321//Math.round(Math.random()*100)
        testData['serverId'] = 1
        pomelo.request('connector.entryHandler.enter', encodeURIComponent(JSON.stringify(testData)), function (res) {
        if (res.errno != 0) {
            return
        }
        self.setupMessageListener()
        if (callBack) {
            callBack()
        }
        })
    })
        }
    public setupMessageListener(){
        let self = this 
        console.log("setupMessage>>>>")
        pomelo.on('serverMessage', function (data) {
            switch (data.route) {
            case 'broadcast':
                break
            case 'notify':
                break
            case 'shutdown':
                pomelo.disconnect()
                break
            case 'syncFrame':
                if (data.frames.length == 0) {
                data.frames = ['sync']
                }
                console.log("sync Frame>>>>>>>" + data.frames)
                window["syncData"].push(data.frames)
                break
            }
        })
            }

    /**
     * sendMsg
     */
    public sendMsg(data) {
        let route = data.route
        let msg = {}
        msg["action"] = data.actionName
        msg["data"] = data.data || {}
        console.log('socket>>>>>>> msgToSend is ...' + msg["action"] + ' === ' + data.data)
        if (! route) {
            console.log('socket>>>>>>> the msgId to send cannot be null')
            return
        }
        pomelo.request(route, msg, function (res) {
            if (res.errno != 0) {
                console.log(res.errmsg)
            return
            }
            console.log('socket>>>>>>>request response is')
        })
    }
}

