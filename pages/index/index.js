//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  createClass: function() {
    wx.navigateTo({
      url: '../class/create/index'
    })
  },
  onLoad: function () {

  }

})
