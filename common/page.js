export default function (options = {}) {
  return Page({
    onShareAppMessage() {
      return {
        title: '大班分享'
      };
    },
    ...options
  });
}
