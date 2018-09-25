//app.js
App({
  onLaunch: function () {
      wx.onNetworkStatusChange(function(res) {
      // console.log("网络状态："+res.isConnected);
      if(!res.isConnected) {
        wx.showToast({
          icon: 'none',
          title: '网络连接已断开，请稍后重试'
        })
      }
    })

    console.log('小程序初始化完成')
  },

  onShow: function(options) {
    // Do something when show.
    console.log('小程序进入前台')
  },
  onHide: function() {
    // Do something when hide.
    console.log('小程序进入后台')
  },
  onError: function(msg) {
    console.log(msg)
  },
  globalData: {
    host: 'http://39.104.82.18/',
    origin: 'http://39.104.82.18/index.php?r=miniprogram/', 
    platform: '2',
    userInfo: null, // 当前登录的用户信息
    wxUserInfo: null, // 当前微信用户信息（需要授权获取）
    gradeLists:'[{"id":"1","name":"\u5c0f\u5b66\u4e00\u5e74\u7ea7"},{"id":"2","name":"\u5c0f\u5b66\u4e8c\u5e74\u7ea7"},{"id":"3","name":"\u5c0f\u5b66\u4e09\u5e74\u7ea7"},{"id":"4","name":"\u5c0f\u5b66\u56db\u5e74\u7ea7"},{"id":"5","name":"\u5c0f\u5b66\u4e94\u5e74\u7ea7"},{"id":"6","name":"\u5c0f\u5b66\u516d\u5e74\u7ea7"},{"id":"7","name":"\u5e7c\u513f\u56ed\u5c0f\u73ed"},{"id":"8","name":"\u5e7c\u513f\u56ed\u4e2d\u73ed"},{"id":"9","name":"\u5e7c\u513f\u56ed\u5927\u73ed"}]'
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
        } else if (data.data.code == 1000) {
          option.errBack && option.errBack(data.data.msg);
        }
      },
      error: function (xhr, type, status)  {
        // console.log(type);
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