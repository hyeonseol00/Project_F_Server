import { countingUserChat } from './event/handler/userChat.event.js';
import { getUserChat } from './event/handler/quizTime.event.js';
import { chatEventHandler } from './event/handler/userChat.event.js';
import { quizTimeHandler } from './event/handler/quizTime.event.js';

export const chatEventMappings = {
  1: countingUserChat,
  2: getUserChat,
};

export const chatHandlerMappings = {
  1: chatEventHandler,
  2: quizTimeHandler,
};
