import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { getGameSession } from '../../session/game.session.js';
import { config } from '../../config/config.js';

const animHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserBySocket(socket);
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    const session = getGameSession(config.session.townId);
    if (!session) throw new Error('게임 세션을 찾을 수 없습니다.');

    const animationResponse = createResponse('response', 'S_Animation', {
      playerId: user.playerId,
      animCode: payload.animCode,
    });

    // 게임 세션에 저장된 모든 유저에게 전송합니다.
    for (const user of session.users) {
      user.socket.write(animationResponse);
    }
  } catch (err) {
    console.error('애니메이션 처리 중 에러가 발생했습니다:', err.message);
    handleError(socket, err.message, '애니메이션 처리 중 에러가 발생했습니다: ' + err.message);
  }
};

export default animHandler;
