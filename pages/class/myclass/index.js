// pages/class/myclass/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var uid = app.getUid();
    var that = this;

    app.requestData({
      url: app.globalData.origin + 'class/myClass',
      params: {
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res);

        that.setData({
          "list": res.data.list,
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


  gotoTimetable:function(e){
    console.log(e)
    
    let id = e.currentTarget.dataset.id;
    if(!id){
      console.log('id error');
      return;
    }

    wx.navigateTo({
      url: '../timetable/index?id='+id,
    })

  },

  gotoMember: function (e) {
    console.log(e)

    let classId = e.currentTarget.dataset.id;
    if (!classId) {
      console.log('id error');
      return;
    }

    wx.navigateTo({
      url: '../member/index?id=' + classId,
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