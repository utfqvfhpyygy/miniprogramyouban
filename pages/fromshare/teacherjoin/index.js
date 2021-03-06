var classId = 0;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex:0,
    selectRole:''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      classId = options.id;

      var uid = app.getUid();
      var that = this;
  
      app.requestData({
        url: app.globalData.origin + 'class/getClass',
        params: {
          deviceUid: uid,
          classId: classId,
          platform: app.globalData.platform
        },
        type: 'get',
        sucBack: function (res) {
          console.log(res);
  
          that.setData({
            "class": res.data.class,
            "userType": res.data.userType,
            "selectRole": res.data.userType[0].name
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
    var selectIndex = e.detail.value;
    var selectRole = this.data.userType[selectIndex].name;

    this.setData({
      selectIndex: selectIndex,
      selectRole, selectRole
    })
  },

  bindFormSubmit: function(e){

    console.log(e)

    var username = e.detail.value.username;

    var that = this;
    var uid = app.getUid();
    var userTypeId = this.data.userType[this.data.selectIndex].id;

    app.requestData({
      url: app.globalData.origin + 'class/addTeacher',
      params: {
        deviceUid: uid,
        userTypeId: userTypeId,
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