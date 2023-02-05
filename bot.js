require('dotenv').config();
const Telegram = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');

const config = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});

const openai = new OpenAIApi(config);

const bot = new Telegram(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg?.chat?.id, 'Welcome To AI ChatBot');
  bot.sendMessage(
    msg?.chat?.id,
    'Để đặt câu hỏi hãy sử dụng lệnh " /a câu hỏi của bạn "'
  );
});

bot.on('message', async (msg) => {
  const chatId = msg?.chat?.id;

  if (msg.text?.startsWith('/a ')) {
    const reply = await openai.createCompletion({
      max_tokens: 500,
      model: 'text-davinci-003', //tìm hiểu tại:https://platform.openai.com/docs/models/overview
      prompt: msg.text,
      temperature: 0.5,
    });

    bot.sendMessage(chatId, reply?.data?.choices[0]?.text);
  }
});
