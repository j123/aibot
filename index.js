if (!process.env.token || !process.env.aiapi) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const Botkit = require('botkit');
const request = require('request');

const chatBotToken = process.env.aiapi;
const controller = Botkit.slackbot({
  debug: true,
});

const bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.hears('(.*)', 'direct_message, direct_mention, mention', (bot, message) => {
  const options = {
    url: ' https://chatbot-api.userlocal.jp/api/chat',
    method: 'POST',
    json: true,
    form: {
      'key': chatBotToken,
      'message': message.match[0]
    }
  }

  request(options, (err, res, body) => {
    if (!err && res.statusCode == 200 && body.status == 'success') {
      bot.replyWithTyping(message, body.result);
    } else {
      console.log(err);
      bot.replyWithTyping(message, '今は何も話したくありません:zipper_mouth_face:');
    }
  });

});
