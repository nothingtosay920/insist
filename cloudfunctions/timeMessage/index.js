// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {OPENID} = cloud.getWXContext();
  const db = cloud.database()
  let message = await db
    .collection('message')
    .where({
      touser: OPENID,
      templateId: event.templateId,
      
    })
    .get();
  // message.data数组
  let judg = false
  message.data.forEach((item) => {
    if (event.time == item.data.date2.value) {
      judg = true
    }
  })

  return judg
}