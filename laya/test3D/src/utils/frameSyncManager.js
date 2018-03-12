/**帧同步
 * 新建一个帧同步管理器
 * utils.frameSyncManager = new frameSyncManager()
 * 
 * 在需要使用的脚本的onLoad()里 注册帧同步事件：utils.frameSyncManager.registerFunc(this)
 * 在需要开始帧同步时调用:utils.frameSyncManager.start()
 * 需要实现的接口:
 * onRun\onPause\onResume\onAcc
 */

function frameSync(params) {
  this.frameSync = {}
  //缓存帧的个数
  this.framesBufferSize = 3
  //帧步长ms
  this.step = 100
  //缓存帧是否满了
  this.isFramesBufferFull = false
  //帧同步计时器的ID
  this.syncInterId = null
}

handler = function (obj, method) {
  return function (data) {
    return method.call(obj, data);
  };
};

frameSync.prototype.start = function () {
  if (this.syncInterId) {
    return
  }
  window["syncData"] = []
  this.state = 'pause'
  this.syncInterId = setInterval(handler(this,this.interFunc), this.step)
}

frameSync.prototype.interFunc = function () {
  if (! window["syncData"]) {
    return
  }
  // 检查缓存帧是否够了
  if (!this.isFramesBufferFull) {
    if ( window["syncData"].length >= this.framesBufferSize) {
      this.isFramesBufferFull = true
    }
    return
  }
  // 队列里非缓存帧的消息数
  let notBufferSize =  window["syncData"].length - this.framesBufferSize
  console.log('frameSync>>>>>>>notBufferSize' + notBufferSize)
  // 没有卡顿，非缓存帧消息只有1个
  if (notBufferSize == 1) {
    let framesData =  window["syncData"].splice(0, notBufferSize)
    // 空帧，同步
    if (framesData[0] == 'sync') {
      console.log('frameSync>>>>> sync ')
      this.setSyncState()
    }
    // 非空，执行动作
    else {
      console.log('frameSync>>>>> run ')
      this.setRunState(framesData)
    }
  }
  // 非缓存帧消息大于1个，需要加速
  else if (notBufferSize > 1) {
    let framesData =  window["syncData"].splice(0, notBufferSize)
    console.log('frameSync>>>>> acc ')
    this.setAccState(framesData)
  }
  // 卡了，没收到非缓存帧消息，且缓存帧没用完
  else if (notBufferSize < 1 && (notBufferSize > (0 - this.framesBufferSize))) {
    let framesData =  window["syncData"].splice(0, 1)
    if (framesData[0] == 'sync') {
      console.log('frameSync>>>>> buffer sync ')
      this.setSyncState()
    } else {
      console.log('frameSync>>>>> buffer run ')
      this.setRunState(framesData)
    }
  }
  // 缓存帧也用完了
  else {
    console.log('frameSync>>>>> pause')
    this.setPauseState()
  }
}


/**帧同步状态设置>>>>>>>>>>>>>
 * setRunState\setSyncState\setPauseState\setAccState\
 */
// 帧同步状态-有新动作
frameSync.prototype.setRunState = function (syncFrames) {
  if (this.state == 'run') {
    this.state = 'run'
    this.runAction(syncFrames)
  } else if (this.state == 'pause') {
    this.state = 'run'
    this.resumeAction()
    this.runAction(syncFrames)
  } else if (this.state == 'sync') {
    this.state = 'run'
    this.runAction(syncFrames)
  }
}

// 帧同步状态-没有动作
frameSync.prototype.setSyncState = function () {
  if (this.state == 'run') {
    this.state = 'sync'
  } else if (this.state == 'pause') {
    this.state = 'sync'
    console.log('frameSync>>>>> resume ')
    this.resumeAction()
  } else if (this.state == 'sync') {
    this.state = 'sync'
  }
}

//帧同步状态-没有同步帧数据了，需要暂停
frameSync.prototype.setPauseState = function () {
  if (this.state == 'run') {
    this.state = 'pause'
    this.pauseAction()
  }else if (this.state == 'pause') {
    this.state = 'pause'
    this.pauseAction()
  }else if (this.state == 'sync') {
    this.state = 'pause'
    this.pauseAction()
  }
}

//帧同步状态-同步帧数据过多，需要加速
frameSync.prototype.setAccState = function (syncFrames) {
  if (this.state == 'run') {
    this.accAction(syncFrames)
  }else if (this.state == 'pause') {
    this.resumeAction()
    this.accAction(syncFrames)
  }else if (this.state == 'sync') {
    this.accAction(syncFrames)
  }
  this.state = 'pause'
}



/**广播同步帧到注册的节点
 * pauseAction\resumeAction\accAction\runAction
 */
// 帧同步状态-step内没有收到消息，暂停
frameSync.prototype.pauseAction = function () {
  for (let index = 0; index < this.targets.length; index++) {
    const target = this.targets[index]
    if (target.onPause) {
      target.onPause()
    }
  }
}

// 恢复执行
frameSync.prototype.resumeAction = function () {
  for (let index = 0; index < this.targets.length; index++) {
    const target = this.targets[index]
    if (target.onResume) {
      target.onResume()
    }
  }
},

// 加速执行
frameSync.prototype.accAction = function (syncData) {
  for (let index = 0; index < this.targets.length; index++) {
    const target = this.targets[index]
    if (target.onAcc) {
      target.onAcc(syncData)
    }
  }
}

// 执行step内的所有动作
frameSync.prototype.runAction = function (syncDatas) {
  for (let index = 0; index < this.targets.length; index++) {
    const target = this.targets[index]
    if (target.onRun) {
      target.onRun(syncDatas)
    }
  }
}


// 注销帧同步，非暂停
frameSync.prototype.destroy = function () {
  clearInterval(this.syncInterId)
   window["syncData"] = []
  this.isFramesBufferFull = false
  this.syncInterId = null
  console.log('frameSync>>>>>destroy')
}


/**注册帧同步回调
 *  utils.frameSyncManager.registerFunc(this)
 */
frameSync.prototype.registerFunc = function (target) {
  if (!target) {
    console.log('frameSync>>>>>registerFunc error !')
    return
  }
  if (!this.targets) {
    this.targets = []
  }
  this.targets.push(target)
}
