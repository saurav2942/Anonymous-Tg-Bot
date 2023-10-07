# Anonymous-Tg-Bot
To create a Node.js Telegram bot that behaves as you described, you can use the `node-telegram-bot-api` library and manage conversations using a state machine approach. Here's a step-by-step guide on how to create such a bot:

1. **Set Up Your Telegram Bot:**

   - Create a Telegram bot and obtain the bot token from the BotFather on Telegram.
   - Make sure you're the owner of the bot.

2. **Create a Node.js Project:**

   Set up a Node.js project if you haven't already.

3. **Install Required Packages:**

   Install the `node-telegram-bot-api` package for interacting with the Telegram Bot API.

   ```bash
   npm install node-telegram-bot-api
   ```

4. **Initialize Your Bot:**

   Initialize your bot, and define a state machine to manage conversations. You can use an object to store the state of each user's conversation.

   ```javascript
   const TelegramBot = require('node-telegram-bot-api');

   const botToken = 'YOUR_BOT_TOKEN';
   const bot = new TelegramBot(botToken, { polling: true });

   const conversations = {}; // To store the state of conversations

   bot.on('message', (msg) => {
     const chatId = msg.chat.id;
     const text = msg.text;

     if (text === '/start') {
       // Check if the owner is starting a new conversation
       if (msg.from.id === OWNER_USER_ID) {
         conversations[chatId] = { state: 'awaitingUserId' };
         bot.sendMessage(chatId, 'Please enter the user ID to whom you want to send a message:');
       } else {
         // User starting a conversation
         conversations[chatId] = { state: 'awaitingMessage' };
         bot.sendMessage(OWNER_USER_ID, `New conversation initiated by User ${msg.from.username} (${msg.from.id}). Please send your message:`);
       }
     } else if (text === '/end') {
       // End the conversation
       delete conversations[chatId];
       bot.sendMessage(chatId, 'Conversation ended. You can start a new one by typing /start.');
     } else {
       // Handle conversation messages
       if (conversations[chatId]) {
         const { state } = conversations[chatId];
         if (state === 'awaitingUserId' && msg.from.id === OWNER_USER_ID) {
           // Owner provides the user ID to send a message to
           conversations[chatId].userIdToMessage = text;
           conversations[chatId].state = 'awaitingMessage';
           bot.sendMessage(chatId, 'Please enter the message you want to send:');
         } else if (state === 'awaitingMessage') {
           // Send messages between owner and user
           const recipientId = (msg.from.id === OWNER_USER_ID) ? conversations[chatId].userIdToMessage : OWNER_USER_ID;
           bot.sendMessage(recipientId, text);
         }
       }
     }
   });

   bot.on('polling_error', (error) => {
     console.error(error);
   });

   const OWNER_USER_ID = 123456789; // Replace with the actual owner's user ID
   ```

5. **Run Your Bot:**

   Start your Node.js application to run the bot.

   ```bash
   node your_bot_script.js
   ```

With this setup, when the owner starts the bot, they can provide a user ID to send a message, and then the message text. Users can start conversations by sending any message. Conversations continue until the owner uses `/end`. You can customize and expand this bot as needed for your use case.
