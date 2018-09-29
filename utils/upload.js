
const app = getApp()

/**
 * 选择上传图片
 */
export function MiniChooseImage() {
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
function wxChooseImage(){

  return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 9,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: function (res) {

          console.log(res);
          resolve(res)
        },
        fail(err){
          console.log(err)
          reject(err)
        }
    });
  })
}

/**
 * 后台上传图片
 */
function uploadImage(res){

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: app.globalData.origin + 'upload/informImage',
      filePath: res.tempFilePath,
      name: 'file',
      formData: {
        uid: 10000
      },
      success(respond) {

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
        console.log(err)
        reject(err)
      }
    })
  })  
}
