import { wxChooseImage, wxChooseVedio, uploadImage, uploadFile} from '../../../utils/upload'
var voiceManager = require('../../../utils/voiceManager');

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

    selectedImgsTmp: [],       //选中的图片
    selectedRecordsTmp: [],   //选中的录音
    selectedVideosTmp: [],    //选中的视频

    selectedImgsUrl: [],  //选中的图片
    selectedRecordsUrl: [],   //选中的录音
    selectedVideosUrl: [],    //选中的视频
    /*
    暂定9个附件，用a1-a9,使用后就标记true,没有使用就是false
    */
    alist: [],
    alistType: [],
    alistUrl: []
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const that = this

    voiceManager.init({
      
      upStart:function(){
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

      upStop:function(res){
          console.log('voiceManager upStop')
          console.log(res)

          clearInterval(that.data.voiceRecordingTimer)
          that.setData({
            voiceRecording: false,
            voiceRecordingTimer: null
          })

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
          var tmpList = that.data.selectedVideosTmp.concat(tempFilePath);
          if (tmpList.length > 5) {
            wx.showToast({
              title: '最多5个音频',
            })
            return
          };

          // //上传
          uploadFile(tempFilePath)
          .then(function (res) {

            console.log(res);
            console.log(res.data.url);
            var tempList = that.data.selectedRecordsTmp.concat(tempFilePath);
            var urlList = that.data.selectedRecordsUrl.concat(res.data.url);
            that.setData({
              selectedRecordsTmp: tempList,
              selectedRecordsUrl: urlList
            })
          }, function (err) {
            console.log(err);
          })

          uploadFile(tempFilePath)
            .then(function (res) {
              console.log("uploadVoice suc");
              console.log(res);
            }, function (err) {
              console.log("uploadVoice fail");
              console.log(err);
            })
      },

      upError:function(err){
        console.log('voiceManager upError')
        console.log(err)

        clearInterval(that.data.voiceRecordingTimer)
        that.setData({
          isRecording: false,
          time_counter: 0
        })
      }

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

    console.log("chooseImage222");

    var that = this;
    wxChooseImage()
    .then(function(res){
      console.log("wxChooseImage suc");
      console.log(res);

      //数量限制
      var tmpList = that.data.selectedImgsTmp.concat(res.tempFilePaths);
      if (tmpList.length > 5) {
        wx.showToast({
          title: '最多5图片',
        })
        return
      };

      res.tempFilePaths.forEach(function (tempFilePath){
        uploadImage(tempFilePath)
        .then(function(res){
          console.log(res);
          console.log(res.data.url);

          //追加图片，先看看之前有多少
          var newAlist = that.data.alist.concat("");
          var newAlistUrl = that.data.alistUrl.concat(res.data.url);
          var newAlistType = that.data.alistType.concat('img');

          that.setData({
            alist: newAlist,
            alistUrl: newAlistUrl,
            alistType: newAlistType,
          })
        },function(err){
            console.log(err);
        })
      })

      

    },function(err){
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
      var tmpList = that.data.selectedVideosTmp.concat(tempFilePath);
      if (tmpList.length > 5) {
        wx.showToast({
          title: '最多5个视频',
        })
        return
      };

      
      uploadFile(tempFilePath)
        .then(function (res) {

          console.log(res);
          console.log(res.data.url);
          //追加视频，先看看之前有多少
          var newAlist = that.data.alist.concat("");
          var newAlistUrl = that.data.alistUrl.concat(res.data.url);
          var newAlistType = that.data.alistType.concat('video');

          that.setData({
            alist: newAlist,
            alistUrl: newAlistUrl,
            alistType: newAlistType,
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
    console.log(voiceManager);
    
    voiceManager.startRecord()
   
  },


  /**
   * 结束录音
   */
  endRecord: function () {

    console.log("endRecord");

    voiceManager.stopRecord()

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
      return
    }

    console.log(this.data.selectedImgsTmp);
    console.log(this.data.selectedImgsUrl);

    var that = this;
    app.requestData({
      url: app.globalData.origin + 'inform/add',
      params: {
        uid: '10000',
        classId: 123,
        content: this.data.content,
        feedbackType:this.data.feedBackChecked,
        selectedImgs:this.data.selectedImgsUrl,
        selectedRecords:this.data.selectedRecordsUrl,
        selectedVideos:this.data.selectedVideosUrl
      },
      type: 'get',
      sucBack(res) {
        console.log(res)
        if (res.code === 0) {
          that.setData({
            content:''
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
  //删除附件
  close:function(e){
    var alist = this.data.alist;

    var bindex = 'alist['+e.currentTarget.dataset.id+"]";
    bindex
    console.log(bindex);
      this.setData({
        [bindex]: 'none'
      })
  }
})