const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init();
  const db = cloud.database();
  const _ = db.command;
 const nowTime = new Date()
 const year = nowTime.getFullYear(); //得到年份
 const month = nowTime.getMonth() + 1;//得到月份
 const date = nowTime.getDate();//得到日期
 let hour=nowTime.getHours();
  let minute = nowTime.getMinutes();
  if (minute<10) {
    minute='0'+minute;
  }
  if (hour<10) {
    hour='0'+hour;
  }
const time = year + '-' + month + '-' + date + ' ' + hour + ':' + minute   
  try {
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('message')
      .where({
        done: false,
        data: {date2: {value: time}}
      })
      .get();
    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('message')
          .doc(message._id)
          .remove();
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};
