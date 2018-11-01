// pages/class/searchclass/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      classList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  bindFormSubmit: function(e) {  

    var name = e.detail.value.name;
    if (name <= 0) {
      wx.showToast({
        icon: 'none',
        title: '名称不能为空'
      })
      return
    }

    var formid = e.detail.value.formid;

    app.requestData({
      url: app.globalData.origin + 'class/search',
      params: {
        deviceUid: app.getUid(),
        name:name,
        formid:formid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res)

        that.setData({
          classList:res.data.list, 
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