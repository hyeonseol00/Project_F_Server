import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket, getUserByNickname, getAllUsers } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';

const chatHandler = async ({ socket, payload }) => {
  const { playerId, chatMsg } = payload;
  try {
    const user = getUserBySocket(socket);
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    const gameSession = getGameSession(config.session.townId);
    if (!gameSession) throw new Error('게임 세션을 찾을 수 없습니다.');

    // 채팅 명령어를 파싱합니다.
    const { messageType, target, message } = parseCommand(chatMsg);

    if (messageType === 'DM') {
      sendDirectMessage(user, target, message);
    } else {
      sendGlobalMessage(user, chatMsg); // 기본적으로 전체 채팅으로 처리
    }

  } catch (err) {
    console.error('채팅 전송 중 에러가 발생했습니다:', err.message);
    handleError(socket, err.message, '채팅 전송 중 에러가 발생했습니다: ' + err.message);
  }
};

function sendDirectMessage(sender, recipientNickname, message) {
  const recipient = getUserByNickname(recipientNickname);

  if (!recipient) {
    console.error(`Recipient not found: ${recipientNickname}`);
    return;
  }

  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: message,
  });

  try {
    sender.socket.write(chatResponse); // 발신자에게 메시지 전송
    recipient.socket.write(chatResponse); // 수신자에게 메시지 전송

    console.log(`DM from ${sender.nickname} to ${recipient.nickname}: ${message}`);
    console.log(`Message sent to recipient's socket: ${recipient.socket}`);
  } catch (error) {
    console.error(`Failed to send message to recipient: ${error.message}`);
  }
}

function sendGlobalMessage(sender, message) {
  const allUsers = getAllUsers();

  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: message,
  });

  allUsers.forEach(user => {
    user.socket.write(chatResponse);
  });

  console.log(`Global message from ${sender.nickname}: ${message}`);
}

function parseCommand(command) {
  const parts = command.split(' ');
  const commandType = parts[0].toLowerCase();
  let target = '';
  let message = command;

  if (commandType === '/w') {
    target = parts[1];
    message = parts.slice(2).join(' ');
    return { messageType: 'DM', target, message };
  }

  return { messageType: 'GLOBAL', target, message: command }; // 기본적으로 전체 채팅으로 처리
}

export default chatHandler;



