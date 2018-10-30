import {miniUploadImage,miniUploadVedio,miniRecordManager} from '../../../model/attachment.js'

const app = getApp()

var audioStatusPlay = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  miniRecordManager:{},

    loading:false,
    isShowRecordView: false,  //是否显示录音界面
    time_counter:0,  //录音计时显示

    /*
    暂定9个附件，用a1-a9,使用后就标记true,没有使用就是false
    */
    alist: [],
    alistType: [],
    alistUrl: [],
    alistTempUrl: [],
    buttonName:'开始录音',
    aimage:'../../../image/play.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        
    const that = this

    this.data.miniRecordManager = new miniRecordManager({
        startCallback:function(){
            that.setData({
                buttonName: '开始录音',
            })
        },
        counterCallback:function(counter){
            that.setData({
                time_counter: counter
            })
        },
        stopCallback: function (url, tempFilePath){

            //追加音频，先看看之前有多少
            var newAlist     = that.data.alist.concat("");
            var newAlistUrl  = that.data.alistUrl.concat(url);
            var newAlistType = that.data.alistType.concat('audio');
            var newAlistTempUrl = that.data.alistTempUrl.concat(tempFilePath);

            that.setData({
                alist: newAlist,
                alistUrl: newAlistUrl,
                alistType: newAlistType,
                alistTempUrl: newAlistTempUrl,
            })
        },
        errorCallback:function(){

        },
        completeCallback:function(){
            that.setData({
                time_counter: 0,
                isShowRecordView: false,
                buttonName: '开始录音',
            })
        },
    });

  },


  /**
   * 用户点击选择图片按钮
   */
  chooseImage: function (e) {

    var that = this;

    miniUploadImage({
      loadingCallback:function(){
        that.setData({
          loading:true
        })
      },
      sucCallback: function (url, tempFilePath){

        //追加图片，先看看之前有多少
        var newAlist = that.data.alist.concat("");
        var newAlistUrl = that.data.alistUrl.concat(url);
        var newAlistType = that.data.alistType.concat('img');
        var newAlistTempUrl = that.data.alistTempUrl.concat(tempFilePath);

        that.setData({
          alist: newAlist,
          alistUrl: newAlistUrl,
          alistType: newAlistType,
          alistTempUrl: newAlistTempUrl,
          loading: false,
        })

      },
      failCallback:function(){
        that.setData({
          loading:false
        })
      }
    })

  },


  /**
   * 用户点击选择视频按钮
   */
  chooseVedio: function (e) {

    var that = this;

    miniUploadVedio({
      loadingCallback:function(){
        that.setData({
          loading:true
        })
      },
      sucCallback: function (url,tempFilePath){

          //追加视频，先看看之前有多少
          var newAlist = that.data.alist.concat("");
          var newAlistUrl = that.data.alistUrl.concat(url);
          var newAlistType = that.data.alistType.concat('video');
          var newAlistTempUrl = that.data.alistTempUrl.concat(tempFilePath);

          that.setData({
            alist: newAlist,
            alistUrl: newAlistUrl,
            alistType: newAlistType,
            alistTempUrl: newAlistTempUrl,
            loading: false,
          })

      },
      failCallback:function(){
        that.setData({
          loading:false
        })
      }
    })

  },

  /**
   * 选择录音出现van-popup
   */
  chooseVoice: function (e) {
    console.log(e)

    this.setData({
      "isShowRecordView":true
    })
  },

  /**
   * 关闭录音van-popup
   */
  closeRecordView: function (e) {
    console.log(e)

    this.setData({
      "isShowRecordView":false,
      "isRecording":false,
      "time_counter":0,
      "buttonName": '开始录音'
    })
  },


  /**
   * 开始录音
   */
  startRecord: function () {
      this.data.miniRecordManager && this.data.miniRecordManager.startRecord()
  },


  /**
  * 开始播放
  */
  startPlay: function(res){
      console.log('start play');
      console.log(res);

      var url = res.currentTarget.dataset.src;
      if(!url){
          console.log('url is null');
      }

      if ( audioStatusPlay == 1  ){
        this.stopPlay();
        console.log('stop audio')
        return ;
      }
      
      console.log(url);
      
      this.data.miniRecordManager.startPlay(url,() => {
          audioStatusPlay = 1;
          this.setData({
            aimage: '../../../image/stop.png'
          })
      })

  },


  /**
  * 停止播放
  */
    stopPlay: function () {
      console.log('stop play');

      this.data.miniRecordManager.stopPlay(() => {
          audioStatusPlay = 0;
          this.setData({
            aimage: '../../../image/play.png'
          })
      })

    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})