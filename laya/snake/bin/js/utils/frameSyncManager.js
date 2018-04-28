/**
 * 帧同步管理器
 */
var frameSync = /** @class */ (function () {
    function frameSync() {
        this.frameBufferSize = 2;
        this.stepTime = 100;
        this.isBufferFull = false;
        this.syncInterFuncId = undefined;
        this.syncState = {};
        this.targets = {};
        console.log("frameSyncManger constructor>>>>" + syncData.length);
    }
    frameSync.getInstance = function () {
        if (!frameSync._Instance) {
            frameSync._Instance = new frameSync();
        }
        return frameSync._Instance;
    };
    frameSync.prototype.startSync = function (num) {
        if (this.syncInterFuncId) {
            return;
        }
        syncData = [];
        for (var uid in this.targets) {
            this.targets[uid]['frameState'] = "pause";
        }
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
            for (var uid in frameData) {
                console.log("frameSync>>>>>>>" + uid);
                console.log("frameSyncData>>>>>>>" + frameData[uid].data);
                if (typeof (frameData[uid].data) == 'undefined') {
                    this.setSyncState({}, uid);
                }
                else {
                    this.setRunState(frameData[uid].data, uid);
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
        else if (notBufferSize > 1) {
            var frameData = syncData.splice(0, notBufferSize);
            console.log("frameSync>>>>> acc");
            for (var index = 0; index < frameData.length; index++) {
                var element = frameData[index];
                this.setAccState(element, index);
            }
        }
        else if (notBufferSize < 1 && (notBufferSize > (0 - this.frameBufferSize))) {
            var frameData = syncData.splice(0, 1);
            for (var index = 0; index < frameData.length; index++) {
                var element_1 = frameData[index];
                if (element_1 == "sync") {
                    console.log('frameSync>>>>> buffer sync ');
                    this.setSyncState(element_1, index);
                }
                else {
                    console.log('frameSync>>>>> buffer run ');
                    this.setRunState(element_1, index);
                }
            }
        }
        else {
            for (var index = 0; index < this.targets.length; index++) {
                console.log('frameSync>>>>> pause');
                this.setPauseState(index);
            }
        }
    };
    frameSync.prototype.setRunState = function (syncFrames, index) {
        switch (this.syncState[index]) {
            case "run":
                this.syncState[index] = "run";
                this.runAction(syncFrames, index);
                break;
            case "pause":
                this.syncState[index] = "run";
                this.resumeAction(index);
                this.runAction(syncFrames, index);
                break;
            case "sync":
                this.syncState[index] = "run";
                this.runAction(syncFrames, index);
                break;
            default:
                break;
        }
    };
    frameSync.prototype.setSyncState = function (syncFrames, index) {
        switch (this.syncState[index]) {
            case "run":
                this.syncState[index] = "sync";
                break;
            case "pause":
                this.syncState[index] = "sync";
                this.resumeAction(index);
                break;
            case "sync":
                this.syncState[index] = "sync";
                break;
            default:
                break;
        }
    };
    frameSync.prototype.setPauseState = function (index) {
        switch (this.syncState[index]) {
            case "run":
                this.syncState[index] = "pause";
                this.pauseAction(index);
                break;
            case "pause":
                this.syncState[index] = "pause";
                this.pauseAction(index);
                break;
            case "sync":
                this.syncState[index] = "pause";
                this.pauseAction(index);
                break;
            default:
                break;
        }
    };
    frameSync.prototype.setAccState = function (syncFrames, index) {
        switch (this.syncState[index]) {
            case "run":
                this.accAction(syncFrames, index);
                break;
            case "pause":
                this.resumeAction(index);
                this.accAction(syncFrames, index);
                break;
            case "sync":
                this.accAction(syncFrames, index);
                break;
            default:
                break;
        }
        this.syncState[index] = "pause";
    };
    frameSync.prototype.pauseAction = function (targetIndex) {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (index == targetIndex && target.getComponentByType(newSnake).onStatePause) {
                target.getComponentByType(newSnake).onStatePause();
            }
        }
    };
    frameSync.prototype.resumeAction = function (targetIndex) {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (index == targetIndex && target.getComponentByType(newSnake).onStateResume) {
                target.getComponentByType(newSnake).onStateResume();
            }
        }
    };
    // 加速执行
    frameSync.prototype.accAction = function (syncData, targetIndex) {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (index == targetIndex && target.getComponentByType(newSnake).onStateAcc) {
                target.getComponentByType(newSnake).onStateAcc(syncData);
            }
        }
    };
    // 执行step内的所有动作
    frameSync.prototype.runAction = function (syncDatas, targetIndex) {
        for (var index = 0; index < this.targets.length; index++) {
            var target = this.targets[index];
            if (index == targetIndex && target.getComponentByType(newSnake).onStateRun) {
                target.getComponentByType(newSnake).onStateRun(syncDatas);
            }
        }
    };
    frameSync.prototype.destory = function () {
        clearInterval(this.syncInterFuncId);
        syncData = [];
        this.isBufferFull = false;
        this.syncInterFuncId = undefined;
    };
    frameSync.prototype.registerTarget = function (target, uid) {
        if (!target) {
            console.log("frameSync>>>>>>>>> registerTarget error !");
            return;
        }
        if (!this.targets) {
            this.targets = {};
        }
        this.targets[uid] = target;
    };
    frameSync.prototype.removeTarget = function (target) {
    };
    return frameSync;
}());
//# sourceMappingURL=frameSyncManager.js.map