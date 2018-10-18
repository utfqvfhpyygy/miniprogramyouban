import { updateUserInfo } from '../../utils/user';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      show:false,
      fromType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkUserInfo(options);
  },


  bindGetUserInfo(e) {

    var that = this;
    if (e.detail.userInfo != undefined){
        updateUserInfo(function(res){
          res ? that.initGoPage(res, that.data.fromType) : '';
        })
    }
    
  },

  /**
   * fromType = 1 邀请老师
   * fromType = 2 邀请家长
   */
  checkUserInfo: function (options) {
      var fromType = options.fromType ? options.fromType : 1;  
      var userInfo = app.getLoginUserInfo()
      const that = this;
 
      if(!userInfo){
        wx.getSetting({
          success(res) {
            // 已经授权
            if (res.authSetting['scope.userInfo']) {
                updateUserInfo(function(res){
                  res ? that.initGoPage(res,fromType) : '';
                })
            }
          }
        })

        this.setData({
            show:true
        })
        return;
      }

      this.initGoPage(userInfo,fromType);
      
  },

  initGoPage: function (userInfo, fromType){

    //如果之前有设置身份，则跳转到班级首页
    if (userInfo.type > 0) {
      //console.log('initGoPage type > 0');
      wx.redirectTo({
        url: '../class/index/index'
      })
    }

    //如果之前没有设置身份
    if (fromType == 1) {
      //console.log('fromType type = 1');
      wx.redirectTo({
        url: '../index/index'
      })
    } else if (fromType == 2) {

    }

    //异步更新用户信息
    let nowTime = parseInt(Date.now()/1000);

    console.log('initGoPage')
    console.log(nowTime)
    console.log(userInfo.update)
    console.log(nowTime - userInfo.update > 60)

    if(nowTime - userInfo.update > 60){
      console.log('start update user info')
      updateUserInfo(function(res){
        console.log('update userinfo');
      })
    }

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