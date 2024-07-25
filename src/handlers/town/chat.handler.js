import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse, createResponseAsync } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';

const chatHandler = async ({ socket, payload }) => {
  const { playerId, chatMsg } = payload;
  try {
    const user = getUserBySocket(socket);
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    // 게임 세션을 가져온다. 만약 게임 세션이 없다면 해당 사실을 알린다.
    const gameSession = getGameSession(config.session.townId);
    if (!gameSession) throw new Error('게임 세션을 찾을 수 없습니다.');

    console.log('chatMsg:', chatMsg);

    const chatResponse = await createResponseAsync('response', 'S_Chat', {
      playerId,
      chatMsg,
    });

    // 게임 세션에 저장된 모든 유저에게 전송합니다.
    for (const user of gameSession.users) {
      user.socket.write(chatResponse);
    }
  } catch (err) {
    console.error('채팅 전송 중 에러가 발생했습니다:', err.message);
    handleError(socket, err.message, '채팅 전송 중 에러가 발생했습니다: ' + err.message);
  }
};

export default chatHandler;
