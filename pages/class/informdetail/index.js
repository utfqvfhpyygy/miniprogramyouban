import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    replyList:'',
    atype:[],
    aurl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('onLoad')
    let id = options.id;    
    id = 50;
    var that = this;
    var uid = app.getUid();

    app.requestData({
      url: app.globalData.origin + 'inform/detail',
      params: {
        id: id,
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log('suc111')
        var atype = that.data.atype;
        var aurl  = that.data.aurl;
        if( res.data.images.length > 0){
          for (var i = 0; i < res.data.images.length; i++){
            atype = atype.concat("image");
            aurl  = aurl.concat(res.data.images[i])
          }
        }
        if (res.data.videos.length > 0) {
          for (var i = 0; i < res.data.videos.length; i++) {
            atype = atype.concat("video");
            aurl = aurl.concat(res.data.videos[i])
          }
        }
        if (res.data.voices.length > 0) {
          for (var i = 0; i < res.data.voices.length; i++) {
            atype = atype.concat("audio");
            aurl = aurl.concat(res.data.voices[i])
          }
        }
        console.log(atype)
        console.log(aurl)

        that.setData({
          "detail": res.data,
          "replyList": res.data.confirmLists,
          "aurl": aurl,
          "atype": atype,
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

  onClickConfirm:function(e) {
    console.log(123123)

    var aa = Dialog.confirm({
      title:'重要提示',
      message: '我已经阅读完通知内容'
    }).then({
      
    }).catch({
      
    });

    console.log(aa)
  },
  
  clickimg:function(e){
    var currents = e.target.dataset.src;
    console.log(currents);
    wx.previewImage({
      current: currents,
      urls: [currents],
    })
  },

  clickvideo:function(e){
    var currents = e.target.dataset.src;
    wx.navigateTo({
      url: '../../playav/playav?url=' + currents + '&atype=video'
    })
  },

  clickaudio: function (e) {
    var currents = e.target.dataset.src;
    wx.navigateTo({
      url: '../../playav/playav?url=' + currents + '&atype=audio'
    })
  },

  confirm:function(res){
    console.log('confirm')
    console.log(res)

    let id = 41;
    var that = this;
    var uid = app.getUid();

    app.requestData({
      url: app.globalData.origin + 'inform/confirm',
      params: {
        informId: informId,
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'post',
      sucBack: function (res) {
        console.log('suc111')
        console.log(res)
        that.setData({
          "detail": res.data,
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
  }
})