// pages/class/memberjoin/index.js
const app = getApp()
var classId = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleType:1
  },

  /**
   * 选择角色
   */
  changeRoleType:function(e){
      let roleType = e.currentTarget.dataset.roletype;
      this.setData({
        roleType:roleType
      })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      classId = options.id;
  },

  /**
   * 提交 
   */
  bindFormSubmit: function(e){
    console.log('submit');
    console.log(e)

    var username = e.detail.value.username;
    if (username <= 0) {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空'
      })
      return
    }

    var that = this;
    var uid = app.getUid();
    app.requestData({
      url: app.globalData.origin + 'class/addMember',
      params: {
        deviceUid: uid,
        changeUid: uid,
        classId: classId,
        username: username,
        roleType: that.data.roleType,
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