import {miniUploadImage,miniUploadVedio,miniRecordManager} from '../../../model/attachment.js'

const app = getApp()

var audioStatusPlay = 0;
var classId = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    miniRecordManager:{},

    coureNameList:[],
    coureIndex: 0,
    classList:[],
    classIndex:0,
    feedBackTypeList:[],
    feedBackIndex: 0,
    loading: false,

    feedBackChecked: false,   //是否需要反馈
    content: '',   //通知内容
    isShowRecordView: false,  //是否显示录音界面
    isRecording: false,  //是否正在录音中
    voiceRecordingTimer: null,  //录音计时器
    time_counter: 0,  //录音计时

    /*
    暂定9个附件，用a1-a9,使用后就标记true,没有使用就是false
    */
    alist: [],
    alistType: [],
    alistUrl: [],
    alistTempUrl: [],
    buttonName: '开始录音',
    aimage: '../../../image/play.png',

    date:''
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('onLoad')
    const that = this
    var uid = app.getUid();
    classId = options.id;

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

    this.data.miniRecordManager && this.data.miniRecordManager.startRecord()

  },



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
   * 是否需要反馈变化
   */
  onChange: function (e) {
    this.setData({
      "feedBackChecked": !this.data.feedBackChecked
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

    var uid = app.getUid();

    app.requestData({
      url: app.globalData.origin + 'homework/add',
      params: {
        deviceUid: uid,
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