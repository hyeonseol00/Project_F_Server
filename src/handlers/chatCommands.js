import { sendDirectMessage } from "./town/chatCommand.handler.js";

const chatCommands = new Map([
  [
    'w', sendDirectMessage
  ],
  // [
  //   'team',
  //   function (rawMsg, teamId) {
  //     const msg = `[팀] ${rawMsg}`;
  //     return msg;
  //   },
  // ],
  
]);

export default chatCommands;
