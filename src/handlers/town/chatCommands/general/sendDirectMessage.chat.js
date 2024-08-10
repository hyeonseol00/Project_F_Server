import { createResponse } from '../../../../utils/response/createResponse.js';
import { getUserByNickname } from '../../../../session/user.session.js';
import { notFoundUser, targetToSelf, checkParams } from '../exceptions.js';

export const sendDirectMessage = (sender, message) => {
  const params = message.split(' ');
  const expectedParamsN = 2;
  const recipientNickname = params[0];
  const msg = params[1];

  const recipient = getUserByNickname(recipientNickname);

  if (
    checkParams(sender, params, expectedParamsN) ||
    targetToSelf(sender, recipient) ||
    notFoundUser(sender, recipient)
  ) {
    return;
  }

  const senderChatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[DM] To_${recipient.nickname}: ${msg}`,
  });

  const recipientChatResponse = createResponse('response', 'S_Chat', {
    playerId: recipient.playerId,
    chatMsg: `[DM] ${sender.nickname}: ${msg}`,
  });

  try {
    sender.socket.write(senderChatResponse); // 발신자에게 메시지 전송
    recipient.socket.write(recipientChatResponse); // 수신자에게 메시지 전송
  } catch (error) {
    console.error(`상대방에게 메시지를 보내지 못했습니다: ${error.msg}`);
  }
};
