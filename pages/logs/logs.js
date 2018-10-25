
Page({
  data: {
    logs: []
  },
  onLoad: function () {

  },

  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },

   submitInfo: function (e) {
       console.log(e.detail.formId);  
   }
  
})
