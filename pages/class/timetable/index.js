const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
      changeCourse:{}
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
      url: app.globalData.origin + 'class/timetableList',
      params: {
        deviceUid: uid,
        classId: classId,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res);

        that.setData({
          "list": res.data.list,
          "week": res.data.week,
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

  clickCourse: function(e) {
    console.log(e);

    let week = e.currentTarget.dataset.week;
    let pos = e.currentTarget.dataset.pos;
    let classId = e.currentTarget.dataset.classid;
    let id = e.currentTarget.dataset.id;

    console.log(week);
    console.log(pos);
    console.log(classId);

    if(week && pos && classId){
      wx.navigateTo({
        url: '../courseList/index?week='+week+'&pos='+pos+'&classId='+classId,
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

    console.log('onShow');

    //console.log(this.data.changeCourse);

    let week = this.data.changeCourse.week;
    let pos = this.data.changeCourse.pos;
    let name = this.data.changeCourse.name;
    let list = this.data.list;

    if (week && pos && list) {
       list[pos][week]['name'] = name;

       this.setData({
          list:list,
          currentCourse:{}
       })
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

  }

  
})