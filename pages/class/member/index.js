// pages/class/member/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      editBtnText:'编辑模式',
      isEditing:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);

    var uid = app.getUid();
    var that = this;
    var classId = 3;

    app.requestData({
      url: app.globalData.origin + 'class/member',
      params: {
        deviceUid: uid,
        classId: classId,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res);

        that.setData({
          "teacher": res.data.teacher,
          "member": res.data.member,
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


  changeEdit: function(e){

    console.log(e);
    this.setData({
      editBtnText: this.data.isEditing ? '编辑模式' : '退出编辑',
      isEditing : !this.data.isEditing,
     
    })

  },

  delMember: function (e) {

    console.log(e);

    var uid = app.getUid();
    var that = this;
    let classId = e.currentTarget.dataset.classid;
    let changeUid = e.currentTarget.dataset.changeuid;
    let idx = e.currentTarget.dataset.idx;

    app.requestData({
      url: app.globalData.origin + 'class/delMember',
      params: {
        deviceUid: uid,
        classId: classId,
        changeUid: changeUid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res);

        let member = that.data.member;

        let delIndex = member.findIndex((element, index, array) => {
          console.log(element)
          console.log(changeUid)
          console.log(index)
          if (element.uid == changeUid) {
            return index;
          } else {
            return false;
          }
        });

        member.splice(delIndex,1);

        that.setData({
          member:member
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