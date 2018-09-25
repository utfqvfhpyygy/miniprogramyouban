const app = getApp()

/**
 * 小程序登陆
 * 1 提示授权用户信息
 * 2 通过微信方法获取用户基本信息
 * 3 获取openid
 *   3.1 检查本地存储，有openid跳3.2，没有跳3.3
 *   3.2 检查小程序session是否过期，过期跳3.3，没过期跳4
 *   3.3 通过SGWeChat/getOpenid接口从后台获取openid，获取后本地存储，跳4
 * 4 利用openid，通过SGWeChat/checkStatus接口上传用户微信信息和获取松果用户信息
 * 5 检查用户松果信息中的sessionKey是否为空，为空再调用一次SGWeChat/getOpenid更新sessionKey
 * 6 本地储存松果用户信息
 * 7 resolve()
*/
export function login() {
  console.log('start login')
  
  const that = this
  return new Promise((resolve, reject) => {
    wxAuthorize('scope.userInfo')
      .then(() => {
        return wxGetUserInfo()
      })
      .then(wxUserInfo => {
        app.globalData.wxUserInfo = wxUserInfo.userInfo
        return getOpenid()
      })
      .then(openid => {
        return wxAjax({
          url: app.globalData.origin + 'user/checkOpenid',
          params: {
            openid,
            nickName: app.globalData.wxUserInfo.nickName,
            avatarUrl: app.globalData.wxUserInfo.avatarUrl,
            gender: app.globalData.wxUserInfo.gender,
            platform: app.globalData.platform
          },
          type: 'get'
        })
      })
      .then(res => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            wx.setStorage({
              key: 'userInfoStr',
              data: JSON.stringify(res.data.data)
            })
            app.globalData.userInfo = res.data.data
 
            if (res.data.data.sessionKey === '1') {
                resolve()
            } else {
                console.log('sessionkey为0时候请求openid')
                getOpenidFromServer()
                  .then(openid => {
                    if (openid) resolve()
                  })
            }
            
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
            getOpenidFromServer()
              .then(openid => {
                if (openid) that.login()
              })
              .catch(() => {
                console.error('出错了')
              })
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
        reject(err)
        console.error(err)
      })
  })
}

/**
 * 更新用户信息（已有openid的情况下）
*/
export function updateUserInfoFromServer() {
  return new Promise((resolve, reject) => {
    const openid = wx.getStorageSync('openid')
    if (!openid) reject('没有openid')
    wxAjax({
      url: app.globalData.origin + 'user/checkOpenid',
      params: {
        openid,
        platform: app.globalData.platform
      },
      type: 'get'
    })
      .then(res => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            app.globalData.userInfo = res.data.data
            wx.setStorage({
              key: 'userInfoStr',
              data: JSON.stringify(res.data.data)
            })
            resolve(res.data.data)
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
  })
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
