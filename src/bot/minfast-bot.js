const {
   sendRequest,
   getToDateString,
   sendLogErrCmd,
   getYesterdayDate,
} = require('../common/core');
const getEnv = require('../common/env');
const MIN_FAST = (bot, logBot) => {
   bot.onText(/\/start/, (msg) => {
      const { id, first_name, username } = msg?.chat;
      const startMsg = `ChatId: ${id} \nFirstName: ${first_name} \nUserName: ${username}`;

      logBot.sendMessage(
         getEnv().MY_CHAT_ID,
         'Có user mới start bot \n' + startMsg,
         {
            parse_mode: 'HTML',
         }
      );

      try {
         const msgTemplate = `
         <b> 👋👋Chào mừng bạn đã đến với GLS MIN-FAST BOT 🙋🙋</b>
          ➡️ Bot sẽ gửi thông tin dữ liệu min-fast đến bạn vào mỗi ngày
          ➡️ Để sử dụng vui lòng nhập lệnh
            <code>/minfast</code>
      `;

         bot.sendMessage(id, msgTemplate, {
            parse_mode: 'HTML',
         });
      } catch (error) {
         sendLogErrCmd(logBot, undefined, 'start', error.toString());
         bot.sendMessage(id, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
            parse_mode: 'HTML',
         });
      }
   });

   bot.onText(/\/minfast/, async (msg, match) => {
      const { id, first_name, username } = msg?.chat;
      const startMsg = `ChatId: ${id} \nFirstName: ${first_name} \nUserName: ${username}`;

      logBot.sendMessage(
         getEnv().MY_CHAT_ID,
         'Có user mới đăng ký nhận thông báo \n' + startMsg,
         {
            parse_mode: 'HTML',
         }
      );

      try {
         const result = await sendRequest(
            getEnv().MF_API_URL +
               '/CheckMinFast/RegisterNotifyTelegram?chatId=' +
               id,
            'GET'
         );

         if (result.Success) {
            bot.sendMessage(id, result.Msg, {
               parse_mode: 'HTML',
            });
         } else {
            sendLogErrCmd(logBot, undefined, 'minfast', result);
            bot.sendMessage(
               id,
               'Lỗi không đăng ký nhận thông báo được, vui lòng thử lại sau',
               {
                  parse_mode: 'HTML',
               }
            );
         }
      } catch (error) {
         sendLogErrCmd(logBot, undefined, 'minfast', error.toString());
         bot.sendMessage(chatId, 'Bot gặp lỗi, vui lòng thử lại sau!!', {
            parse_mode: 'HTML',
         });
      }
   });
};

module.exports = MIN_FAST;
