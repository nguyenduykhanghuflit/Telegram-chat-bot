require('dotenv').config();
const environment = process.env.NODE_ENV || 'development';
console.log('Môi trường hiện tại: ' + process.env.NODE_ENV);
require('dotenv').config({
   path: environment === 'production' ? '.env.production' : '.env.dev',
});
const {
   CRM_API_URL,
   CRM_BOT_TOKEN,
   CRM_BOT_ID,
   MF_API_URL,
   MF_BOT_TOKEN,
   MF_BOT_ID,
   MY_CHAT_ID,
   LOG_BOT_TOKEN,
} = process.env;

const getEnv = () => {
   return {
      CRM_API_URL,
      CRM_BOT_TOKEN,
      CRM_BOT_ID,
      MF_API_URL,
      MF_BOT_TOKEN,
      MF_BOT_ID,
      MY_CHAT_ID,
      LOG_BOT_TOKEN,
   };
};

module.exports = getEnv;
