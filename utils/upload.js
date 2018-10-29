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