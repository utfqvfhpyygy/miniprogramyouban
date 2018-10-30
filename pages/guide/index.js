import { updateUserInfo } from '../../utils/user';
const app = getApp()

/**
 * 用户进入app的入口场景
 *  1）新用户从邀请老师的链接进入,用户身份为老师，会跳转到创建班级页面
 *  2）新用户从其它老师分享的链接进入（班级设置的分享）,用户身份为老师，会跳转到确认加入指定的班级页面
 *  3）新用户从微信等群分享作业的链接进入,用户身份为家长，会跳转到填写信息页面
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('guide options');
    console.log(options);

    this.checkUserInfo(options);
  },


  bindGetUserInfo(e) {

    var that = this;
    if (e.detail.userInfo != undefined){
        updateUserInfo(function(res){
          res ? that.initGoPage(res) : '';
        })
    }
    
  },

  /**
   * 
   */
  checkUserInfo: function (options) {
      var userInfo = app.getLoginUserInfo()
      const that = this;
 
      if(!userInfo || !userInfo.username){
        wx.getSetting({
          success(res) {
            // 已经授权
            if (res.authSetting['scope.userInfo']) {
                updateUserInfo(function(res){
                  res ? that.initGoPage(res) : '';
                })
            }
          }
        })

        this.setData({
            show:true
        })
        return;
      }

      this.initGoPage(userInfo);
      
  },

  initGoPage: function (userInfo){

    console.log('initGoPage');
    console.log(userInfo);
    console.log(app.globalData);

    //如果之前有设置身份，则跳转到对应页面
    if (userInfo.type > 0) {
        this.switchGotoPage(app.globalData.shareType,app.globalData.shareId);

    //如果老师之前没有设置身份
    } else if(app.globalData.shareRose == 'teacher') {
      
      //从其它老师分享的链接进来，url有带上具体的班级，跳转到确认加入这个班班页面
      if(app.globalData.shareId > 0){
          wx.redirectTo({
            url: '../index/index'
          })

      //从分享进来的老师，跳转到创建班级的页面
      }else{
          wx.redirectTo({
            url: '../class/create/index'
          })
      }

    //如果家长之前没有设置身份  
    } else {

      //家长首次进来，跳转到填写信息页面
      wx.redirectTo({
        url: '../index/index'
      })

    }


    //异步更新用户信息
    let nowTime = parseInt(Date.now()/1000);

    if(nowTime - userInfo.update > 60){
      updateUserInfo(function(res){
        console.log('update userinfo');
      })
    }

  },


  /**
   * 
   * @param {*} shareType 
   * @param {*} shareId 
   */
  switchGotoPage(shareType,shareId) {
     
      var url = '../class/index/index';

      switch(shareType){
        case 'homework':
            url = '../homework/detail/index?id='+shareId;
            break;
        case 'inform':
            url = '../inform/detail/index?id='+shareId;
            break;
        default:
            url = '../class/index/index?id='+shareId;
            break; 
      }

      wx.redirectTo({
        url:url
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

  }

})