// components/custom-tab-bar/custom-tab-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  

  /**
   * 组件的初始数据
   */
  data: {
    color: "#515151",
    selectedColor: "#24171C",
    backgroundColor: "#B2C8BB",
    list: [
      {
        "pagePath": "/pages/graffiti/graffiti",
        "iconPath": "/images/calendar.png",
        "selectedIconPath":"/images/calendar.png",
        "text": "涂鸦",
      },
      
      {
        "pagePath": "/pages/index/index", 
        "iconPath": "/images/world.png",
        "selectedIconPath":"/images/chooseWorld.png",
        "bulge": true
      },
      {
        "pagePath": "/pages/mine/mine",
        "iconPath": "/images/user.png",
        "selectedIconPath":"/images/user.png",
        "text": "我的"
      }
    ]
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url}) 
    }
  }
})
