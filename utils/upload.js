
const app = getApp()

/**
 * 选择上传图片
 */
export function MiniChooseImage() {
  console.log('MiniChooseImage');

  return new Promise((resolve, reject) => {

    wxChooseImage()
    .then(res => {
        return uploadImage(res)
    })
    .catch(err => {
        console.error(err)
    })

  })
}


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

        //console.log('uploadImage suc');
        //console.log(respond)

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
 * 选择上传视频
 */
export function MiniChooseVedio() {
  console.log('MiniChooseVedio');

  return new Promise((resolve, reject) => {

    wxChooseImage()
    .then(res => {
        return uploadVedio(res)
    })
    .catch(err => {
        console.error(err)
    })

  })
}

/**
 * 微信选择视频
 */
function wxChooseVedio(){

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
 * 后台上传视频
 */
function uploadVedio(res){

  console.log('uploadVedio');
  console.log(res);
  console.log(res[0].tempFilePath);

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: app.globalData.origin + 'upload/informFile',
      filePath: res[0].tempFilePaths,
      name: 'file',
      formData: {
        uid: 10000
      },
      success(respond) {

        console.log('uploadVedio suc');
        console.log(respond)

        if (respond.statusCode === 200) {
          const data = JSON.parse(respond.data)
          if (data.code === 0) {
            resolve(respond)
          }
        }else{
          reject(respond)
        }
      },
      fail(err) {
        console.log('uploadVedio fail');
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



/**
 * 后台上传音频
 */
function uploadVoice(res){

  console.log('uploadVoice');
  console.log(res);
  console.log(res[0].tempFilePath);

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: app.globalData.origin + 'upload/informFile',
      filePath: res[0].tempFilePaths,
      name: 'file',
      formData: {
        uid: 10000
      },
      success(respond) {

        console.log('uploadVoice suc');
        console.log(respond)

        if (respond.statusCode === 200) {
          const data = JSON.parse(respond.data)
          if (data.code === 0) {
            resolve(respond)
          }
        }else{
          reject(respond)
        }
      },
      fail(err) {
        console.log('uploadVoice fail');
        console.log(err)
        reject(err)
      }
    })
  })  
}

/**
 * 限制长度
 * @param {*} res 
 */
export function timeLimit(res){
  console.log('timeLimit');
  
  return new Promise((resolve,reject) => {
    if (Math.floor(res.duration / 1000) < 10) {
      wx.showModal({
        title: '提示',
        content: '录音时间不能太短。',
        showCancel: false
      })
      reject(res);
    }else{
      resolve(res);
    }
  })

}

