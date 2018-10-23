const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function onShareAppMessage(title,path,callback,imageUrl){

  let defaultImageUrl = '../image/icon.jpg';

  return {
    title: title,
    path: path,
    imageUrl: imageUrl || defaultImageUrl,
    success(res) {
      console.log("转发成功！");
      console.log(res)
      if (!res.shareTickets) {
        //分享到个人
        console.log("shareFriendSuccess!");
        callback && callback();
      } else {
        //分享到群
        let st = res.shareTickets[0];
        wx.getShareInfo({
          shareTicket: st,
          success(res) {
            let iv = res.iv
            let encryptedData = res.encryptedData;
            console.log("groupShareSuccess!");
            //执行转发成功以后的回调函数
            callback && callback();
            
          }
        });
      }
    },
    fail: function (res) {
      console.log("转发失败！");
    }
  };
}

module.exports = {
  formatTime: formatTime,
  onShareAppMessage: onShareAppMessage
}