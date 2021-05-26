// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const db = cloud.database()
    const wxContext = cloud.getWXContext()
    const {OPENID} = cloud.getWXContext();
    // 防止重复存储
   

    // 在云开发数据库中存储用户订阅的信息
    const result = await db.collection('message').add({
      data: {
        ...event,
        touser: OPENID,
        page: 'index',
        done: false, // 消息发送状态设置为 false
      },
    });
    return result
  } catch (err) {
    console.log(err);
    return err;
  }
}