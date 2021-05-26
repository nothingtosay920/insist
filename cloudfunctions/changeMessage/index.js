// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const {OPENID} = cloud.getWXContext();
    const db = cloud.database()

    let message = await db
      .collection('message')
      .where({
        _id: event.id,
        touser: OPENID,
        templateId: event.templateId,
      })
      .get();
      message.data = event.data
      return message
  } catch (error) {
    console.log(error);
    return error
  }
}