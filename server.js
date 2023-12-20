require('dotenv').config();
const Telegram = require('node-telegram-bot-api');

const express = require('express');
const app = express();
const bot = new Telegram(process.env.BOT_TOKEN, { polling: true });
//deploy demo
app.get('/', (req, res) => {
   res.send('Telegram bot service is running');
});

app.get('/send', (req, res) => {
   const { msg, chatId } = req.query;

   if (!msg || !chatId)
      return res.status(400).json({ msg: 'msg or chatId invalid' });

   bot.sendMessage(chatId, msg);
   return res.status(200).json({ msg: 'Send success' });
});

bot.onText(/\/start/, (msg) => {
   bot.sendMessage(
      msg?.chat?.id,
      '👻👻👻 Welcome to GoldenLotus Bot, bot này dùng để nhận thông báo về các task bạn được giao'
   );
   bot.sendMessage(
      msg?.chat?.id,
      '✍️✍️✍️ Để đăng ký nhận thông báo về task vui lòng nhập lệnh sau: /task my_userId'
   );
   bot.sendMessage(
      msg?.chat?.id,
      '🤳🤳🤳 Để biết được userId của mình là gì vui lòng truy cập https://crm.senvangsolutions.com/getuserid'
   );
});

bot.onText(/\/task (.+)/, (msg, match) => {
   const chatId = msg?.chat?.id;
   console.log(chatId);
   try {
      const userId = match[1];
      //VẦN VALIDATE LẠI USERID, lưu user ứng chatid vào đb
      //cần check xem chatid này đã có đăng ký nhận thông báo chưa

      bot.sendMessage(
         chatId,
         `🌟🌟🌟 Bạn đã đăng ký nhận thông báo công việc thành công với userId: ${userId}`
      );
      bot.sendMessage(
         chatId,
         `🔥🔥🔥 Nếu bạn nhập sai userId? Đừng lo lắng hãy nhập lệnh sau:/change new_userId`
      );
      bot.sendMessage(
         chatId,
         `🧑🏽‍💻🧑🏽‍💻🧑🏽‍💻 Nếu bạn muốn tắt nhận thông báo, hoặc thay đổi userId vui lòng liên hệ admin nhé`
      );
   } catch (error) {
      bot.sendMessage(chatId, 'Bot gặp lỗi rồi, vui lòng thử lại sau nhé!!');
   }
});

bot.onText(/\/change (.+)/, (msg, match) => {
   const chatId = msg?.chat?.id;
   try {
      const userId = match[1];
      //VẦN VALIDATE LẠI USERID, lưu user ứng chatid vào đb
      //cần check xem chatid đã tồn tại userid này chưa

      bot.sendMessage(
         chatId,
         `🌟🌟🌟 Bạn đã thay đổi userId nhận thông báo thành: ${userId}`
      );
      bot.sendMessage(
         chatId,
         `🔥🔥🔥 Nếu bạn nhập sai userId? Đừng lo lắng hãy nhập lệnh sau:/change new_userId`
      );
      bot.sendMessage(
         chatId,
         `🧑🏽‍💻🧑🏽‍💻🧑🏽‍💻 Nếu bạn muốn tắt nhận thông báo, hoặc thay đổi userId vui lòng liên hệ admin nhé`
      );
   } catch (error) {
      bot.sendMessage(
         chatId,
         '💥💥💥💥 Bot gặp lỗi rồi, vui lòng thử lại sau nhé!!'
      );
   }
});

bot.on('message', async (msg) => {
   const chatId = msg?.chat?.id;
   console.log(chatId);
   try {
   } catch (error) {
      console.log(error);
   }
});

app.listen(8080, () => console.log('Telegram bot service is running'));
