/**
 * 帧同步管理器
 */
    class frameSync{
        private static _Instance:frameSync;
        private frameBufferSize:number = 2;
        private stepTime:number = 100;
        private isBufferFull:boolean = false;
        private syncInterFuncId:any = undefined;
        private syncState = {};
        private targets = {};

        constructor(){
            console.log("frameSyncManger constructor>>>>"+ syncData.length)
        }
        
        public static getInstance():frameSync{
            if(!frameSync._Instance){
                 frameSync._Instance = new frameSync();
            }
            return frameSync._Instance;
        }
        
        public startSync(num):void{
            if (this.syncInterFuncId) {
                return 
            }
            syncData = [];
            for (let uid in this.targets) {
                this.targets[uid]['frameState'] = "pause";
            }
            this.syncInterFuncId = setInterval(handler(this,this.interFunc),this.stepTime);
        }

        public interFunc():void{
            if (! syncData ) {
                return 
            };
            if (! this.isBufferFull ) {
                if (syncData.length >= this.frameBufferSize) {
                    this.isBufferFull = true;
                };
                return 
            };
            let notBufferSize:number = syncData.length - this.frameBufferSize;
            console.log("frameSync>>>>> not buffer size "+ notBufferSize);
            //非缓帧消息里只有一个
            if (notBufferSize == 1 ) {
                let frameData = syncData.splice(0,notBufferSize);
                for (let uid in frameData) {
                    console.log("frameSync>>>>>>>"+ uid)
                    console.log("frameSyncData>>>>>>>"+frameData[uid].data)
                    if (typeof(frameData[uid].data) == 'undefined' ) {
                        this.setSyncState({},uid);
                    }
                    else{
                        this.setRunState(frameData[uid].data,uid)
                    }
                }

                
                // for (let index = 0; index < frameData.length; index++) {
                //     let element = frameData[index];
                //     if (element == "sync") {
                //         console.log("frameSync>>>>> sync");
                //         this.setSyncState(element,index);
                //      }
                //     else {
                //         console.log("frameSync>>>> run")
                //         this.setRunState(element,index);
                //     }
                // }

            }
            //非缓存帧消息里大于一个，需要加速
            else if (notBufferSize > 1 ){
                let frameData = syncData.splice(0,notBufferSize);
                console.log("frameSync>>>>> acc")
                for (let index = 0; index < frameData.length; index++) {
                    var element = frameData[index];
                    this.setAccState(element,index)
                }
            }

            //卡了，没收到非缓存帧消息，且缓存帧没用完
            else if (notBufferSize < 1 && (notBufferSize>(0- this.frameBufferSize))){
                let frameData = syncData.splice(0,1);

                for (let index = 0; index < frameData.length; index++) {
                    let element = frameData[index];
                     if (element == "sync") {
                        console.log('frameSync>>>>> buffer sync ')
                        this.setSyncState(element,index)
                    }else {
                        console.log('frameSync>>>>> buffer run ')
                        this.setRunState(element,index)
                    }
                }
               
            }

            // 缓存帧也用完了
            else {
                for (let index = 0; index < this.targets.length; index++) {
                    console.log('frameSync>>>>> pause')
                    this.setPauseState(index)
                }
                
            }
        }

        public setRunState(syncFrames,index):void {
            switch (this.syncState[index]) {
                case "run":
                    this.syncState[index] = "run";
                    this.runAction(syncFrames,index);
                    break;
                case "pause":
                    this.syncState[index] = "run";
                    this.resumeAction(index);
                    this.runAction(syncFrames,index);
                    break;
                case "sync":
                    this.syncState[index] = "run"
                    this.runAction(syncFrames,index);
                    break;
                default:
                    break;
            }
        }

        public setSyncState(syncFrames,index):void {
            switch (this.syncState[index]) {
                case "run":
                    this.syncState[index] = "sync";
                    break;
                case "pause":
                    this.syncState[index] = "sync";
                    this.resumeAction(index);
                    break;
                case "sync":
                    this.syncState[index] = "sync"
                    break;
                default:
                    break;
            }
        }

        public setPauseState(index):void {
            switch (this.syncState[index]) {
                case "run":
                    this.syncState[index] = "pause";
                    this.pauseAction(index)
                    break;
                case "pause":
                    this.syncState[index] = "pause";
                    this.pauseAction(index)
                    break;
                case "sync":
                    this.syncState[index] = "pause"
                    this.pauseAction(index)
                    break;
                default:
                    break;
            }
        }

        public setAccState(syncFrames,index):void {
            switch (this.syncState[index]) {
                case "run":
                    this.accAction(syncFrames,index)
                    break;
                case "pause":
                    this.resumeAction(index)
                    this.accAction(syncFrames,index)
                    break;
                case "sync":
                    this.accAction(syncFrames,index)
                    break;
                default:
                    break;
            }
            this.syncState[index] = "pause";
        }
        

        public pauseAction(targetIndex){
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (index == targetIndex && target.getComponentByType(newSnake).onStatePause) {
                 target.getComponentByType(newSnake).onStatePause()
                }
            }
        }

        public resumeAction(targetIndex){
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (index == targetIndex && target.getComponentByType(newSnake).onStateResume) {
                target.getComponentByType(newSnake).onStateResume()
                }
            }
        }

        // 加速执行
        public accAction(syncData,targetIndex) {
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (index == targetIndex && target.getComponentByType(newSnake).onStateAcc) {
                target.getComponentByType(newSnake).onStateAcc(syncData)
                }
            }
        }

        // 执行step内的所有动作
        public runAction (syncDatas,targetIndex) {
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (index == targetIndex && target.getComponentByType(newSnake).onStateRun) {
                target.getComponentByType(newSnake).onStateRun(syncDatas)
                }
            }
        }

        public destory(){
            clearInterval(this.syncInterFuncId);
            syncData = []
            this.isBufferFull = false;
            this.syncInterFuncId = undefined;
        }

        public registerTarget(target:any,uid:string){
            if (! target) {
                console.log("frameSync>>>>>>>>> registerTarget error !")
                return
            }
            if (!this.targets) {
                this.targets = {};
            }
            this.targets[uid]  = target;
        }

        public removeTarget(target){
            
        }

       











    }