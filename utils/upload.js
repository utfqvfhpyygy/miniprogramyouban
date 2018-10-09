const app = getApp()


/**
 * 微信选择图片
 */
export function wxChooseImage(){

  console.log('wxChooseImage');

  return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 9,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: function (res) {
          resolve(res)
        },
        fail(err){
          reject(err)
        }
    });
  })
}

/**
 * 后台上传图片
 */
export function uploadImage(tempFilePath){

  console.log('uploadImage');
  console.log(tempFilePath);

  return new Promise((resolve, reject) => {
    
    wx.uploadFile({
      url: app.globalData.origin + 'upload/informImage',
      filePath: tempFilePath,
      name: 'pic',
      formData: {
        uid: 10000
      },
      success(respond) {

        if (respond.statusCode === 200) {
          const data = JSON.parse(respond.data)
          if (data.code === 0) {
            resolve(data)
          }
        }else{
          console.log('uploadImage reject');
          reject(data)
        }
      },
      fail(err) {
        console.log('uploadImage fail');
        console.log(err)
        reject(err)
      }
    })
  })  
}

////////////////////////////////////////////

/**
 * 微信选择视频
 */
export function wxChooseVedio(){

  console.log('wxChooseVedio');

  return new Promise((resolve, reject) => {
      wx.chooseVideo({
        sourceType: ["album", "camera"],
        maxDuration: 60,
        camera: "back",
        success: function (res) {

          console.log('wxChooseVedio suc');
          console.log(res);
          resolve(res)
        },
        fail(err){
          console.log('wxChooseVedio fail');
          console.log(err)
          reject(err)
        }
    });
  })
}

/**
 * 后台上传文件
 */
export function uploadFile(tempFilePath){

  console.log('uploadFile');
  console.log(tempFilePath);

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: app.globalData.origin + 'upload/informFile',
      filePath: tempFilePath,
      name: 'file',
      formData: {
        uid: 10000
      },
      success(respond) {

        console.log('uploadFile suc');
        console.log(respond)

        if (respond.statusCode === 200) {
          const data = JSON.parse(respond.data)
          if (data.code === 0) {
            resolve(data)
          }
        }else{
          console.log('uploadFile reject');
          reject(respond)
        }
      },
      fail(err) {
        console.log('uploadFile fail');
        console.log(err)
        reject(err)
      }
    })
  })  
}


////////////////////////////////////////////



/**
 * 检查录音权限
 */
function wxCheckRecordAuth(){

  console.log('wxCheckRecordAuth');

  var that = this;
  return new Promise((resolve, reject) => {
      wx.getSetting({
        success: function (t) {

          if(t.authSetting["scope.record"]){
            console.log("之前已经授权成功")
            resolve();

          }else{
            wx.authorize({
              scope: "scope.record",
              success: function () {
                console.log("获取授权成功")
                resolve();
              },
              fail: function () {
                console.log("获取授权失败")
                reject();
              }
            });
          }
        }

      });
  });
}


export const voiceCallBack = {

  upStart: function () {
    console.log('upStart');
  },

  upStop: function (res) {
    console.log('upStop');
    console.log(res);
  },

  upError: function (err) {
    console.log('upError');
    console.log(err);
  },

  upComplete: function () {
    console.log('upComplete');
  },

}