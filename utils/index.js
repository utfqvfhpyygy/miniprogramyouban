const app = getApp()


function getAddress(location){

  console.log('getAddress')
  console.log(location)

  var qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + location.latitude + ',' +
      location.longitude + "&key=7L2BZ-4UZW6-UW7SS-MUEYB-M73PS-F2FFY" + "&get_poi=1";

    wx.request({
      url: qqMapApi,
      data: {},
      method: 'GET',
      success: (res) => {
        console.log(res.data)

      }
    });

}

/**
 * ajax请求
 * @param url    请求地址
 * @param params 请求参数
 * @param type   请求类型 (默认"get")
 * @param sucBack  成功回调
 * @param errBack  失败回调
 */
export function wxAjax(option) {
  return wxAjax(option)
}

/**
 * 询问授权
 * @param { String } type scope授权类型
 */
export function wxAuthorize(type) {
  return wxAuthorize(type)
}

/**
 *
 * @param { Object } obj        参数对象
 * @param { String } obj.url    下载资源的 url
 * @param { Object } obj.header HTTP 请求 Header，header 中不能设置 Referer(不是必传)
 */
export function wxDownloadFile(obj) {
  return new Promise((resolve, reject) => {
    const param = {
      url: obj.url,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    }
    if (obj.header) param.header = obj.header
    wx.downloadFile(param)
  })
}

/**
 * 保存到相册
 * @param { String } filePath 图片地址
 */
export function wxSaveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}

/**
 * 获取query参数
 * @param { String } str ?后面的字符串
 * @param { String } name 参数名字
 */
export function getQueryString(str, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = str.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 检查小程序session是否过期
 * @return { Promise } - resolve true：未过期；false：已过期；
 */
function wxCheckSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        console.log('session没过期')
        resolve(true)
      },
      fail() {
        console.log('session过期了')
        resolve(false)
      }
    })
  })
}

/**
 * 获取openId
*/
function getOpenid() {
  return new Promise((resolve, reject) => {
    const openid = wx.getStorageSync('openid')

    console.log('本地openid:'+openid)

    if (openid) {
      wxCheckSession()
        .then(flag => {
          if (flag) {
            resolve(openid)
          } else {
            return getOpenidFromServer()
          }
        })
        .then(openid => {
          resolve(openid)
        })
        .catch(() => {
          console.error('出错了')
        })
    } else {
      getOpenidFromServer()
        .then(openid => {
          console.log('getOpenid getOpenidFromServer suc')
          resolve(openid)
        })
        .catch(() => {
          console.log('getOpenid getOpenidFromServer fail')
          console.error('出错了')
        })
    }
  })
}

function getOpenidFromServer() {
  return new Promise((resolve, reject) => {
    wxLogin()
      .then(res => {

        console.log('wxlogin response:'+res)

        return wxAjax({
          url: app.globalData.origin + 'user/getOpenid',
          params: {
            code: res.code,
            state: 'weChatLogin',
            isXCX: 1,
            platform: app.globalData.platform
          },
          type: 'get'
        })
      })
      .then(res => {

        console.log('getOpenidFromServer api response:'+res)

        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            wx.setStorage({
              key: 'openid',
              data: res.data.data.openId
            })
            app.globalData.openid = res.data.data.openId
            resolve(res.data.data.openId)
          } else {
            wx.showModal({
              title: '提示',
              content: res.msg,
              showCancel: false
            })
            reject()
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.errMsg,
            showCancel: false
          })
          reject()
        }
      })
      .catch(err => {
        console.error(err)
      })
  })
}

/**
 * 询问授权
*/
function wxAuthorize(type) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: type,
      success() {
        console.log('用户同意了授权')
        resolve()
      },
      fail() {
        console.log('用户拒绝了授权')
        resolve('用户拒绝了授权')
      }
    })
  })
}

/**
 * 获取微信用户信息
*/
function wxGetUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        console.log('获取微信用户信息成功')
        resolve(res)
      },
      fail() {
        console.log('获取微信用户信息失败')
        reject()
      }
    })
  })
}

/**
 * 调用接口wx.login() 获取临时登录凭证（code）
*/
function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        console.log('wx.login suc')
        resolve(res)
      },
      fail() {
        console.log('wx.login fail')
        reject()
      }
    })
  })
}

/**
 * 请求方法
 * @param { Object } option - 请求参数
 */
function wxAjax(option) {
  return new Promise((resolve, reject) => {
    const params = {
      url: option.url,
      data: option.params,
      dataType: 'json',
      method: option.type || 'get',
      success(data) {
        resolve(data)
      },
      fail(err) {
        reject(err)
      }
    }
    if(option.type && option.type.toLocaleLowerCase == 'post') {
      requestBody.header = {
        'content-type': 'applicaton/x-www-form-urlencoded',
        'H-Sys-Type': 'wechat',
        'H-app-Type': 'wechat',
        'H-Version': '',
      }
    }
    wx.request(params)
  })
}
