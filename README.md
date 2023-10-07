# Anonymous-Tg-Bot
To create a Node.js Telegram bot that behaves as you described, you can use the [`node-telegram-bot-api`](https://www.npmjs.com/package/node-telegram-bot-api) library and manage conversations using a state machine approach. Here's a step-by-step guide on how to create such a bot:

1. **Set Up Your Telegram Bot:**

   - Create a Telegram bot and obtain the bot token from the [BotFather](https://telegram.me/BotFather) on Telegram.
   - use command `/newbot` to get a new bot and the token.
   - Make sure you're the owner of the bot.

2. **Create a Node.js Project:**

   - Install [Node.js](https://nodejs.org/en) on your device. 
   - Set up a Node.js project repo if you haven't already.
   - add an `index.js` main file.
   - set `package.json` file to set dependencies.
   
   ```bash
   npm init
   ```
   

4. **Install Required Packages:**

   - Install the `node-telegram-bot-api` package for interacting with the Telegram Bot API.

   ```bash
   npm install node-telegram-bot-api
   ```
   
   Optional Installation
   - Install the [`dotenv`](https://www.npmjs.com/package/dotenv) environmenr variable package for Telegram Bot Token and Owner UserID.

   ```bash
   npm install dotenv
   ```
   
5. **Initialize Your Bot:**

   Initialize your bot, and define a state machine to manage conversations. You can use an object to store the state of each user's conversation.

   In Main `index.js` File
   
   ```javascript
   const TelegramBot = require('node-telegram-bot-api');
   require("dotenv").config();
   const token = process.env["BOT_TOKEN"]; // Replace with your bot token
   const ownerUserId = process.env["OWNER_USER_ID"]; // Owner User ID
   
   const bot = new TelegramBot(token, { polling: true });

   // Your Code Main Functionality 
   ```
   
   In Main `.env` File
   
   ```javascript
   BOT_TOKEN = asdfghjklsnsnffnjkfsdnjkffnsjfsnf //Your Token
   OWNER_USER_ID = 123456789 // Your UserId 
   ```

   To get `UserId` You Can `Google` About It Like How A TG User Can Get To Know Their User Id.

7. **Run Your Bot:**

   Start your Node.js application to run the bot.

   ```bash
   node index.js
   ```

With this setup, when the owner starts the bot, they can provide a user ID to send a message, and then the message text. Users can start conversations by sending any message. Conversations continue until the owner uses `/end`. You can customize and expand this bot as needed for your use case.
