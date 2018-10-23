const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      informList:[],
      homeworkList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      console.log('onLoad')
      var that = this;
      var uid = app.getUid();
      var userInfo = app.getLoginUserInfo();

      if(userInfo){
        this.setData({
          userInfo: userInfo
        })
      }


      app.requestData({
        url: app.globalData.origin + 'class/index',
        params: {
          deviceUid: uid,
          platform: app.globalData.platform
        },
        type: 'get',
        sucBack: function (res) {
          that.setData({
            "informList": res.data.informList,
            "homeworkList": res.data.homeworkList,
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

  gotoDetail: function(e){
    let id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        url: '../informdetail/index?id='+id,
      })
    }
  },
  gotoInform:function(e){
    wx.navigateTo({
      url: '../inform/index'
    })
  },

  gotoWork:function(e){
    wx.navigateTo({
      url: '../../homework/create/index'
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