const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //buttonType: ['default', 'default', 'default', 'default', 'default', 'default', 'default', 'default', 'default'],
    //buttonName: ['幼小班', '幼中班', '幼大班', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    //buttonId:[-3,-2,-1,1,2,3,4,5,6],
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
        deviceUid: app.getUid(),
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
    
    var gradeChangeList = this.data.gradeList;

    gradeChangeList.forEach(grade => {
        if(grade.id == e.target.id){
            grade.select = true;
        }else{
            grade.select = false;
        }
    });

    this.setData({
      gradeList:gradeChangeList
    })
  },

  
  bindFormSubmit: function(e) {  

    var name = e.detail.value.className;
    if (name <= 0) {
      wx.showToast({
        icon: 'none',
        title: '班级名称不能为空'
      })
      return
    }

    var gradeId = 0;
    this.data.gradeList.forEach(grade => {
      if (grade.select) {
        grade.select = true;
        gradeId = grade.id;
      }
    });

    if (gradeId <= 0) {
      wx.showToast({
        icon: 'none',
        title: '你需要选择一个年级'
      })
      return
    }

    app.requestData({
      url: app.globalData.origin + 'class/add',
      params: {
        deviceUid: app.getUid(),
        gradeId: gradeId,
        name:name,
        platform: app.globalData.platform
      },
      type: 'get',
      sucBack: function (res) {
        console.log('suc111')
        console.log(res)

        wx.showModal({
          title: '提示',
          content: '创建班级成功',
          showCancel: false
        })

        wx.navigateTo({
          url: '../index/index?id=' + res.data['id'],
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