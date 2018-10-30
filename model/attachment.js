
import { wxChooseImage, wxChooseVedio, uploadImage, uploadFile} from '../utils/upload'
var voiceManager = require('../utils/voiceManager');

/**
 * 用户选择上传图片附件
 * @param {*} param 
 */
function miniUploadImage(param){

    console.log("miniUploadImage");

    wxChooseImage()
    .then(function(res){
        console.log("wxChooseImage suc");
        console.log(res);

        //执行loading callback
        param.loadingCallback && param.loadingCallback();

        res.tempFilePaths.forEach(function (tempFilePath){
        uploadImage(tempFilePath)
        .then(function(res){
            console.log(res);
            console.log(res.data.url);
            console.log(tempFilePath);

            //执行suc callback
            param.sucCallback && param.sucCallback(res.data.url, tempFilePath);
            
        },function(err){
            console.log("uploadImage fail");
            console.log(err)

            //执行fail callback
            param.failCallback && param.failCallback();
        })
      })

    },function(err){
        console.log("wxChooseImage fail");
        console.log(err);

        //执行suc callback
        param.failCallback && param.failCallback();
    })
}


/**
 * 用户选择上传视频附件
 * @param {*} param 
 */
function miniUploadVedio(param){
    console.log("miniUploadVedio");

    wxChooseVedio()
    .then(function(res){
        console.log("wxChooseVedio suc");
        console.log(res.tempFilePath);

        //执行loading callback
        param.loadingCallback && param.loadingCallback();

        var tempFilePath = res.tempFilePath;

        uploadFile(tempFilePath)
        .then(function (res) {
            console.log(res);
            console.log("uploadFile suc");

            //执行suc callback
            param.sucCallback && param.sucCallback(res.data.url, tempFilePath);

        }, function (err) {
            console.log("uploadFile fail");
            console.log(err)

            //执行fail callback
            param.failCallback && param.failCallback();
        })
      
    }, function (err) {
        console.log("wxChooseVedio fail");
        console.log(err);

        //执行suc callback
        param.failCallback && param.failCallback();
    })

}


class miniRecordManager {

    isRecording = false;
    timeCounter = 0;
    timer = null;
    

    constructor(param){

        voiceManager.init({

            upStart:() => {
                console.log('voiceManager upStart')
    
                //执行start callback
                param.startCallback && param.startCallback();

                //计时器
                this.timer = setInterval(() => {
                    console.log('start interval');

                    if (this.isRecording) {
                        this.timeCounter = this.timeCounter + 1;
                        console.log(this.timeCounter)
        
                        //执行counter callback
                        param.counterCallback && param.counterCallback(this.timeCounter);

                    } else {
                        console.log('start to stop')
                        clearInterval(this.timer)

                    }
                }, 1000);
            },
    
            upStop:(res) => {
                console.log('voiceManager upStop')
                console.log(res)
    
                if (Math.floor(res.duration / 1000) < 1) {
                    wx.showModal({
                        title: '提示',
                        content: '录音时间不能太短。',
                        showCancel: false
                    })
                    return
                }
    
                var tempFilePath = res.tempFilePath;
    
                //上传
                uploadFile(tempFilePath)
                .then(function (res) {
                    console.log('uploadFile suc');
                    console.log(res);
                    console.log(res.data.url);

                    //执行suc callback
                    param.stopCallback && param.stopCallback(res.data.url, tempFilePath);
    
                }, function (err) {
                    console.log(err);

                    //执行error callback
                    param.errorCallback && param.errorCallback();
                })
            },
    
            upError:(err) => {
                console.log('voiceManager upError')
                console.log(err)

                //执行error callback
                param.errorCallback && param.errorCallback();
            },
    
            upComplete:() => {
                console.log('voiceManager upComplete')
                clearInterval(this.timer)

                //执行complete callback
                param.completeCallback && param.completeCallback();
            }
    
        })
    }

    startRecord(){

        if(this.isRecording){
            console.log("click stopRecord");
            
        }else{
            console.log("click startRecord");
        }
      
        if (this.isRecording){
            voiceManager.stopRecord()
            clearInterval(this.timer)
            this.isRecording = false;
        }else{
            console.log('start record')
            console.log(voiceManager)
            voiceManager.startRecord()
            this.isRecording = true;
        }
    }

    startPlay(url,callback) {

      voiceManager.startPlay(url)
      callback && callback();

    }

    stopPlay(callback) {

      voiceManager.stopPlay()
      callback && callback();

    }


}

export {miniUploadImage,miniUploadVedio,miniRecordManager}