const {
   BASE_API_ENDPOINT,
   BOT_TYPE,
   PARSE_MODE_TYPE,
} = require('../common/const');

const {
   getToDateString,
   getYesterdayDate,
   apiOk,
   apiErr,
   checkRequiredFields,
   sendLogErrApi,
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

         if (!PARSE_MODE_TYPE.includes(parse_mode)) parse_mode = undefined;

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
         sendLogErrApi(logBot, title, '/api/send-message', error.toString());

         return apiErr(res, 'Server Error', 500, error.message);
      }
   });

   app.post(`${BASE_API_ENDPOINT}/min-fast/send-data`, async (req, res) => {
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
            const msgCheckRevenue = element.errorCheck
               ? `KT Doanh thu: ${element.errorCheck}`
               : 'KT Doanh thu: ✅ Pass';

            const errEod = element?.errorCheckEod?.split(',');

            let msgCheckEod2 = '',
               msgCheckEod1 = '',
               sign = '';
            if (errEod?.length > 1) {
               const parts = errEod[0].split('- Kí hiệu');
               msgCheckEod1 = parts[0] ? `EOD 1 ngày trước: ${parts[0]}` : null;
               sign = parts[1] ? '-> Kí hiệu ' + parts[1] : 'Fail';
               msgCheckEod2 = `EOD 2 ngày trước: ${errEod[1]}`;
            }
            if (errEod?.length == 1) {
               if (errEod[0].includes('Kí hiệu')) {
                  const parts = errEod[0].split('- Kí hiệu');
                  msgCheckEod1 = parts[0]
                     ? `EOD 1 ngày trước: ${parts[0]}`
                     : 'Fail';
                  sign = parts[1] ? '-> Kí hiệu ' + parts[1] : null;
               } else {
                  msgCheckEod2 = `EOD 2 ngày trước: ${errEod[1]}`;
               }
            }

            msgCheckEod2 = msgCheckEod2 || 'EOD 2 ngày trước: ✅ Pass';
            msgCheckEod1 = msgCheckEod1 || 'EOD 1 ngày trước: ✅ Pass';
            sign = sign || '';
            const rowNum = idx + 1;
            const errLine =
               `${rowNum}: ${element.branchName}` +
               `\n \t \t  => ${msgCheckRevenue}` +
               `\n \t \t  => ${msgCheckEod2}` +
               `\n \t \t  => ${msgCheckEod1}` +
               `\n \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t \t  ${sign} \n \n`;
            if (idx == 0) {
               detailErr += `${errLine}`;
            } else {
               detailErr += `\t \t ${errLine}`;
            }
         });

         const msgTemplate = {
            title: `<b>${title} (Dữ liệu ngày ${getYesterdayDate()} )</b>`,
            countBranchSuccess: `\n \t- Số chi nhánh thành công: <b>${totalSuccess}</b>`,
            countBranchFailure: `\n \t- Số chi nhánh thất bại: <b>${totalFailure}</b>`,
            detail: `\n \t- Chi tiết:`,
            detailErr: `\n \t \t ${detailErr}`,
         };

         const MAX_MESSAGE_LENGTH = 4000;

         let msg = `${msgTemplate.title}${msgTemplate.countBranchSuccess}${msgTemplate.countBranchFailure}${msgTemplate.detail}${msgTemplate.detailErr}`;

         while (msg.length > 0) {
            const messagePart = msg.substring(0, MAX_MESSAGE_LENGTH);
            msg = msg.substring(MAX_MESSAGE_LENGTH);
            await minFastBot.sendMessage(chatId, messagePart, {
               parse_mode: 'HTML',
            });
         }

         return apiOk(res);
      } catch (error) {
         const title = `Lỗi API gửi thông báo check data \n`;
         sendLogErrApi(
            logBot,
            title,
            '/api/min-fast/send-data',
            error.toString()
         );
         return apiErr(res, 'Server Error', 500, error.toString());
      }
   });
};

module.exports = coreAPIs;
