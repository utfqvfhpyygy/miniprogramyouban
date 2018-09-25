

function wxAuthorize(type){
  return new Promise((resolve,reject) =>{
    wx.authorize({
      scope: 'type',
      success(){
        console('suc')
        resolve()
      },fail(){
        console('fail')
        resolve("reject")
      }
    })
  })
}