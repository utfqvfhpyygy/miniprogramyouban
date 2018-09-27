// pages/homework/create/index.js

const app = getApp()

var recorderManager = wx.getRecorderManager()



Page({

  /**
   * 页面的初始数据
   */
  data: {
      isShowRecordView:false,
      selectedImgs: [],
      selectedRecords: [],
      selectedVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


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
           
          if (a.length > 9){
              a = a.slice(0, 9);
              wx.showToast({
                title: '最多9张图片',
              })
          }; 

          console.log(a);

          that.setData({
              "selectedImgs" : a,
          });
      }
    });
  },



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

  chooseVoice: function(e) {
      console.log(e)

      this.setData({
        isShowRecordView: true
      })
  },

  closeRecordView: function(e) {
      console.log(e)

      this.setData({
        isShowRecordView: false
      })
  },

  intRecord: function () {
    console.log("开始录音");

    var that = this;

    wx.getSetting({
      success: function (t) {
        t.authSetting["scope.record"] ? that.recordStart() : wx.authorize({
          scope: "scope.record",
          success: function () {
            console.log("获取授权成功"), that.recordStart();
          },
          fail: function () {
            wx.showModal({
              title: "提示",
              content: "录音需要获取您的录音权限,请允许",
              success: function (t) {
                wx.openSetting ? wx.openSetting({
                  success: function (t) {
                    that.recordStart();
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


  
  recordStart: function () {
   
    console.log("recordStart");
    console.log(recorderManager);

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

