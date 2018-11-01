// pages/class/teacherjoin/index.js
var classId = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex:0,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      classId = options.id;
      var userTypeId = this.data.userType[this.data.selectIndex].id;

      var uid = app.getUid();
      var that = this;
  
      app.requestData({
        url: app.globalData.origin + 'class/getClass',
        params: {
          deviceUid: uid,
          classId: classId,
          userTypeId: userTypeId,
          platform: app.globalData.platform
        },
        type: 'get',
        sucBack: function (res) {
          console.log(res);
  
          that.setData({
            "class": res.data.class,
            "userType": res.data.userType,
          })
        },
        errBack: function (msg) {
          console.log('fail111')
          wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
          })
        }
      })

  },

  bindPickerChange: function (e) {
    console.log('picker bindPickerChange发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectIndex: e.detail.value
    })
  },

  confirmJoin: function(e){

    var username = e.detail.value.username;

    var that = this;
    var uid = app.getUid();
    app.requestData({
      url: app.globalData.origin + 'class/addTeacher',
      params: {
        deviceUid: uid,
        username: username,
        classId: classId,
      },
      type: 'get',
      sucBack(res) {
        console.log(res)
        if (res.code === 0) {
          wx.redirectTo({
            url: '../index/index?id='+classId,
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