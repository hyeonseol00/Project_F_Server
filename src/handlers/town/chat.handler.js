import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket, getAllUsers } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import chatCommandMappings from './chatCommands/chatCommandMappings.js';

const chatHandler = async ({ socket, payload }) => {
  const { playerId, chatMsg } = payload;
  try {
    const user = getUserBySocket(socket);
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    const gameSession = getGameSession(config.session.townId);
    if (!gameSession) throw new Error('게임 세션을 찾을 수 없습니다.');

    // '/'으로 시작하면 채팅 명령어, 그렇지 않으면 전체 채팅으로 판단한다.
    if (chatMsg[0] === '/') {
      const { commandType, message } = parseCommandMessage(chatMsg);

      // 해당 커멘트에 맞는 핸들러를 가져오고 실행합니다.
      const chatCommandHandler = chatCommandMappings.get(commandType);
      if (!chatCommandHandler) {
        const invalidCommandResponse = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] 존재하지 않는 명령어입니다. /help로 확인하세요.`,
        });
        socket.write(invalidCommandResponse);
        return;
      }

      // 해당 명령어 핸들러 실행
      chatCommandHandler(user, message);

    } else {
      sendMessageToAll(user, chatMsg);
    }
    
  } catch (err) {
    handleError(socket, err.message, '채팅 전송 중 에러가 발생했습니다: ' + err.message);
  }
};

function parseCommandMessage(command) {
  const firstSpaceIdx = command.indexOf(' ');
  const commandType = firstSpaceIdx !== -1 ? command.substring(0, firstSpaceIdx) : command;
  const message = firstSpaceIdx !== -1 ? command.substring(firstSpaceIdx + 1) : null;

  return { commandType, message };
}

function sendMessageToAll(sender, message) {
  const allUsers = getAllUsers();

  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[All] ${sender.nickname}: ${message}`,
  });

  allUsers.forEach((user) => {
    user.socket.write(chatResponse);
  });

}

export default chatHandler;
