
const app = getApp()

Page({
  data: {
    location
  },

  onLoad:function(){

    console.log('onLoad')
  },

  _onLoad() {

    console.log('_onLoad')

    //checkLocation()
    
    var that = this;

  },

  onShow() {
    console.log('onShow')

  },

  checkLocation: function () {

    console.log("checkLocation");

    var that = this;

    wx.getSetting({
      success: function (t) {
        t.authSetting["scope.userLocation"] ? that.recordStart() : wx.authorize({
          scope: "scope.userLocation",
          success: function () {
            console.log("获取授权成功"), that.recordStart();
          },
          fail: function () {
   
          }
        });
      }
    });
  },

  getLocation: function(){

      console.log("getLocation");
      var that = this;

      wx.getLocation({
        success: function (res) {
          console.log(res)

          that.setData({
            location: {
              longitude: res.longitude,  
              latitude: res.latitude
            }
          })

        }
    })
  },


  //事件处理函数
  gotoCreateClass: function() {
    wx.navigateTo({
      url: '../class/create/index'
    })
  }

})
