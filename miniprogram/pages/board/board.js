/**
 * 简笔画
 */


// pages/jbh/jbh.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
  },

  penConfig: {
    fontSize: 6,
    color: '#000000',
    dialogShow: true,
    showOneButtonDialog: true,
    buttons: [{text: '取消'}, {text: '确定'}],
    oneButton: [{text: '确定'}],
  },


  return: function () {
    const pages =getCurrentPages();
    if (pages.length >1) {
      let beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.changeData();//触发父页面中的方法
    }
    wx.navigateBack({
      delta: 1  
    }) 
  },

  //加载
  onLoad: function(options) {
    console.log('board onload');
    this.setData({
      curColor: this.penConfig.color,
      curSize: this.penConfig.fontSize
    })

    //分享
    wx.showShareMenu({
      withShareTicket: false
    });

    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        let canvasWidth = (res.screenWidth - 8) * 2
        let canvasHeight = (res.screenHeight - 200) * 2
        if (res.model.indexOf('iPad') > -1){
          canvasHeight = canvasHeight - 120
        }
        that.setData({
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
          screenWidth: canvasWidth/2,
          screenHeight: canvasHeight/2
        });
        
        that.context = wx.createCanvasContext('myCanvas');
        that.context.drawImage("../../images/canvas/bg.png", 0, 0, 100, 100, 0, 0, canvasWidth, canvasHeight); 
      },
    })
  },


  //选择颜色
  colorSelect: function(e) {
    this.penConfig.color = e.currentTarget.dataset.p;
    // console.log(this.penConfig.color);
    this.setData({
      curColor: this.penConfig.color
    })
  },

  touchStart: function(e) {
    //得到触摸点的坐标
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    this.context.moveTo(x,y);
    this.context.setStrokeStyle(this.penConfig.color);
    this.context.setLineWidth(this.penConfig.fontSize);
    this.context.setLineCap('round'); // 让线条圆润 
    this.context.beginPath();
    
  },

  //手指触摸后移动
  touchMove: function(e) {
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    this.context.lineTo(x,y);
    // 开始画线
    this.context.stroke();
    // 将绘画绘制到canvas
    this.context.draw(true);
    this.context.moveTo(x,y);
  },


  //橡皮擦
  erase: function (e) {
    this.penConfig.fontSize = 12;
    this.penConfig.color = '#FFF';
  },



  //撤销
  revoke: function() {
    let canvasWidth = this.data.canvasWidth
    let canvasHeight = this.data.canvasHeight
    let tmpPenData = this.penConfig;
    this.context.drawImage("../../images/canvas/bg.png", 0, 0, 100, 100, 0, 0, canvasWidth, canvasHeight);
    this.context.draw();
    //还原画笔设置
    this.penConfig = tmpPenData;
  },

  
  //保存canvas图片
  saveCanvas: function (e) {
    wx.showLoading({
      title: '图片保存中...',
    });

    this.context.draw(true,drawRes =>{
      //画图
      this.drawImageShowForSave(res => {
        this.setData({
          hiddenCanvas: true
        });
        this.data.imagePath = res.tempFilePath;
        this._saveImageAlbum();
      });
    });

  },

  /**
   * 保存图片
   */
  _saveImageAlbum: function () {
    const filePath = this.data.imagePath;
    const name = Math.random() * 1000000;
    const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
    console.log('filePath', filePath);
    console.log('cloudPath', cloudPath);

    wx.cloud.uploadFile({
      cloudPath,//云存储图片名字
      filePath,//临时路径
      success: (res)=>{
        console.log('[上传图片] 成功：', res)
        let fileID = res.fileID;
        //把图片存到users集合表
        console.log(fileID);
        const db = wx.cloud.database();
          db.collection("users").add({
            data: {
              bigImg: fileID
            },
            success: function () {
              const pages =getCurrentPages();
              if (pages.length >1) {
                let beforePage = pages[pages.length - 2];//获取上一个页面实例对象
                beforePage.changeData();//触发父页面中的方法
              }
              wx.navigateBack({
                delta: 1  
              }) 
            },
            fail: function () {
              wx.showToast({
                title: '图片存储失败',
                'icon': 'none',
                duration: 1000
              })
            }
          }); 
      },
      fail: (res)=>{
        console.log('上传失败', res);
      },
      complete: ()=>{}
    });
  },

  drawImageShowForSave: function (cb) {
    var destWidth = this.data.canvasWidth;
    var destHeight = this.data.canvasHeight;
    
    wx.canvasToTempFilePath({
      destWidth: destWidth,
      destHeight: destHeight,
      width: destWidth,
      height: destHeight,
      canvasId: 'myCanvas',
      success: function (res) {
        if (cb) {
          cb(res);
        }
      },
      complete: function (res) {

      }
    });
  },

})