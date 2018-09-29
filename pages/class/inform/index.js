import { MiniChooseImage } from '../../utils/upload'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedBackChecked:false,   //是否需要反馈
    isShowRecordView: false,  //是否显示录音界面
    isRecording:false,  //是否正在录音中
    voiceRecordingTimer: null,  //录音计时器
    time_counter:0,  //录音计时
    selectedImgs: [],  //选中的图片
    selectedRecords: [],   //选中的录音
    selectedVideos: []    //选中的视频
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const voiceRecorderManager = wx.getRecorderManager()
    voiceRecorderManager.onStart(this.onVoiceRecorderManagerStart)
    voiceRecorderManager.onStop(res => this.onVoiceRecorderManagerStop(res))
    voiceRecorderManager.onError(err => this.onVoiceRecorderManagerError(err))

    this.setData({
      voiceRecorderManager,
    })

  },

  /**
   * 是否需要反馈变化
   */
  onChange:function (e) {
    this.setData({
      "feedBackChecked": !this.data.feedBackChecked
    })
  },


  /**
   * 录音开始回调
   */
  onVoiceRecorderManagerStart() {
      console.log('recorder start')

      that.setData({
          "isRecording":true,
          "time_counter":0
      });

      //计时器
      var voiceRecordingTimer = setInterval(function () {
        console.log('start interval')
        if (that.data.isRecording) {
          var timeTotal = that.data.time_counter + 1;

          console.log(timeTotal)

          that.setData({
            time_counter: timeTotal
          })
        }else{
          console.log('clearInterval')
          clearInterval(voiceRecordingTimer)
        } 
      }.bind(that), 1000);
  },

  /**
   * 录音结束回调
   */
  onVoiceRecorderManagerStop(res) {


      const that = this

      // 正常结束
      console.log(res)
      clearInterval(this.data.voiceRecordingTimer)
      this.setData({
        voiceRecording: false,
        voiceRecordingTimer: null
      }, () => {
        this.data.voiceRecorderManager.stop()
      })

      if (Math.floor(res.duration / 1000) < 1) {
        wx.showModal({
          title: '提示',
          content: '录音时间不能太短。',
          showCancel: false
        })
        return
      }

      //音频数量限制
      var a = this.data.selectedRecords.concat(res.tempFilePath);
      if (a.length > 5) {
          a = a.slice(0, 5);
          wx.showToast({
                title: '最多5个音频',
          })
          return
      };

      wx.uploadFile({
        url: app.globalData.origin + 'SGWeChat/uploadFile',
        filePath: res.tempFilePath,
        name: 'file',
        formData: {
          uid: this.data.userInfo.uid
        },
        success(respond) {
          if (respond.statusCode === 200) {
            const data = JSON.parse(respond.data)
            if (data.code === 0) {


              console.log(a);

              this.setData({
                "selectedRecords": a,
              });
            }
          }
        },
        fail(err) {
          console.log(err)
        }
      })

      this.setData({
        
      })
    
  },

  /**
   * 录音错误回调
   */
  onVoiceRecorderManagerError(err) {
    console.log(err)

    clearInterval(this.data.voiceRecordingTimer)
    this.setData({
      isRecording: false,
      time_counter: 0
    }, () => {
      this.data.voiceRecorderManager.stop()
    })
  },


  /**
   * 选择图片
   */
  chooseImage: function (e) {

    console.log(e)


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

  },


  /**
   * 结束录音
   */
  endRecord: function () {

    console.log("endRecord");

    recorderManager.stop()
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