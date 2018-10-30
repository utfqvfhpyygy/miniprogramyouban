const weRequest = require('./request');

const app = getApp()

export function updateUserInfo(callback){
    console.log('updateUserInfo');

    wx.getUserInfo({
        success: (res) => {

          //console.log(res.userInfo)
          var openid = app.getOpenid();
          if(!openid){
              console.log('openid null')

              weRequest.login(function(){
                console.log('openid null so to login suc');
                openid = app.getOpenid();
                userLogin(openid,res,callback);
              })

          }else{
              userLogin(openid,res,callback);
          }
        },
        fail: (err) => {
          console.log('wx getUserInfo fail');
          console.log(err);
        }
    })
}

function userLogin(openid,res,callback){
    console.log('user/login start');
    console.log(openid);

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
        
        console.log('user/login suc');
        app.globalData.userInfo = data

        wx.setStorage({
          key: 'userInfo',
          data: data
        })

        //callback
        typeof callback === "function" && callback(data);

      },
      codeToSessionFail: function () {
        console.log('codeToSessionFail fail');
      },
      fail: function (obj, res) {
        console.log('user login fail');
        console.log(obj)
        console.log(res)

        typeof callback === "function" && callback()
      }
  })
}