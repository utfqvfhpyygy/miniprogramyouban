import { onShareAppMessage } from '../../../utils/util'

const app = getApp()
var classId = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      informList:[],
      homeworkList:[],
      needRefresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      console.log('onLoad')
      var that = this;
      
      var userInfo = app.getLoginUserInfo();

      if(userInfo){
        this.setData({
          userInfo: userInfo
        })
      }

      //加载列表
      this.loadData();

  },

  loadData: function(){

    var uid = app.getUid();
    var that = this;

    app.requestData({
      url: app.globalData.origin + 'class/index',
      params: {
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        that.setData({
          "informList": res.data.informList,
          "homeworkList": res.data.homeworkList,
        })
        classId = res.data.classId;
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

  gotoInformDetail: function(e){
    let id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        url: '../../inform/detail/index?id='+id,
      })
    }
  },

  gotoHomeworkDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: '../../homework/detail/index?id=' + id,
      })
    }
  },

  gotoInform:function(e){
    wx.navigateTo({
      url: '../../inform/create/index?id='+classId,
    })
  },

  gotoSetting: function (e) {
    wx.navigateTo({
      url: '../../setting/index/index'
    })
  },

  gotoMore:function(e){
    wx.navigateTo({
      url: '../../more/more'
    })
  },

  gotoWork:function(e){
    wx.navigateTo({
      url: '../../homework/create/index?id='+classId,
    })   
  },

  gotoMyclass: function (e) {
    wx.navigateTo({
      url: '../myclass/index'
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

    if(this.data.needRefresh){
        this.data.needRefresh = false;
        this.loadData();
    }
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
    console.log('class index onShareAppMessage');

    let title = `班级助手`;;
    let path = '/pages/guide/index?type=class&id='+classId;
    let shareCallBack = () => {
        console.log('share call back suc')
    };

    //此处调用封装好的分享代码
    return onShareAppMessage(title, path, shareCallBack);
  }
})