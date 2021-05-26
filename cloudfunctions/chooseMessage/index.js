// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 取一条给定id的数据
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const {OPENID} = cloud.getWXContext();
    const db = cloud.database()
    // 防止重复存储
    let message = await db
      .collection('message')
      .where({
        _id: event.id,
        touser: OPENID,
        templateId: event.templateId,
        
      })
      .get();
      return message
  } catch (error) {
    console.log(error);
    return error
  }
}