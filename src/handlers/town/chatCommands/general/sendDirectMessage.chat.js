import { createResponse } from '../../../../utils/response/createResponse.js';
import { getUserByNickname } from '../../../../session/user.session.js';
import { notFoundUser, targetToSelf, includeInvalidParams } from '../exceptions.js';
import { splitAtFirstSpace } from '../../../../utils/parser/messageParser.js';

export const sendDirectMessage = async (sender, message) => {
  const { firstPart: recipientNickname, secondPart: msg } = splitAtFirstSpace(message);
  const params = [recipientNickname, msg];
  const recipient = await getUserByNickname(recipientNickname);
  const recipientInfo = await getPlayerInfo(recipient.socket);
  const senderInfo = await getPlayerInfo(sender.socket);

  // 예외처리
  if (
    includeInvalidParams(sender, params) ||
    targetToSelf(sender, recipientInfo) ||
    notFoundUser(sender, recipient)
  ) {
    return;
  }

  const senderChatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[DM] To_${recipientInfo.nickname}: ${msg}`,
  });

  const recipientChatResponse = createResponse('response', 'S_Chat', {
    playerId: recipient.playerId,
    chatMsg: `[DM] ${senderInfo.nickname}: ${msg}`,
  });

  try {
    sender.socket.write(senderChatResponse); // 발신자에게 메시지 전송
    recipient.socket.write(recipientChatResponse); // 수신자에게 메시지 전송
  } catch (error) {
    console.error(`상대방에게 메시지를 보내지 못했습니다: ${error.msg}`);
  }
};
