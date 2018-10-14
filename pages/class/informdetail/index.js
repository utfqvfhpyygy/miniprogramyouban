import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('onLoad')
    let id = options.id;    
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

  onClickAlert2:function(e) {
    console.log(123123)
    Dialog.confirm({
      title:'重要提示',
      message: '我已经阅读完通知内容'
    });
  },
  
  clickimg:function(e){
    wx.previewImage({
      urls: ['http://39.104.82.18/inform/55/10000/1538231717.png'],
    })
  }
})