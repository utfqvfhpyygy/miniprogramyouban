import { MiniChooseImage, MiniChooseVedio } from '../../../utils/upload'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedBackChecked:false,   //是否需要反馈
    content:'',   //通知内容
    isShowRecordView: false,  //是否显示录音界面
    isRecording:false,  //是否正在录音中
    voiceRecordingTimer: null,  //录音计时器
    time_counter:0,  //录音计时

    selectedImgsTmp: [],  //选中的图片
    selectedRecordsTmp: [],   //选中的录音
    selectedVideosTmp: [],    //选中的视频

    selectedImgsUrl: [],  //选中的图片
    selectedRecordsUrl: [],   //选中的录音
    selectedVideosUrl: []    //选中的视频
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
   * 获取通知内容
   */
  bindTextAreaBlur: function(e) {
    this.setData({
      content:e.detail.value
    }) 
  },   

  /**
   * 用户点击选择图片按钮
   */
  chooseImage: function (e) {

    console.log("chooseImage");

    MiniChooseImage()
    .then(function(res){
      console.log("chooseImage suc");
      console.log(res);
    },function(err){
      console.log("chooseImage fail");
      console.log(err);
    })
    
  },


  /**
   * 用户点击选择视频按钮
   */
  chooseVedio: function (e) {

    console.log("chooseVedio");

    MiniChooseVedio()
    .then(function(res){
      console.log("chooseVedio suc");
      console.log(res);
    },function(err){
      console.log("chooseVedio fail");
      console.log(err);
    })

   
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
   * 开始录音
   */
  startRecord: function () {

    console.log("startRecord");
    console.log(recorderManager);

    var that = this;

    wxCheckRecordAuth()
    .then(function(data){

    },function(err){

    })

  },


  /**
   * 结束录音
   */
  endRecord: function () {

    console.log("endRecord");

    recorderManager.stop()
  },

  /**
   * 发布通知
   */
  submit: function(){
    console.log('submit');

    if(this.data.content.length <= 0){
      wx.showToast({
        icon: 'none',
        title: '内容不能为空'
      })
    }

    app.requestData({
      url: app.globalData.origin + 'inform/add',
      params: {
        uid: '10000',
        classId: 123,
        title: this.data.content,
        feedbackType:this.data.feedBackChecked,
        selectedImgs:this.data.selectedImgsUrl,
        selectedRecords:this.data.selectedRecordsUrl,
        selectedVideos:this.data.selectedVideosUrl
      },
      type: 'get',
      sucBack(res) {
        if (res.code === 0) {
          
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

      //上传
      uploadVoice(res)
      .then(function(res){
        console.log("uploadVoice suc");
        console.log(res);
      },function(err){
        console.log("uploadVoice fail");
        console.log(err);
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
  }


})