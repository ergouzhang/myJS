/**
 * 帧同步管理器
 */
    class frameSync{
        private static _Instance:frameSync;
        private frameBufferSize:number = 3;
        private stepTime:number = 100;
        private isBufferFull:boolean = false;
        private syncInterFuncId:any = undefined;
        private syncState:string = "pause";
        private targets:any[] = [];

        constructor(){
            console.log("frameSyncManger constructor>>>>"+ syncData.length)
        }
        
        public static getInstance():frameSync{
            if(!frameSync._Instance){
                 frameSync._Instance = new frameSync();
            }
            return frameSync._Instance;
        }
        
        public startSync():void{
            if (this.syncInterFuncId) {
                return 
            }
            syncData = [];
            this.syncState = "pause";            
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
                if (frameData[0] == "sync") {
                    console.log("frameSync>>>>> sync");
                    this.setSyncState(frameData);
                }
                else {
                    console.log("frameSync>>>> run")
                    this.setRunState(frameData);
                }
            }
            //非缓存帧消息里大于一个，需要加速
            else if (notBufferSize > 1 ){
                let frameData = syncData.splice(0,notBufferSize);
                console.log("frameSync>>>>> acc")
                this.setAccState(frameData)
            }

            //卡了，没收到非缓存帧消息，且缓存帧没用完
            else if (notBufferSize < 1 && (notBufferSize>(0- this.frameBufferSize))){
                let frameData = syncData.splice(0,1);
                if (frameData[0] == "sync") {
                    console.log('frameSync>>>>> buffer sync ')
                    this.setSyncState(frameData)
                }else {
                    console.log('frameSync>>>>> buffer run ')
                    this.setRunState(frameData)
                }
            }

            // 缓存帧也用完了
            else {
                console.log('frameSync>>>>> pause')
                this.setPauseState()
            }
        }

        public setRunState(syncFrames):void {
            switch (this.syncState) {
                case "run":
                    this.syncState = "run";
                    this.runAction(syncFrames);
                    break;
                case "pause":
                    this.syncState = "run";
                    this.resumeAction();
                    this.runAction(syncFrames);
                    break;
                case "sync":
                    this.syncState = "run"
                    this.runAction(syncFrames);
                    break;
                default:
                    break;
            }
        }

        public setSyncState(syncFrames):void {
            switch (this.syncState) {
                case "run":
                    this.syncState = "sync";
                    break;
                case "pause":
                    this.syncState = "sync";
                    this.resumeAction();
                    break;
                case "sync":
                    this.syncState = "sync"
                    break;
                default:
                    break;
            }
        }

        public setPauseState():void {
            switch (this.syncState) {
                case "run":
                    this.syncState = "pause";
                    this.pauseAction()
                    break;
                case "pause":
                    this.syncState = "pause";
                    this.pauseAction()
                    break;
                case "sync":
                    this.syncState = "pause"
                    this.pauseAction()
                    break;
                default:
                    break;
            }
        }

        public setAccState(syncFrames):void {
            switch (this.syncState) {
                case "run":
                    this.accAction(syncFrames)
                    break;
                case "pause":
                    this.resumeAction()
                    this.accAction(syncFrames)
                    break;
                case "sync":
                    this.accAction(syncFrames)
                    break;
                default:
                    break;
            }
            this.syncState = "pause";
        }
        

        public pauseAction(){
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (target.onPause) {
                target.onPause()
                }
            }
        }

        public resumeAction(){
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (target.onResume) {
                target.onResume()
                }
            }
        }

        // 加速执行
        public accAction(syncData) {
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (target.onAcc) {
                target.onAcc(syncData)
                }
            }
        }

        // 执行step内的所有动作
        public runAction (syncDatas) {
            for (let index = 0; index < this.targets.length; index++) {
                const target = this.targets[index]
                if (target.onRun) {
                target.onRun(syncDatas)
                }
            }
        }

        public destory(){
            clearInterval(this.syncInterFuncId);
            syncData = []
            this.isBufferFull = false;
            this.syncInterFuncId = undefined;
        }

        public registerTarget(target:any){
            if (! target) {
                console.log("frameSync>>>>>>>>> registerTarget error !")
                return
            }
            if (!this.targets) {
                this.targets = [];
            }
            this.targets.push(target);
        }

       











    }