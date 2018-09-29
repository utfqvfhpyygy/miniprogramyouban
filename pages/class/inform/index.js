// pages/class/index/index.js

const app = getApp()
var recorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked:false,
    isShowRecordView: false,
    isRecording:false,
    time_counter:0,
    selectedImgs: [],
    selectedRecords: [],
    selectedVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onChange:function (e) {
    this.setData({
      "checked": !this.data.checked
    })
  },


  /**
   * 选择图片
   */
  chooseImage: function (e) {

    console.log(e)

    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (e) {

        console.log(e)
        var a = that.data.selectedImgs.concat(e.tempFilePaths);

        if (a.length > 9) {
          a = a.slice(0, 9);
          wx.showToast({
            title: '最多9张图片',
          })
        };

        console.log(a);

        that.setData({
          "selectedImgs": a,
        });
      }
    });
  },


  /**
   * 选择视频
   */
  chooseVedio: function (e) {

    console.log(e)

    var that = this;
    wx.chooseVideo({
      sourceType: ["album", "camera"],
      maxDuration: 60,
      camera: "back",
      success: function (e) {

        var a = that.data.selectedVideos.concat(e.tempFilePath);

        if (a.length > 5) {
          a = a.slice(0, 5);
          wx.showToast({
            title: '最多9个视频',
          })
        };

        console.log(a);

        that.setData({
          "selectedVideos": a,
        });

      }
    });
  },

  /**
   * 选择录音
   */
  chooseVoice: function (e) {
    console.log(e)

    this.setData({
      "isShowRecordView":true
    })
  },

  /**
   * 关闭录音
   */
  closeRecordView: function (e) {
    console.log(e)

    this.setData({
      "isShowRecordView":false,
      "isRecording":false,
      "time_counter":0
    })
  },

  /**
   * 录音
   */
  checkRecord: function () {
    console.log("开始录音");

    var that = this;

    wx.getSetting({
      success: function (t) {
        t.authSetting["scope.record"] ? that.startRecord() : wx.authorize({
          scope: "scope.record",
          success: function () {
            console.log("获取授权成功"), that.startRecord();
          },
          fail: function () {
            wx.showModal({
              title: "提示",
              content: "录音需要获取您的录音权限,请允许",
              success: function (t) {
                wx.openSetting ? wx.openSetting({
                  success: function (t) {
                    that.startRecord();
                  }
                }) : wx.redirectTo({

                });
              }
            });
          }
        });
      }
    });
  },

  /**
   * 开始录音
   */
  startRecord: function () {

    console.log("startRecord");
    console.log(recorderManager);

    var that = this;

    var options = {
      sampleRate: 12e3,
      numberOfChannels: 1,
      encodeBitRate: 3e4,
      format: "mp3",
      duration: 6e5,
      frameSize: 50
    };

    recorderManager.start(options)

    recorderManager.onStart(() => {
      console.log('recorder start')

      that.setData({
          "isRecording":true,
          "time_counter":0
      });

      //计时器
      var timer = setInterval(function () {
        console.log('start interval')
        if (that.data.isRecording) {
          var timeTotal = that.data.time_counter + 1;

          console.log(timeTotal)

          that.setData({
            time_counter: timeTotal
          })
        }else{
          console.log('clearInterval')
          clearInterval(timer)
        } 
      }.bind(that), 1000);

    })

    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)

      var a = this.data.selectedRecords.concat(res.tempFilePath);

      if (a.length > 5) {
        a = a.slice(0, 5);
        wx.showToast({
          title: '最多5个音频',
        })
      };

      console.log(a);

      this.setData({
        "selectedRecords": a,
      });

    })
    recorderManager.onError((e) => {

      console.log(e)
    })



  },


  /**
   * 结束录音
   */
  endRecord: function () {

    console.log("endRecord");

    recorderManager.stop()

    this.setData({
      "isRecording": false
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