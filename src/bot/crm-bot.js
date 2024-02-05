const { sendRequest, getToDateString, sendLogErr } = require('../common/core');
const getEnv = require('../common/env');

const CRM = (bot, logBot) => {
   bot.onText(/\/start/, async (msg) => {
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

         const { message_id } = await bot.sendMessage(
            msg?.chat?.id,
            msgTemplate,
            {
               parse_mode: 'HTML',
            }
         );
      } catch (error) {
         const title = `Lỗi CRM BOT \n`;
         const time = `Thời gian: ${getToDateString()} \n`;
         const command = 'Command: /start \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${command}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });

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
            getEnv().CRM_API_URL + '/Account/InsertTelegramChatId',
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
         const title = `Lỗi CRM BOT \n`;
         const time = `Thời gian: ${getToDateString()} \n`;
         const command = 'Command: /task \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${command}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });

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
            getEnv().CRM_API_URL + '/UpdateTelegramChatId',
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
         const title = `Lỗi CRM BOT \n`;
         const time = `Thời gian: ${getToDateString()} \n`;
         const command = 'Command: /change \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${command}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });

         bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
            parse_mode: 'HTML',
         });
      }
   });

   bot.onText(/\/r/, (msg) => {
      try {
         console.log(msg);

         bot.sendMessage(msg?.chat?.id, 'reply', {
            parse_mode: 'HTML',
         });
      } catch (error) {
         const title = `Lỗi CRM BOT \n`;
         const time = `Thời gian: ${getToDateString()} \n`;
         const command = 'Command: /start \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${command}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });

         bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
            parse_mode: 'HTML',
         });
      }
   });
};

module.exports = CRM;
