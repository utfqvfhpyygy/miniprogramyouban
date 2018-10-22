// pages/setting/index/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = app.getLoginUserInfo()
    this.setData({
      userInfo
    })
  },

  /**
   * 更新设置
   */
  bindFormSubmit: function (e) {
    console.log('submit');

    var username = e.detail.value.username;
    if (username <= 0) {
      wx.showToast({
        icon: 'none',
        title: '昵称不能为空'
      })
      return
    }

    var mobile = e.detail.value.mobile;


    console.log(username);
    console.log(mobile);

    var uid = app.getUid();

    var that = this;
    app.requestData({
      url: app.globalData.origin + 'setting/updateUserInfo',
      params: {
        deviceUid: uid,
        username: username,
        mobile: mobile,
      },
      type: 'get',
      sucBack(res) {
        console.log(res)
        if (res.code === 0) {
          app.globalData.userInfo = res.data;
          wx.setStorage({
            key: 'userInfo',
            data: res.data
          })
          that.setData({
            userInfo:res.data
          })

          wx.navigateBack({
            delta: 1
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

  }
})