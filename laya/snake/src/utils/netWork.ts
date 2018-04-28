interface netMsgForm {
    route:string;
    actionName:string;
    data:any;
}

class netWork {
    private static _Instance:netWork;
    private host:string;
    private port:string;

    constructor() {}
    public static getInstance():netWork{
        if (! netWork._Instance) {
            netWork._Instance = new netWork();
        }
        return netWork._Instance;
    }

    public init(callBack):void{
        let self = this
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let response = xhr.response;
                let convResponse = JSON.parse(response);
                self.host = convResponse.host;
                self.port = convResponse.port;
                self.login(callBack);
            }
            else{
                console.log("get gate error >>>>");
            }
        }
        xhr.open('GET', 'http://172.16.107.21:11015/gate?uniqueId=1231', true)
        xhr.send()
    }


    public login(callBack):void{
        let self = this 
        // socket链接
        pomelo.init({
            host: self.host,
            port: self.port,
            connectTimeout: 10 * 1000,
            maxReconnectAttempts : 1000,
            reconnect: true
        }, function (res) {
            console.log('socket>>>>>>>connect ')
            console.log(res)
            let testData = {}
            testData['token'] = Math.round(Math.random()*100)//123//Math.round(Math.random()*100)
            testData['uniqueId'] = Math.round(Math.random()*100)//1//Math.round(Math.random()*100)
            userInfo['userId'] = testData['uniqueId']
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

     public setupMessageListener():void{
        let self = this 
        console.log("setupMessage>>>>")
        pomelo.on('tableMessage', function (data) {
            switch (data.route) {
            case 'notify':
                break
            case 'shutdown':
                pomelo.disconnect()
                break
            
            case 'syncFrame':
                // for(let x in data){
                //     console.log("syncFrame>>>>>>" + x )
                //     console.log("syncFrame>>>>>>2"+ data[x] )
                     
                // }
                //  for(let x in data.operations){
                //     console.log("syncFrame>>>>>>" + x )
                //     for (let y in data.operations[x]) {
                //         console.log("syncFrame>>>>>>2"+ data.operations[x][y] )
                        
                //     }
                     
                // }
                if(data.operations && data.operations != {})
                {
                    syncData.push(data.operations)
                }
                
                // console.log("serverMessage>>>>" + data.frames)

                break
            // case 'syncFrame':
            //     if (data.frames.length == 0) {
            //         data.frames = ['sync']
            //     }
                
            //     console.log("sync Frame>>>>>>>" + data.frames)
                
            //     syncData.push(data.frames)
            //     break
            }
        })
    }

    public sendMsg(data:netMsgForm):void {
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
                console.log('send error' + res.errno)
            return
            }
            console.log('socket>>>>>>>request response ok')
        })
    }




}