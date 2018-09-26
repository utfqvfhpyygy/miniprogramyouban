const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonType: ['default', 'default', 'default', 'default', 'default', 'default', 'default', 'default', 'default'],
    buttonName: ['幼小班', '幼中班', '幼大班', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    buttonId:[-3,-2,-1,1,2,3,4,5,6],
    showmore:6,
    moreButton:false,
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

  chooseGrade(e){
    
    for (var i = 0; i < this.data.buttonId.length;i++){
      var bindex = "buttonType[" + i + "]";
      if (e.target.id == this.data.buttonId[i]){
        this.setData({
          [bindex]: 'warning'
        })
      }else{
        this.setData({
          [bindex]: 'default'
        })
      }
    }
    console.log(this.data.buttonType)
  },

  showMore(e){
    this.setData({
      "showmore":"9",
      "moreButton":true,
    })

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