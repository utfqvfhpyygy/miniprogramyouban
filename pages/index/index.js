import { login, updateUserInfoFromServer } from '../../utils/index'

const app = getApp()

Page({
  data: {
    uid: ''
  },

  onLoad:function(){

    console.log('onLoad')

    if (app.globalData && app.globalData.userInfo && app.globalData.userInfo.uid) {
      this._onLoad()
      updateUserInfoFromServer()
        .then(data => {
          app.globalData.userInfo = data
          this.setData({
            //TODO
          })
        })
    } else {
      login()
        .then(() => {
          this._onLoad()
        })
    }
  },

  _onLoad() {

    console.log('_onLoad')

    var that = this;
    this.setData({
      //TODO
    })

    //TODO

  },

  onShow() {
    console.log('onShow')

    if (app.globalData.userInfo) {
      this.setData({
        //TODO
      })
    }
  },

  //事件处理函数
  gotoCreateClass: function() {
    wx.navigateTo({
      url: '../class/create/index'
    })
  }

})
