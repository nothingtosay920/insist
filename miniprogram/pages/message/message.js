// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    data: {
      thing1: { value: '' }, // 种类
      date2: { value: '' }, // 日期和时间
      thing3: { value: '花月正春风。' }, // 留言
      timeFun: '',
      img: ''
    },
    startDate: '',
    chooseDate: '',
    chooseTime: '',
    remark: '',
    id: '',
    show: true
  },

  // 返回上一页
  return() {
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

  // 输入的类型
  bindChange: function (e) {
    this.setData({
      'data.thing1.value': e.detail.value
    })
  },

  // 选中日期
  bindDateChange: function (e) {
    this.setData({
      chooseDate: e.detail.value,
    })
  },

  // 选中时间
  bindTimeChange: function(e) {
    this.setData({
      chooseTime: e.detail.value
    })
  },

  // 留言
  messageChange(e) {
    this.setData({
      'data.thing3.value': e.detail.value
    })
  },
  
 // 计算时间
  timesFun: function (timesData) {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateBegin = new Date(timesData);//将-转化为/，使用new Date
  // var dateNow = new Date();//获取当前时间
  var dateNow = new Date();//获取当前时间

  var dateDiff = dateBegin.getTime() - dateNow.getTime()  ;//时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
  var timesString = '';

  if (dayDiff != 0) {
      timesString = dayDiff + '天';
  } 
  if (hours != 0) {
      timesString += hours + '小时之后';
  } else {
      timesString = '不足一小时啦!'
  }
  return timesString
  },
  // saveMessage
  readySaveMessage: function() {
    let loge = true
    // 判断数据是否完整
    if (this.data.data.thing1.value == '') {
      wx.showToast({
        title: '请先填写完整哦',
        icon: 'none',
        duration: 2000
      })
      loge = false
    }


    const nowTime = new Date()
    let date = nowTime.toLocaleDateString().replace(/\//g, '-')
    let hour=nowTime.getHours();
    let minute = nowTime.getMinutes();
    if (minute<10) {
      minute='0'+minute;
    }
    if (hour<10) {
      hour='0'+hour;
    }
    let time = date + ' ' +  hour + ':' + minute
    // 填入时间
    if (this.data.chooseDate) {
      this.setData({
        'data.date2.value': this.data.chooseDate + ' ' + this.data.chooseTime
      })
    } else {
      this.setData({
        'data.date2.value': this.data.startDate + ' ' + this.data.chooseTime
      })
    }
    console.log('date', this.data.data.date2.value);
    if (loge && this.data.data.date2.value <= time) {
      wx.showToast({
        title: '请先重新填写时间哦',
        icon: 'none',
        duration: 2000
      })
      loge = false
    }

    this.setData({
      'data.timeFun': this.timesFun(this.data.data.date2.value)
    })


    // 填入图片
    this.setData({
      'data.img': `../../images/icon/${Math.round(Math.random()*8)}.png` 
    })
    return {time:this.data.data.date2.value, loge: loge }
  },

   // 跳转
   myskip: function() {
     console.log('跳转中');
     wx.showToast({
      title: '请稍后',
      icon: 'success',
      duration: 1000
    })
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


  mysave: function () {
    const id = getApp().globalData.openId
    const that = this
    const tmplIds = getApp().globalData.tmplIds
    const time = this.readySaveMessage()

    wx.requestSubscribeMessage({
      tmplIds: [tmplIds],
      success: res => {
        if (res[tmplIds] === 'accept') {
          // 这里将订阅的信息调用云函数存入db
          console.log('true');
          wx.cloud
            .callFunction({
              name: 'saveMessage',
              data: {
                data: that.data.data,
                templateId: tmplIds,
                _openid: id
              },
            })
            .then((res) => {
              console.log('授权成功', res);
              that.myskip()
              
            })
            .catch((res) => {
              console.log('error', res);
            });
        }
      },
      // fail 有问题 醉了
      fail: function(res){
        console.log(res);
      },
    })
  },

  // 保存数据 跳转到首页 更新首页
  saveClick: async function  () {
    const id = getApp().globalData.openId
    const that = this
    const tmplIds = getApp().globalData.tmplIds
    const time = this.readySaveMessage()
    console.log(time);
    if (!time.loge) {
      return
    }
    let log = true
    await wx.cloud.callFunction({
      name: 'timeMessage',
      data: {
        time: time.time
      }
    }).then(res => {
      console.log('log:', res.result);
      log = res.result
      
    })

   if (this.data.remark) {
      console.log('remark');
      const db = wx.cloud.database()
      console.log(this.data.id);
      db.collection('message').doc(this.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          data: that.data.data
        },
        success: function (res) {
          console.log("修改成功")
          that.myskip()
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    } else {
      //保存数据
      console.log('新建');
      console.log(log);
      if (log) {
        wx.showToast({
          title: '请不要重复添加',
          icon: 'none',
          duration: 2000
        })
        return
      }
    await  this.mysave()
    }
    

    
    
    
  },

  // 删除数据
  deliteClick() {
    const that = this
    const db = wx.cloud.database()
    db.collection('message').doc(this.data.id).remove({
      success: function(res) {
        console.log('删除成功');
        const pages =getCurrentPages();
        if (pages.length >1) {
          let beforePage = pages[pages.length - 2];//获取上一个页面实例对象
          beforePage.changeData();//触发父页面中的方法
        }
        wx.navigateBack({
          delta: 1  
        }) 
      }
    })
    
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const timer = new Date()
    let date = timer.toLocaleDateString().replace(/\//g, '-')
    let hour=timer.getHours();
    let minute = timer.getMinutes();
    if (minute !== 59) {
      minute++
      if (minute<10) {
        minute='0'+minute;
      }
    } else {
      minute == '00'
      hour++
      if (hour == 24) {
        hour == 0
      }
      if (hour<10) {
        hour='0'+hour;
      }
    }

    let time = hour + ':' + minute

    this.setData({
      startDate: date,
      chooseDate: date
    })
    
    if (options.projecturl != 'undefined') {
      // 修改 或 删除
      console.log('成功了');
      wx.cloud.callFunction({
        name: 'chooseMessage',
        data: {
          templateId: getApp().globalData.tmplIds,
          id: options.projecturl
        }
      }).then((res) => {
        const  time = res.result.data[0].data.date2.value.split(' ')

        this.setData({
          remark: true,
          chooseDate: time[0],
          chooseTime: time[1],
          'data.thing1.value': res.result.data[0].data.thing1.value,
          'data.date2.value': res.result.data[0].data.date2.value,
          id: options.projecturl
        })
      })
    } else {

      // 新建
      this.setData({
        chooseTime: time,
      })
      
    }

    
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