import { wxChooseImage, wxChooseVedio, uploadImage, uploadFile } from '../../../utils/upload'
var voiceManager = require('../../../utils/voiceManager');

const app = getApp()

var audioStatusPlay = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coureNameList:[],
    coureIndex: 0,
    classList:[],
    classIndex:0,
    feedBackTypeList:[],
    feedBackIndex: 0,

    feedBackChecked: false,   //是否需要反馈
    content: '',   //通知内容
    isShowRecordView: false,  //是否显示录音界面
    isRecording: false,  //是否正在录音中
    voiceRecordingTimer: null,  //录音计时器
    time_counter: 0,  //录音计时

    selectedImgsTmp: [],  //选中的图片
    selectedRecordsTmp: [],   //选中的录音
    selectedVideosTmp: [],    //选中的视频

    selectedImgsUrl: [],      //选中的图片
    selectedRecordsUrl: [],   //选中的录音
    selectedVideosUrl: [],    //选中的视频
    /*
    暂定9个附件，用a1-a9,使用后就标记true,没有使用就是false
    */
    alist: [],
    alistType: [],
    alistUrl: [],
    alistTempUrl: [],
    buttonName: '开始录音',
    aimage: '../../../image/play.png',

    //array: ['签到+相片','签到', '相片', '视频', '语音','语音+相片'],
    //workType:['语文','数学','英语','体育','美术'],
    //workClass: ['一年级', '二年级', '三年级', '四年级', '五年级'],
    date:'2018-10-18'

  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('onLoad')
    const that = this
    var uid = app.getUid();

    app.requestData({
      url: app.globalData.origin + 'homework/configList',
      params: {
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res)
        that.setData({
          "coureNameList": res.data.courseNameList,
          "classList": res.data.classList,
          "feedBackTypeList": res.data.feedbackTypeList,
          "date":res.data.deadlineDate,
        })
      },
      errBack: function (msg) {
        console.log('fail111')
        wx.showModal({
          title: '提示',
          content: msg,
          showCancel: false
        })
      }
    })

    voiceManager.init({

      upStart: function () {
        console.log('voiceManager upStart')

        that.setData({
          "isRecording": true,
          "time_counter": 0
        })

        //计时器
        var voiceRecordingTimer = setInterval(function () {
          console.log('start interval')
          if (that.data.isRecording) {
            var timeTotal = that.data.time_counter + 1;

            console.log(timeTotal)

            that.setData({
              time_counter: timeTotal
            })
          } else {
            console.log('clearInterval')
            clearInterval(voiceRecordingTimer)
          }
        }.bind(that), 1000);
      },

      upStop: function (res) {
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
        //音频数量限制
        // var tmpList = that.data.selectedVideosTmp.concat(tempFilePath);
        // if (tmpList.length > 5) {
        //   wx.showToast({
        //     title: '最多5个音频',
        //   })
        //   return
        // };

        // //上传
        uploadFile(tempFilePath)
          .then(function (res) {

            console.log(res);
            console.log(res.data.url);
            //追加音频，先看看之前有多少
            var newAlist = that.data.alist.concat("");
            var newAlistUrl = that.data.alistUrl.concat(res.data.url);
            var newAlistType = that.data.alistType.concat('audio');
            var newAlistTempUrl = that.data.alistTempUrl.concat(tempFilePath);

            that.setData({
              alist: newAlist,
              alistUrl: newAlistUrl,
              alistType: newAlistType,
              alistTempUrl: newAlistTempUrl,
            })

          }, function (err) {
            console.log(err);
          })

        // uploadFile(tempFilePath)
        //   .then(function (res) {
        //     console.log("uploadVoice suc");
        //     console.log(res);
        //   }, function (err) {
        //     console.log("uploadVoice fail");
        //     console.log(err);
        //   })
      },

      upError: function (err) {
        console.log('voiceManager upError')
        console.log(err)
      },

      upComplete: function () {
        console.log('voiceManager upComplete')

        clearInterval(that.data.voiceRecordingTimer)
        that.setData({
          voiceRecording: false,
          voiceRecordingTimer: null,
          isShowRecordView: false,
          isRecording: false,
          time_counter: 0
        })
      }

    })


  },

  /**
   * 是否需要反馈变化
   */
  onChange: function (e) {
    this.setData({
      "feedBackChecked": !this.data.feedBackChecked
    })
  },

  /**
   * 用户点击选择图片按钮
   */
  chooseImage: function (e) {

    console.log("chooseImage222");

    var that = this;
    wxChooseImage()
      .then(function (res) {
        console.log("wxChooseImage suc");
        console.log(res);

        //数量限制
        // var tmpList = that.data.selectedImgsTmp.concat(res.tempFilePaths);
        // if (tmpList.length > 5) {
        //   wx.showToast({
        //     title: '最多5图片',
        //   })
        //   return
        // };

        res.tempFilePaths.forEach(function (tempFilePath) {
          uploadImage(tempFilePath)
            .then(function (res) {
              console.log(res);
              console.log(res.data.url);

              //追加图片，先看看之前有多少
              var newAlist = that.data.alist.concat("");
              var newAlistUrl = that.data.alistUrl.concat(res.data.url);
              var newAlistType = that.data.alistType.concat('img');
              var newAlistTempUrl = that.data.alistTempUrl.concat(tempFilePath);

              that.setData({
                alist: newAlist,
                alistUrl: newAlistUrl,
                alistType: newAlistType,
                alistTempUrl: newAlistTempUrl,
              })
            }, function (err) {
              console.log(err);
            })
        })



      }, function (err) {
        console.log("wxChooseImage fail");
        console.log(err);
      })

  },


  /**
   * 用户点击选择视频按钮
   */
  chooseVedio: function (e) {

    console.log("chooseVedio");

    var that = this;
    wxChooseVedio()
      .then(function (res) {

        console.log(res.tempFilePath);
        var tempFilePath = res.tempFilePath;

        //数量限制
        // var tmpList = that.data.selectedVideosTmp.concat(tempFilePath);
        // if (tmpList.length > 5) {
        //   wx.showToast({
        //     title: '最多5个视频',
        //   })
        //   return
        // };


        uploadFile(tempFilePath)
          .then(function (res) {

            console.log(res);
            console.log(res.data.url);
            //追加视频，先看看之前有多少
            var newAlist = that.data.alist.concat("");
            var newAlistUrl = that.data.alistUrl.concat(res.data.url);
            var newAlistType = that.data.alistType.concat('video');
            var newAlistTempUrl = that.data.alistTempUrl.concat(tempFilePath);

            that.setData({
              alist: newAlist,
              alistUrl: newAlistUrl,
              alistType: newAlistType,
              alistTempUrl: newAlistTempUrl,
            })


          }, function (err) {
            console.log(err);
          })

      }, function (err) {
        console.log("wxChooseVedio fail");
        console.log(err);
      })

  },

  /**
   * 选择录音出现van-popup
   */
  chooseVoice: function (e) {
    console.log(e)

    this.setData({
      "isShowRecordView": true
    })
  },

  /**
   * 关闭录音van-popup
   */
  closeRecordView: function (e) {
    console.log(e)


    this.setData({
      "isShowRecordView": false,
      "isRecording": false,
      "time_counter": 0,
      "buttonName": '开始录音'
    })
  },


  /**
   * 开始录音
   */
  startRecord: function () {

    if (this.data.isRecording) {
      console.log("startRecord");
    } else {
      console.log("stopRecord");
    }
    console.log(voiceManager);

    if (this.data.isRecording) {
      voiceManager.stopRecord()
      clearInterval(this.data.voiceRecordingTimer)
      this.setData({
        "buttonName": '开始录音',
        "isRecording": false,
        "time_counter": 0,
      })
    } else {
      voiceManager.startRecord()
      this.setData({
        "buttonName": '暂停录音',
      })
    }
  },


  /**
   * 结束录音
   */
  // endRecord: function () {

  //   console.log("endRecord");

  //   voiceManager.stopRecord()

  // },

  /**
  * 开始播放
  */
  startPlay: function (res) {
    console.log('start play');
    console.log(res);

    var url = res.currentTarget.dataset.src;
    if (!url) {
      console.log('url is null');
    }

    if (audioStatusPlay == 1) {
      this.stopPlay();
      console.log('stop audio')
      return;
    }

    audioStatusPlay = 1;
    console.log(url);
    voiceManager.startPlay(url)
    this.setData({
      aimage: '../../../image/stop.png'

    })
  },


  /**
  * 停止播放
  */
  stopPlay: function () {
    console.log('stop play');
    voiceManager.stopPlay();
    audioStatusPlay = 0;
    this.setData({
      aimage: '../../../image/play.png'

    })
  },

  /**
   * 发布通知
   */
  bindFormSubmit: function (e) {
    console.log('submit');
    var that = this;

    var content = e.detail.value.textarea;
    if (content <= 0) {
      wx.showToast({
        icon: 'none',
        title: '内容不能为空'
      })
      return
    }

    console.log(this.data.alist);
    console.log(this.data.alistUrl);
    console.log(this.data.alistType);
    console.log(this.data.alistTempUrl);

    console.log(this.data.coureIndex);
    console.log(this.data.classIndex);
    console.log(this.data.feedBackIndex);

    var coureId = this.data.coureNameList[this.data.coureIndex].id;
    var classId = this.data.classList[this.data.classIndex].id;
    var feedId = this.data.feedBackTypeList[this.data.feedBackIndex].id;

    console.log(coureId);
    console.log(classId);
    console.log(feedId);

    console.log(this.data.date);

    app.requestData({
      url: app.globalData.origin + 'homework/add',
      params: {
        uid: '10000',
        classId: classId,
        courseNameId:coureId,
        feedbackId:feedId,
        deadline: this.data.date,
        content: content,
        feedbackType: this.data.feedBackChecked,
        alistUrl: JSON.stringify(this.data.alistUrl),
      },
      type: 'get',
      sucBack(res) {
        console.log(res)
        if (res.code === 0) {
          wx.redirectTo({
            url: '../detail/index?id=' + res.data['id'],
          })
        }

        wx.showToast({
          icon: 'none',
          title: res.msg
        })

      },
      errBack(err) {
        wx.showModal({
          title: '请求失败',
          content: err,
          showCancel: false
        })
      }
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

  },



  //图片预览
  clickimg: function (e) {

    var currents = e.target.dataset.src;
    console.log(currents);
    wx.previewImage({
      current: currents,
      urls: [currents],
    })
  },
  //删除附件,要清空数组
  close: function (e) {
    var alist = this.data.alist;

    var index = e.currentTarget.dataset.id;

    // var bindex = 'alist['+e.currentTarget.dataset.id+"]";
    // this.setData({
    //     [bindex]: 'none'
    // })
    //清空数组
    this.data.alist.splice(index, 1);
    var newAlist = this.data.alist;
    this.data.alistUrl.splice(index, 1);
    var newAlistUrl = this.data.alistUrl;
    this.data.alistType.splice(index, 1);
    var newAlistType = this.data.alistType;
    this.data.alistTempUrl.splice(index, 1);
    var newAlistTempUrl = this.data.alistTempUrl;

    this.setData({
      alist: newAlist,
      alistUrl: newAlistUrl,
      alistType: newAlistType,
      alistTempUrl: newAlistTempUrl,
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  bindCourseNamePickerChange: function (e) {
    console.log('picker bindCourseNamePickerChange发送选择改变，携带值为', e.detail.value)
    this.setData({
      coureIndex: e.detail.value
    })
  },
  bindClassPickerChange: function (e) {
    console.log('picker bindClassPickerChange发送选择改变，携带值为', e.detail.value)
    this.setData({
      classIndex: e.detail.value
    })
  },
  bindFeedBackPickerChange: function (e) {
    console.log('picker bindFeedBackPickerChange发送选择改变，携带值为', e.detail.value)
    this.setData({
      feedBackIndex: e.detail.value
    })
  },
})