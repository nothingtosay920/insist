//app.js
App({
  onLaunch: function () {
    const that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'mycomputer-5gmwc9rx59bf8857',
        traceUser: true,
      })
    }


    this.globalData = {
      list:'',
      openId: '',
      tmplIds: 'hDpXu3Jkk0ShF2WLI4fP8kMLWsmT4rPw3ZpSnonx7RE'
    }

    wx.cloud
      .callFunction({
        name: 'getOpenId',
      })
      .then((res) => {
        console.log('授权成功', res.result.openid);
        this.globalData.openId = res.result.openid
        })
   



    wx.getSystemInfo({
      success: (result) => {
        this.globalData.statusBarHeight = result.statusBarHeight;
      }
    })
  }
})
