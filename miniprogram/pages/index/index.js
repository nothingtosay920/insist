// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    list: getApp().globalData.list,
    mark: true
  },

  
  // 发送消息
  sendMessage(){
    wx.cloud.callFunction({
      name: "sendMessage"
    }).then(res => {
      console.log('推送成功', res);
    })
  },

  // 跳转
  myclick(e) {
    wx.navigateTo({
      url: '../message/message?projecturl=' + e.currentTarget.dataset.id
    });
  },

  // 刷新数据 
  changeData:function(){
    this.onLoad();// 重新获取数据
    console.log('changeData');
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getMessage',

    }).then(res => {
      this.setData({
        list: res.result.message.data,
      })
      if (res.result.message.data[0]) {
        this.setData({
          mark: false,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})



