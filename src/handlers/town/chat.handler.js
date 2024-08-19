import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket, getAllUsers } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';
import { splitAtFirstSpace } from '../../utils/parser/messageParser.js';
import chatCommandMappings from './chatCommands/chatCommandMappings.js';
import { chatEventMappings } from '../../Lambda/eventMapping.js';
import { PROCESSING_EVENTS } from '../../Lambda/worldChat.js';

const chatHandler = async ({ socket, payload }) => {
  const { playerId, chatMsg } = payload;
  try {
    const sender = await getUserBySocket(socket);
    if (!sender) throw new Error('유저를 찾을 수 없습니다.');

    const gameSession = getGameSession(config.session.townId);
    if (!gameSession) throw new Error('게임 세션을 찾을 수 없습니다.');

    // '/'으로 시작하면 채팅 명령어, 그렇지 않으면 전체 채팅으로 판단한다.
    if (chatMsg[0] === '/') {
      const { firstPart: commandType, secondPart: message } = splitAtFirstSpace(chatMsg);

      // 해당 커멘트에 맞는 핸들러를 가져오고 실행합니다.
      const chatCommandHandler = chatCommandMappings.get(commandType);
      if (!chatCommandHandler) {
        const invalidCommandResponse = createResponse('response', 'S_Chat', {
          playerId: sender.playerId,
          chatMsg: `[System] 존재하지 않는 명령어입니다. /help로 확인하세요.`,
        });
        socket.write(invalidCommandResponse);
        return;
      }

      // 해당 명령어 핸들러 실행
      chatCommandHandler(sender, message);
    } else {
      sendMessageToAll(sender, chatMsg);
    }
  } catch (err) {
    handleError(socket, err.message, '채팅 전송 중 에러가 발생했습니다: ' + err.message);
  }
};

export async function sendMessageToAll(sender, message) {
  try {
    const allUsers = getAllUsers();

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[All] ${sender.nickname}: ${message}`,
    });

    allUsers.forEach((user) => {
      user.socket.write(chatResponse);
    });

    // 현재 진행 중인 이벤트에 해당하는 eventId가 존재하는 경우 실행
    for (const e of PROCESSING_EVENTS) {
      if (chatEventMappings.hasOwnProperty(e.eventId)) {
        console.log('event: ', e);
        chatEventMappings[e.eventId]({ sender, message });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export default chatHandler;
