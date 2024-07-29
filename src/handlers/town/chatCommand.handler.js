
import { getUserByNickname } from "../../session/user.session.js";
import { createResponse } from '../../utils/response/createResponse.js';

export const sendDirectMessage = (sender, message) => {

  const firstSpaceIdx = message.indexOf(' ');
  const recipientNickname = message.substring(0, firstSpaceIdx); // /w, /team 같은 명령어 파싱
  const msg = message.substring(firstSpaceIdx + 1);     

  const recipient = getUserByNickname(recipientNickname);

  if (!recipient) {
    console.error(`Recipient not found: ${recipientNickname}`);
    return;
  }

  const senderChatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[To.${sender.nickname}] ${msg}`,
  });

  const recipientChatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[From.${sender.nickname}] ${msg}`,
  });

  try {
    sender.socket.write(senderChatResponse);       // 발신자에게 메시지 전송
    recipient.socket.write(recipientChatResponse); // 수신자에게 메시지 전송

    // console.log(`DM from ${sender.nickname} to ${recipient.nickname}: ${msg}`);
    // console.log(`Message sent to recipient's socket: ${recipient.socket}`);
  } catch (error) {
    console.error(`Failed to send message to recipient: ${error.msg}`);
  }
};
