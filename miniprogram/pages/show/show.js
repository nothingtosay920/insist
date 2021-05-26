// miniprogram/pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    src: '',
    id: ''
  },

  return: function() {
    const pages =getCurrentPages();
    if (pages.length >1) {
      let beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.changeData();//触发父页面中的方法
    }
    wx.navigateBack({
      delta: 1  
    })
  },

  deleteImg: async function() {
    const that = this
    const db = wx.cloud.database()

    wx.showLoading({
      title: '图片保存中...',
    });

    await wx.cloud.deleteFile({
      fileList: [that.data.src+''],
        success: res => {
          console.log(res.fileList)
        },
        fail: console.error
    })

    console.log(that.data.id._id);
    await db.collection('users').doc(that.data.id._id).remove({
      success: function(res) {
        console.log('数据删除成功', res.data)
      },
      fail: function (res) {
        console.log('数据删除失败', res.data);
      }
    })
    wx.hideLoading()
    // 跳转 刷新数据
    const pages =getCurrentPages();
    if (pages.length >1) {
      let beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.changeData();//触发父页面中的方法
    }
    wx.navigateBack({
      delta: 1  
    }) 
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options.projecturl);
   const that = this; //这句不能少，在查询时
    const db = wx.cloud.database()
    db.collection('users').where({
      _id: options.projecturl    //查询条件
    }).get({
      success(res) {
        that.setData({
          src: res.data[0].bigImg,
          id: res.data[0]
        })
        console.log(this.data.id);
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