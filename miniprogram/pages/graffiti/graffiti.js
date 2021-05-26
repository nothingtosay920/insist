// miniprogram/pages/graffiti/graffiti.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    statusBarHeight: getApp().globalData.statusBarHeight,
    log: true,

  },

  myclick: function() {
    wx.navigateTo({
      url: '../board/board',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  // 刷新数据 
  changeData:function(){
    this.onLoad();// 重新获取数据
    console.log('graffiti changeData');
  }, 

  // 展示img
  showImg: function (e) {
    console.log(e.target.dataset.id);
    wx.navigateTo({
      url: '../show/show?projecturl=' + e.target.dataset.id
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this; //这句不能少，在查询时
    const db = wx.cloud.database()
    const openid = getApp().globalData.openId
    db.collection('users').where({
      _openid: openid,    //查询条件
    }).get({
      success(res) {
        that.setData({
          list: res.data,
        })
        if (that.data.list.length) {
          this.setData({
            log: false
          })
        }
      },
      fail: err => {
        console.log('失败')
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
        selected: 0
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