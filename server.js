require('dotenv').config();
const express = require('express');
const app = express();

const { sendRequest } = require('./src/helpers');
const API_URL = process.env.API_URL;

const Telegram = require('node-telegram-bot-api');
const bot = new Telegram(process.env.BOT_TOKEN, { polling: true });

app.get('/', (req, res) => {
   res.send('Telegram bot service is running');
});

app.get('/send', (req, res) => {
   try {
      let { msg, chatId, parse_mode } = req.query;

      const parseModeType = ['Markdown', 'MarkdownV2', 'HTML'];
      if (!parseModeType.includes(parse_mode)) parse_mode = undefined;

      if (!msg || !chatId) {
         return res.status(200).json({
            Success: false,
            Message: 'msg or chatId invalid',
            Result: null,
            Code: 400,
         });
      }

      bot.sendMessage(chatId, msg, { parse_mode });

      return res.status(200).json({
         Success: true,
         Message: 'Send success',
         Result: null,
         Code: 200,
      });
   } catch (error) {
      return res.status(200).json({
         Success: false,
         Message: error,
         Result: null,
         Code: 400,
      });
   }
});

bot.onText(/\/start/, (msg) => {
   try {
      const msgTemplate = `
    <strong>🖖🖖🖖Chào mừng bạn đến với GoldenLotus Bot🖖🖖🖖</strong>
    <i>Bot này được sử dụng để nhận thông báo về các công việc bạn được giao</i>
    <strong>===========================</strong>
 
    ---  Để đăng ký nhận thông báo về công việc, vui lòng nhập lệnh:
    <code>/task my_userId</code>
 
    ---  Để biết <strong>userId</strong> của bạn, vui lòng truy cập trang:
    <code>https://crm.senvangsolutions.com/Account/GetUserId</code>
    `;

      bot.sendMessage(msg?.chat?.id, msgTemplate, {
         parse_mode: 'HTML',
      });
   } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
         parse_mode: 'HTML',
      });
   }
});

bot.onText(/\/task (.+)/, async (msg, match) => {
   const chatId = msg?.chat?.id;
   try {
      const userId = match[1];

      const postOptions = {
         body: {
            UserId: userId,
            ChatId: chatId,
         },
      };
      const result = await sendRequest(
         API_URL + '/InsertTelegramChatId',
         'POST',
         postOptions
      );

      if (result.Success && result.Code == 200) {
         const msgTemplate = `
                   <b>=====================================================</b>
                   <b>🔥🔥🔥Bạn đã đăng ký nhận thông báo công việc thành công</b>
                   <b>🔥🔥🔥Nếu bạn nhập sai <i>userId</i>, vui lòng nhập lệnh sau để thay đổi:</b>
                   <code>/change new_userId</code>
          `;

         bot.sendMessage(chatId, msgTemplate, {
            parse_mode: 'HTML',
         });
      } else {
         bot.sendMessage(chatId, result.Message, {
            parse_mode: 'HTML',
         });
      }
   } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
         parse_mode: 'HTML',
      });
   }
});

bot.onText(/\/change (.+)/, async (msg, match) => {
   const chatId = msg?.chat?.id;
   try {
      const userId = match[1];

      const postOptions = {
         body: {
            UserId: userId,
            ChatId: chatId,
         },
      };
      const result = await sendRequest(
         API_URL + '/UpdateTelegramChatId',
         'POST',
         postOptions
      );

      if (result.Success && result.Code == 200) {
         const msgTemplate = `
          <b>=====================================================</b>
          <strong>🔥🔥🔥 Bạn đã thay đổi userId nhận thông báo thành</strong>
          <strong>🔥🔥🔥 Nếu bạn nhập sai <i>userId</i>, vui lòng nhập lệnh sau để thay đổi: </strong>
          <code>/change new_userId</code>
          `;

         bot.sendMessage(chatId, msgTemplate, {
            parse_mode: 'HTML',
         });
      } else {
         bot.sendMessage(chatId, result.Message, {
            parse_mode: 'HTML',
         });
      }
   } catch (error) {
      bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
         parse_mode: 'HTML',
      });
   }
});

app.listen(8080, () => console.log('Telegram bot service is running'));
