const weRequest = require('./request');

const app = getApp()

export function updateUserInfo(callback){
    wx.getUserInfo({
        success: function (res) {

          //console.log(res.userInfo)
          const openid = wx.getStorageSync('session')

          //console.log(openid)

          weRequest.request({
              url: 'user/login',
              data: {
                openid: openid,
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                gender: res.userInfo.gender,
                country: res.userInfo.country,
                province: res.userInfo.province
              },
              showLoading: true,
              success: function (data) {
                //console.log(data);
                app.globalData.userInfo = data

                wx.setStorage({
                  key: 'userInfo',
                  data: data
                })

                //callback
                typeof callback === "function" && callback(data);

              },
              codeToSessionFail: function () {

              },
              fail: function (obj, res) {
                console.log('user login fail');
                console.log(obj)
                console.log(res)

                typeof callback === "function" && callback()
              }
          })

        }
    })
}