//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    gradeLists:'[{"id":"1","name":"\u5c0f\u5b66\u4e00\u5e74\u7ea7"},{"id":"2","name":"\u5c0f\u5b66\u4e8c\u5e74\u7ea7"},{"id":"3","name":"\u5c0f\u5b66\u4e09\u5e74\u7ea7"},{"id":"4","name":"\u5c0f\u5b66\u56db\u5e74\u7ea7"},{"id":"5","name":"\u5c0f\u5b66\u4e94\u5e74\u7ea7"},{"id":"6","name":"\u5c0f\u5b66\u516d\u5e74\u7ea7"},{"id":"7","name":"\u5e7c\u513f\u56ed\u5c0f\u73ed"},{"id":"8","name":"\u5e7c\u513f\u56ed\u4e2d\u73ed"},{"id":"9","name":"\u5e7c\u513f\u56ed\u5927\u73ed"}]'
  }
})