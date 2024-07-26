import { config } from '../../config/config.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const leaveTownHandler = async (socket, curUser) => {
  const gameSession = getGameSession(config.session.townId);

  try {
    // 게임 세션에 저장된 모든 플레이어의 정보를 가져옴
    const playerIds = [];
    playerIds.push(curUser.playerId);

    // 각 유저에게 본인을 제외한 해당 플레이어 아이디 전송
    for (const user of gameSession.users) {
      // 해당 유저에게 다른 유저들을 스폰(해당 유저 제외)
      const despawnTownResponse = createResponse('response', 'S_Despawn', {
        playerIds,
      });

      user.socket.write(despawnTownResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveTownHandler;
