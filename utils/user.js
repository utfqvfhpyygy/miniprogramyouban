const weRequest = require('./request');

const app = getApp()

export function updateUserInfo(callback){
    console.log('updateUserInfo');

    var openid = app.getOpenid();
    

    wx.getUserInfo({
        success: (res) => {

          //如果本地登陆信息为空，则重新登陆,再更新用户信息
          if(!openid){
              console.log('openid null')

              weRequest.login(function(){
                console.log('openid null so to login suc');
                openid = app.getOpenid();
                userLogin(openid,res.userInfo,callback);
              })

          }else{
              userLogin(openid,res.userInfo,callback);
          }
        },
        fail: (err) => {
          console.log('wx getUserInfo fail');
          console.log(err);

          //如果微信授权失败，则判断如果本地有登陆信息，再请求更新用户信息到本地
          var userInfo = app.getLoginUserInfo();
          openid && userInfo && userLogin(openid,userInfo,callback); 
        }
    })
}

function userLogin(openid,userInfo,callback){
    console.log('user/login start');
    console.log(openid);

    weRequest.request({
      url: 'user/login',
      data: {
        openid: openid,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,
        country: userInfo.country,
        province: userInfo.province
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