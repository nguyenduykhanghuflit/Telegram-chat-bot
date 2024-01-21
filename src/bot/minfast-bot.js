const { sendRequest, getToDateString } = require('../common/core');
const getEnv = require('../common/env');
const MIN_FAST = (bot, logBot) => {
   bot.onText(/\/start/, (msg) => {
      const chatId = msg?.chat?.id;
      try {
         const msgTemplate = `
         <b> 👋👋Chào mừng bạn đã đến với GLS MIN-FAST BOT 🙋🙋</b>
          ➡️ Bot sẽ gửi thông tin dữ liệu min-fast đến bạn vào mỗi ngày
          ➡️ Để sử dụng vui lòng nhập lệnh
            <code>minfast</code>
          ➡️ Để tắt nhận thông báo
            <code>off_minfast</code>
      `;

         bot.sendMessage(chatId, msgTemplate, {
            parse_mode: 'HTML',
         });
      } catch (error) {
         const title = `Lỗi MIN-FAST BOT \n`;
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

   bot.onText(/\/minfast/, async (msg, match) => {
      const chatId = msg?.chat?.id;
      try {
         const result = await sendRequest(
            getEnv().MF_API_URL + '/RegisterNotifyTelegram?chatId=' + chatId,
            'GET'
         );

         if (result.Success) {
            bot.sendMessage(chatId, result.Msg, {
               parse_mode: 'HTML',
            });
         } else {
            bot.sendMessage(chatId, 'Lỗi server vui lòng thử lại sau', {
               parse_mode: 'HTML',
            });
         }
      } catch (error) {
         const title = `Lỗi MIN-FAST BOT \n`;
         const time = `Thời gian: ${getToDateString()} \n`;
         const command = 'Command: /minfast \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${command}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });

         bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
            parse_mode: 'HTML',
         });
      }
   });
};

module.exports = MIN_FAST;
