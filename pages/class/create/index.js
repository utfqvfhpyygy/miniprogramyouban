const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSelGrade:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('onLoad')
    var that = this;

    app.requestData({
      url: app.globalData.origin + 'class/configList',
      params: {
        deviceUid: app.globalData.userInfo.uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log('suc111')
        console.log(res)
        that.setData({
           "gradeList": res.data.gradeList,
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


  toggleGradeSheet() {
    this.setData({
       showSelGrade : !this.showSelGrade
    });
  },

  cancel() {
    this.setData({
      showSelGrade: false
    });
  },

  confirmGrade(e){
    console.log('confirmGrade')
    console.log(e)
  },

  changeGrade(e){
    console.log('changeGrade')
    console.log(e)
  },

  chooseGrade(e){
    console.log(e) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
  }
})