const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:3dd62a71-d604-4985-bbb9-5965ea8bb128',
  key: '9afdfeff-5567-44d3-a4f7-1151f41f3b9c:oNwWBHRK1qrpXjZBMQmyw0I1iSg/l34bhLEI9AU6/2w=',
});

module.exports = chatkit;
