const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const corsOptions = {
   origin: '*',
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
   express.urlencoded({
      extended: true,
   })
);
app.use(express.json());

const Telegram = require('node-telegram-bot-api');
const getEnv = require('./src/common/env');
const CRM = require('./src/bot/crm-bot');
const MIN_FAST = require('./src/bot/minfast-bot');
const coreAPIs = require('./src/apis/core');

//* Mỗi 1 token chỉ được sử dụng cho 1 instance của bot và chỉ sử dụng ở 1 nơi
//* Trong quá trình dev nên tạo 1 bot riêng để dev và độc lập với bot ở production

const crmBot = new Telegram(getEnv().CRM_BOT_TOKEN, { polling: true });

const minFastBot = new Telegram(getEnv().MF_BOT_TOKEN, { polling: true });

const logBot = new Telegram(getEnv().LOG_BOT_TOKEN, { polling: true });

//lắng nghe các sự kiện ở CRM BOT
CRM(crmBot, logBot);

//lắng nghe các sự kiện ở MIN_FAST BOT
MIN_FAST(minFastBot, logBot);

coreAPIs(app, crmBot, minFastBot, logBot);

app.listen(getEnv().PORT || 8990, () => {
   const msg = `🚀 🚀 ~ Telegram bot service is running on port ${
      getEnv().PORT || 8990
   } 🚀 🚀`;

   console.log(msg);
   logBot.sendMessage(getEnv().MY_CHAT_ID, msg, { parse_mode: 'HTML' });
});
