// pages/class/courseList/index.js
var pages = getCurrentPages();
var prevPage = pages[pages.length - 2]; 

Page({


  /**
   * 页面的初始数据
   */
  data: {
    week:0,
    pos:0,
    classId:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);

    let week = options.week;
    let pos = options.pos;
    let classId = options.classId;

    this.setData({
      week,
      pos,
      classId
    })

    var uid = app.getUid();
    var that = this;

    app.requestData({
      url: app.globalData.origin + 'course/list',
      params: {
        deviceUid: uid,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res);

        that.setData({
          "list": res.data.courseList,
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

  chooseCourse: function(e) {

    console.log(e);

    let courseId = e.currentTarget.dataset.courseId;
    if (!courseId) {
        console.log('courseId is nul');
        return;
    }

    var uid = app.getUid();
    var that = this;

    app.requestData({
      url: app.globalData.origin + 'course/updateTimetable',
      params: {
        deviceUid: uid,
        classId:this.data.classId,
        pos:this.data.pos,
        week:this.data.week,
        courseId:courseId,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log(res);

        const currentCourse = {
          'week':this.data.week,
          'pos':this.data.pos,
          'name':res.data.course.name
        };

        prevPage.setData({  
          currentCourse:currentCourse,
        })

        wx.navigateBack({
          delta: 1,
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