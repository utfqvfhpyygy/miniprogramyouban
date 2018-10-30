const weRequest = require('./utils/request');

App({
  onLaunch: function (res) {

    console.log('app onLaunch')
    console.log(res)

    wx.onNetworkStatusChange(function(res) {
      // console.log("网络状态："+res.isConnected);
      if(!res.isConnected) {
        wx.showToast({
          icon: 'none',
          title: '网络连接已断开，请稍后重试'
        })
      }
    })

    

    weRequest.login(function(){
      console.log(111);
    })
  },

  onShow: function(options) {
    // Do something when show.
    console.log('app onShow')
    console.log(options)
  },
  onHide: function() {
    // Do something when hide.
    console.log('小程序进入后台')
  },
  onError: function(msg) {
    console.log(msg)
  },
  globalData: {
    host: 'https://www.91youban.com/',
    origin: 'https://www.91youban.com/index.php?r=miniprogram/', 
    platform: '2',
    userInfo: null, // 当前登录的用户信息
    wxUserInfo: null // 当前微信用户信息（需要授权获取）
  },

  getUid: function(){

    if (this.globalData.userInfo && this.globalData.userInfo.uid){
        return this.globalData.userInfo.uid;
    }

    var userInfo = wx.getStorageSync('userInfo');
    if(userInfo && userInfo.uid){
        return userInfo.uid;
    }

  },

  getOpenid: function () {

    var openid = wx.getStorageSync('session');
    if (openid) {
      return openid;
    }

    if (this.globalData.userInfo && this.globalData.userInfo.openid) {
      return this.globalData.userInfo.openid;
    }

    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.openid) {
      return userInfo.openid;
    }


  },

  getLoginUserInfo: function () {

    if (this.globalData.userInfo && this.globalData.userInfo) {
      return this.globalData.userInfo;
    }

    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      return userInfo;
    }

  },

  /**
   * 请求网络公共方法
   * option {object} option具体内容如下
   * @param url    请求地址
   * @param params 请求参数
   * @param type   请求类型 (默认"get")
   * @param sucBack  成功回调
   * @param errBack  失败回调
   */
  requestData: function (option) {

    var requestBody = {
      url: option.url,
      data: option.params,
      dataType: 'json',
      method: option.type || 'get',
      success: function (data) {

        if(data.data.code == 0) {
          option.sucBack && option.sucBack(data.data);
        } else {
          option.errBack && option.errBack(data.data.msg);
        }
      },
      error: function (xhr, type, status)  {
        // console.log(type);

        console.log('requestDataFail111')

        option.errBack && option.errBack(type);
      }
    }
    if(option.type == 'post' || option.type == 'POST') {
      requestBody.header = {
        'content-type': 'applicaton/x-www-form-urlencoded',
        'H-Sys-Type': 'wechat',
        'H-app-Type': 'wechat',
        'H-Version': '',
      }
    }
    wx.request(requestBody)
  },
  time2str: function (timestamp) { // 时间戳转成日期格式（如2018-03-07 10:16）
    var date = new Date(parseInt(timestamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+ ' ';
    var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + '';
    return Y+M+D+h+m;
  }
})