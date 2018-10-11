var canUseNewMaker = !!wx.getRecorderManager
var canUseNewPlayer = !!wx.createInnerAudioContext
var recorderManager
var innerAudioContext

var upStart; 
var upStop; 
var upError; 
var upComplete; 

var playStart; 
var playStop; 
var playError; 
var playComplete; 


function init(param){


    recorderManager = canUseNewMaker && !recorderManager ? wx.getRecorderManager() : ''
    innerAudioContext = canUseNewPlayer && !innerAudioContext ? wx.createInnerAudioContext() : ''
    recorderManager ? newMakerInit() : ''
    innerAudioContext ? newPlayerInit() : ''


    // 配置默认设置
    upStart = param.upStart || function () {}
    upStop = param.upStop || function (res) {
        console.log(res)
    }
    upError = param.upError || function (err) {
        console.log(err)
    }
    upComplete = param.upComplete || function () { }


    playStart = param.playStart || function () {}
    playStop = param.playStop || function (res) {
        console.log(res)
    }
    playError = param.playError || function (err) {
        console.log(err)
    }
    playComplete = param.playComplete || function () {}  

}

function startRecord(){
    recorderManager ? newMakerStart() : ''
}

function stopRecord(){
    recorderManager ? newMakerStop() : ''
}

function startPlay(url){
    innerAudioContext ? newPlayerPlay(url): ''
}

function stopPlay(){
    innerAudioContext ? newPlayerStop() : ''
}

/**
 * 1.6 6.5.16/18 才支持的 wx.getRecorderManager
 */
function newMakerInit() {


    // 监听录音开始
    recorderManager.onStart(() => {
        console.log('recorderManager onStart')
        upStart()
    })

    // 监听录音结束
    recorderManager.onStop((res) => {
        console.log('recorderManager onStop')
        upStop(res)
        upComplete()
    })

    // 监听录音出错
    recorderManager.onError(err => {
        console.log('recorderManager onError')
        upError(err)
        upComplete()
    })

    // 监听录音中断
    recorderManager.onPause(() => {
      console.log('recorderManager onPause')
    })


}

function newMakerStart() {

    const options = {
        duration: 120000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'mp3',
        frameSize: 50
    }

    wx.authorize({
        scope: 'scope.record',
        success() {
          console.log("录音授权成功");

          recorderManager.start(options);
        },
        
        fail(){
          console.log("第一次录音授权失败");

          wx.showModal({
            title: '提示',
            content: '您未授权录音，功能将无法使用',
            showCancel: true,
            confirmText: "授权",
            confirmColor: "#52a2d8",
            success: function (res) {
              if (res.confirm) {

                wx.openSetting({
                  success: (res) => {
                    console.log(res.authSetting);
                    if (!res.authSetting['scope.record']) {
                      //未设置录音授权
                      console.log("未设置录音授权");
                      wx.showModal({
                        title: '提示',
                        content: '您未授权录音，功能将无法使用',
                        showCancel: false,
                        success: function (res) {
                            recorderManager.start(options)
                        },
                      })
                    } else {
                      //第二次才成功授权
                      console.log("设置录音授权成功");
                      recorderManager.start(options);
                    }
                  },
                  fail: function () {
                    console.log("授权设置录音失败");
                  }
                })
              } else if (res.cancel) {
                console.log("cancel");
              }
            },
            fail: function () {
              console.log("openfail");
            }
          })
        }
    })
    
}

function newMakerStop() {
    recorderManager.stop()
}


/**
 * 初始化
*/
function newPlayerInit() {

    innerAudioContext.onPlay(() => {
        playStart()
    })

    innerAudioContext.onStop((res) => {
        playStop(res)
        playComplete()
    })

    innerAudioContext.onError((err) => {
        playError(err)
        playComplete()
    })
    
}

function newPlayerPlay(src){
    console.log('newPlayerPlay')
    console.log(src)
    console.log(innerAudioContext)

    innerAudioContext.src = src
    innerAudioContext.play()
}

function newPlayerStop(){
    innerAudioContext.stop()
}


module.exports = {
    init:init,
    startRecord:startRecord,
    stopRecord:stopRecord,
    startPlay:startPlay,
    stopPlay:stopPlay
}


