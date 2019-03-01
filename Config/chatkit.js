const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
  instanceLocator: process.env.INSTANCE_CHATKIT,
  key: process.env.CHATKIT_KEY,
});

module.exports = chatkit;
