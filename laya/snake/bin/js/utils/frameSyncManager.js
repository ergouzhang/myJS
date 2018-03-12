/**
 * 帧同步管理器
 */
var frameSync = /** @class */ (function () {
    function frameSync() {
        this.frameBufferSize = 3;
        this.stepTime = 100;
        this.isBufferFull = false;
        this.syncInterFuncId = undefined;
        this.syncState = "pause";
        this.targets = [];
        console.log("frameSyncManger constructor>>>>" + syncData.length);
    }
    frameSync.getInstance = function () {
        if (!frameSync._Instance) {
            frameSync._Instance = new frameSync();
        }
        return frameSync._Instance;
    };
    frameSync.prototype.startSync = function () {
        if (this.syncInterFuncId) {
            return;
        }
        syncData = [];
        this.syncState = "pause";
        this.syncInterFuncId = setInterval(handler(this, this.interFunc), this.stepTime);
    };
    frameSync.prototype.interFunc = function () {
        if (!syncData) {
            return;
        }
        ;
        if (!this.isBufferFull) {
            if (syncData.length >= this.frameBufferSize) {
                this.isBufferFull = true;
            }
            ;
            return;
        }
        ;
        var notBufferSize = syncData.length - this.frameBufferSize;
        console.log("frameSync>>>>> not buffer size " + notBufferSize);
        //非缓帧消息里只有一个
        if (notBufferSize == 1) {
            var frameData = syncData.splice(0, notBufferSize);
            if (frameData[0] == "sync") {
                console.log("frameSync>>>>> sync");
                this.setSyncState(frameData);
            }
            else {
                console.log("frameSync>>>> run");
                this.setRunState(frameData);
            }
        }
        else if (notBufferSize > 1) {
            var frameData = syncData.splice(0, notBufferSize);
            console.log("frameSync>>>>> acc");
            this.setAccState(frameData);
        }
        else if (notBufferSize < 1 && (notBufferSize > (0 - this.frameBufferSize))) {
            var frameData = syncData.splice(0, 1);
            if (frameData[0] == "sync") {
                console.log('frameSync>>>>> buffer sync ');
                this.setSyncState(frameData);
            }
            else {
                console.log('frameSync>>>>> buffer run ');
                this.setRunState(frameData);
            }
        }
        else {
            console.log('frameSync>>>>> pause');
            this.setPauseState();
        }
    };
    frameSync.prototype.setRunState = function (syncFrames) {
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
                this.syncState = "run";
                this.runAction(syncFrames);
                break;
            default:
                break;
        }
    };
    frameSync.prototype.setSyncState = function (syncFrames) {
        switch (this.syncState) {
            case "run":
                this.syncState = "sync";
                break;
            case "pause":
                this.syncState = "sync";
                this.resumeAction();
                break;
            case "sync":
                this.syncState = "sync";
                break;
            default:
                break;
        }
    };
    frameSync.prototype.setPauseState = function () {
        switch (this.syncState) {
            case "run":
                this.syncState = "pause";
                this.pauseAction();
                break;
            case "pause":
                this.syncState = "pause";
                this.pauseAction();
                break;
            case "sync":
                this.syncState = "pause";
                this.pauseAction();
                break;
            default:
                break;
        }
    };
    frameSync.prototype.setAccState = function (syncFrames) {
        switch (this.syncState) {
            case "run":
                this.accAction(syncFrames);
                break;
            case "pause":
                this.resumeAction();
                this.accAction(syncFrames);
                break;
            case "sync":
                this.accAction(syncFrames);
                break;
            default:
                break;
        }
        this.syncState = "pause";
    };
    frameSync.prototype.pauseAction = function () {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (target.onPause) {
                target.onPause();
            }
        }
    };
    frameSync.prototype.resumeAction = function () {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (target.onResume) {
                target.onResume();
            }
        }
    };
    // 加速执行
    frameSync.prototype.accAction = function (syncData) {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (target.onAcc) {
                target.onAcc(syncData);
            }
        }
    };
    // 执行step内的所有动作
    frameSync.prototype.runAction = function (syncDatas) {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (target.onRun) {
                target.onRun(syncDatas);
            }
        }
    };
    frameSync.prototype.destory = function () {
        clearInterval(this.syncInterFuncId);
        syncData = [];
        this.isBufferFull = false;
        this.syncInterFuncId = undefined;
    };
    frameSync.prototype.registerTarget = function (target) {
        if (!target) {
            console.log("frameSync>>>>>>>>> registerTarget error !");
            return;
        }
        if (!this.targets) {
            this.targets = [];
        }
        this.targets.push(target);
    };
    return frameSync;
}());
//# sourceMappingURL=frameSyncManager.js.map