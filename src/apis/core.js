const {
   BASE_API_ENDPOINT,
   BOT_TYPE,
   PART_MODE_TYPE,
} = require('../common/const');

const {
   getToDateString,
   getYesterdayDate,
   apiOk,
   apiErr,
   checkRequiredFields,
} = require('../common/core');

const getEnv = require('../common/env');

const coreAPIs = (app, crmBot, minFastBot, logBot) => {
   app.get('/', (req, res) => {
      const msg = '🚀 🚀 Hello, Telegram bot is running on port 8990 🚀 🚀';
      return apiOk(res, msg, 200, 'Develop by KhangNguyen');
   });

   app.get(`${BASE_API_ENDPOINT}/send-message`, (req, res) => {
      let { msg, chat_id, parse_mode, bot_type } = req.query;
      try {
         const { status, errors } = checkRequiredFields({
            msg,
            chat_id,
            bot_type,
         });

         if (!status) return apiErr(res, errors, 400);

         if (!BOT_TYPE.includes(bot_type))
            return apiErr(
               res,
               "bot_type invalid, bot_type must be in the following list ['crm', 'minfast']",
               400
            );

         if (!PART_MODE_TYPE.includes(parse_mode)) parse_mode = undefined;

         switch (bot_type) {
            case 'crm':
               crmBot.sendMessage(chat_id, msg, { parse_mode });
               break;
            case 'minfast':
               minFastBot.sendMessage(chat_id, msg, { parse_mode });
               break;
            default:
               break;
         }

         return apiOk(res);
      } catch (error) {
         const title = `Lỗi API Gửi thông báo (${bot_type})\n`;
         const time = `Thời gian: ${getToDateString()} \n`;
         const api = 'API: /send-message \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${api}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });
         return apiErr(res, 'Server Error', 500, error.message);
      }
   });

   app.post(`${BASE_API_ENDPOINT}/min-fast/send-data`, (req, res) => {
      try {
         const {
            title,
            chatId,
            totalSuccess,
            totalFailure,
            listBranchSuccess,
            listBranchFailure,
         } = req.body;

         let detailErr = '';

         listBranchFailure.forEach((element, idx) => {
            const errCheck = element.errorCheck
               ? `Doanh thu: ${element.errorCheck},`
               : '';

            const errorCheckEod = element.errorCheckEod
               ? `EOD: ${element.errorCheckEod}`
               : '';

            const errLine = ` <b>${idx + 1}: ${
               element.branchName
            }</b>\n \t \t <i> => ${errCheck} ${errorCheckEod}</i>\n`;

            detailErr += errLine;
         });

         const msgTemplate = {
            title: `<b>${title} (Dữ liệu ngày ${getYesterdayDate()} )</b>`,
            countBranchSuccess: `\n \t- Số chi nhánh thành công: <b>${totalSuccess}</b>`,
            countBranchFailure: `\n \t- Số chi nhánh thất bại: <b>${totalFailure}</b>`,
            detail: `\n \t- Chi tiết:`,
            detailErr: `\n \t \t ${detailErr}`,
         };

         const msg = `${msgTemplate.title}${msgTemplate.countBranchSuccess}${msgTemplate.countBranchFailure}${msgTemplate.detail}${msgTemplate.detailErr}`;

         minFastBot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
         return apiOk(res);
      } catch (error) {
         const title = 'Lỗi API Min-FAST \n';
         const time = `Thời gian: ${getToDateString()} \n`;
         const api = 'API: /min-fast/send-data \n';
         const err = `Chi tiết: \n\t => ${error.toString()} \n`;
         const msg = `${title}${time}${api}${err}`;
         logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });

         return apiErr(res, 'Server Error', 500, error.toString());
      }
   });
};

module.exports = coreAPIs;
