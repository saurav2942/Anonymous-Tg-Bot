const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
// console.log(process.env);
const token = process.env["BOT_TOKEN"];
const ownerUserId = process.env["OWNER_USER_ID"];
// console.log(token, ownerUserId);
const bot = new TelegramBot(token, { polling: true });

const conversations = {}; // To store the state of conversations
let fl = false;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userFullName = msg.chat.first_name + " " + msg.chat.last_name;
  const userName = msg.chat.username;
  const userId = msg.from.id;
  // console.log("start", conversations);
  // In between Conversation
  if (fl) {
    if (userId == ownerUserId) {
      // Check if the owner is starting a new conversation in between a conversation
      console.log(
        `\n<\nOwner trying to start a new conversation In Between A Conversation\n>\n`
      );
      bot.sendMessage(
        chatId,
        `Invalid Command\n\nYou Are Already In Between A Conversation with user ${conversations[chatId].userIdToMessage}`
      );
    } else {
      // User using this command in b/w a conversation
      bot.sendMessage(userId, `Invalid Command\nOnly The Owner Can Use It`);
      console.log(
        `\n<\nUser trying to start a new conversation In Between A Conversation\n>\n`
      );
    }
  }
  // conversation is not started yet by owner
  else {
    if (userId == ownerUserId) {
      fl = true;
      console.log(`\n<\nYou Started A New Conversation\n>\n`);
      console.log("Start", conversations);
      // Check if the owner is starting a new conversation
      conversations[ownerUserId] = { state: "awaitingUserId" };
      bot.sendMessage(
        chatId,
        "Please enter the user ID to whom you want to send a message:"
      );
    } else {
      // User starting a conversation
      bot.sendMessage(userId, `Invalid Command\nOnly The Owner Can Use It`);
      console.log(
        `\n<\nUser trying to start a new conversation\n\nUser Details As Follows\nUsername - ${userName} \n\nUserID - ${userId} \n\n Full Name - ${userFullName}\n>\n`
      );
    }
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userFullName = msg.chat.first_name + " " + msg.chat.last_name;
  const userName = msg.chat.username;
  const userId = msg.from.id;
  const text = msg.text;
  // console.log("message", conversations, "\n");
  // Handle conversation messages
  if (text !== "/start" && text !== "/end" && fl) {
    const state = conversations[ownerUserId].state;
    if (state == "awaitingUserId") {
      // Owner provides the user ID to send a message to
      //{owner : {state, userid}}
      conversations[ownerUserId].userIdToMessage = +text;
      conversations[ownerUserId].state = "awaitingMessage";
      console.log(
        `\n<\nDefault message sent to user:- ${conversations[ownerUserId].userIdToMessage}\n>\n`
      );
      console.log("Default Msg", conversations);
      bot.sendMessage(
        conversations[ownerUserId].userIdToMessage,
        "This Message Is From @CourseH_bot And It's Owner Regarding Your Query\n\nPlease enter the message you want to send:"
      );
      bot.sendMessage(
        ownerUserId,
        `Default message sent to user:- ${conversations[ownerUserId].userIdToMessage}`
      );
    } else {
      // Send messages between owner and user
      const recipientId =
        userId == ownerUserId
          ? conversations[ownerUserId].userIdToMessage
          : ownerUserId;

      if (recipientId == ownerUserId)
        console.log("\n<\nuser has sent a message to owner\n>\n");
      else
        console.log(
          `\n<\nowner has sent a message to user:- ${conversations[ownerUserId].userIdToMessage}\n>\n`
        );

      console.log("Normal Msg", conversations);

      // user sending text
      if (userId != ownerUserId) {
        bot.sendMessage(
          recipientId,
          `User Has Sent A Message :-\n\nUser Details As Follows :-\nUsername - ${userName} \n\nUserID - ${userId} \n\n Full Name - ${userFullName}\n\nMessage :- ${text}`
        );
        bot.sendMessage(
          userId,
          `Your Message Has Sent To The Owner!\n He Will Reply In Some Time`
        );
      } else {
        bot.sendMessage(recipientId, `Owner Has Sent A Message: \n${text}`);
        bot.sendMessage(userId, `Your Message Has Sent To The User!`);
      }
    }
  }
});

// Custom command /end to end conversation
bot.onText(/\/end/, (msg) => {
  const chatId = msg.chat.id;
  // const userFullName = msg.chat.first_name + " " + msg.chat.last_name;
  // const userName = msg.chat.username;
  const userId = msg.from.id;
  // const text = msg.text;
  // In Between Conversation
  if (fl) {
    if (userId == ownerUserId) {
      fl = false;
      // Check if the owner is using this command
      console.log(`\n<\nOwner Has Ended The Conv\n>\n`);
      console.log("End", conversations);
      bot.sendMessage(
        chatId,
        "You Have Ended The Conversion Use Command /start To Start A New Conversion"
      );
      try {
        delete userData[chatId];
        delete userData[conversations[ownerUserId].userIdToMessage];
      } catch {
        console.log("<\nUser Data Not Found Can't Delete\n>");
      }
    } else {
      // User is using this command
      console.log(`\n<\nUser Trying to end conv\n>\n`);
      bot.sendMessage(
        userId,
        `Invalid Command\n\nOnly Owner Can End The Conversation\nYou Can Just Send Messages Only`
      );
    }
  }
  // Conversation is not started yet
  else {
    if (userId == ownerUserId) {
      // Check if the owner is using this command
      console.log(`\n<\nOwner is trying to end A ghost\n>\n`);
      bot.sendMessage(
        chatId,
        "Invalid Command\n\nConversation Is Not Started Yet\nPlease Start A New Conversation"
      );
    } else {
      // User is using this command
      console.log(`\n<\nuser trying to end ghost\n>\n`);
      bot.sendMessage(
        userId,
        `Owner Has Ended The Conversation OR Owner Has Not Started Any New Conversation`
      );
    }
  }
});

// Handle errors
bot.on("polling_error", (error) => {
  console.error(error);
});

console.log("\n<\nBot is running...\n>\n");
