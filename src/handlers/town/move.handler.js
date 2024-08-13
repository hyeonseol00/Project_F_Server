import { getPlayerInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getAllUsers, getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const moveTownHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const userNicknames = gameSession.playerNicknames;
    const { transform } = payload;
    const curUser = await getUserBySocket(socket);
    const curUserInfo = await getPlayerInfo(socket);

    gameSession.transforms[curUserInfo.nickname] = transform;

    const moveTownResponse = createResponse('response', 'S_Move', {
      playerId: curUser.playerId,
      transform,
    });

    for (const userNickname of userNicknames) {
      const user = getUserByNickname(userNickname);
      if (user.playerId === curUser.playerId) continue;
      user.socket.write(moveTownResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default moveTownHandler;
