import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
import { onShareAppMessage } from '../../../utils/util'

const app = getApp()
var informid = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: '',
    replyList:'',
    atype:[],
    aurl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('inform detail options');
    console.log(options);

    informid = options.id;    
    //id = 52;
    var that = this;
    var uid = app.getUid();

    app.requestData({
      url: app.globalData.origin + 'inform/detail',
      params: {
        id: informid,
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        var atype = that.data.atype;
        var aurl  = that.data.aurl;
        if( res.data.images.length > 0){
          for (var i = 0; i < res.data.images.length; i++){
            atype = atype.concat("image");
            aurl  = aurl.concat(res.data.images[i])
          }
        }
        if (res.data.videos.length > 0) {
          for (var i = 0; i < res.data.videos.length; i++) {
            atype = atype.concat("video");
            aurl = aurl.concat(res.data.videos[i])
          }
        }
        if (res.data.voices.length > 0) {
          for (var i = 0; i < res.data.voices.length; i++) {
            atype = atype.concat("audio");
            aurl = aurl.concat(res.data.voices[i])
          }
        }
        console.log(atype)
        console.log(aurl)

        that.setData({
          "detail": res.data,
          "replyList": res.data.confirmLists,
          "aurl": aurl,
          "atype": atype,
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
    console.log('inform detail onShareAppMessage');

    let title = `班级助手`;;
    let path = '/pages/guide/index?type=inform&id='+informid;
    let shareCallBack = () => {
        console.log('share call back suc')
    };
    //此处调用封装好的分享代码
    return onShareAppMessage(title, path, shareCallBack);

  },

  onClickConfirm:function(e) {

    var aa = Dialog.confirm({
      title:'重要提示',
      message: '我已经阅读完通知内容'
    }).then(() => {
      // on confirm
      this.confirm(informid);
    }).catch(() => {
      // on cancel
    });

    console.log(aa)
  },
  
  clickimg:function(e){
    var currents = e.target.dataset.src;
    console.log(currents);
    wx.previewImage({
      current: currents,
      urls: [currents],
    })
  },

  clickvideo:function(e){
    var currents = e.target.dataset.src;
    wx.navigateTo({
      url: '../../playav/playav?url=' + currents + '&atype=video'
    })
  },

  clickaudio: function (e) {
    var currents = e.target.dataset.src;
    wx.navigateTo({
      url: '../../playav/playav?url=' + currents + '&atype=audio'
    })
  },

  confirm:function(id){
    console.log('confirm')
    // console.log(res)

    let informId = id;
    var that = this;
    var uid = app.getUid();

    app.requestData({
      url: app.globalData.origin + 'inform/confirm',
      params: {
        informId: informId,
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res)
        var datalist = that.data.replyList.concat(res.data)
        that.setData({
          "replyList": datalist,
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
  }
})