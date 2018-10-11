import { updateUserInfo } from '../../utils/user';


Page({

  /**
   * 页面的初始数据
   */
  data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.getSetting({
        success(res) {

          // 已经授权
          if (res.authSetting['scope.userInfo']) {
              wx.navigateTo({
                url: '../index/index'
              })
              updateUserInfo()
          }

        }
      })
  },


  bindGetUserInfo(e) {

    if (e.detail.userInfo != undefined){
        wx.navigateTo({
          url: '../index/index'
        })

        updateUserInfo()
    }
    
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