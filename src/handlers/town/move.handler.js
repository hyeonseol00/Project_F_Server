import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getAllUsers, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { setPosition } from '../../classes/DBgateway/playerinfo.gateway.js';

const moveTownHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const users = gameSession.users;
    const { transform } = payload;
    const curUser = await getUserBySocket(socket);

    await setPosition(socket.remotePort);

    const moveTownResponse = createResponse('response', 'S_Move', {
      playerId: curUser.playerId,
      transform,
    });

    for (const user of users) {
      if (user.playerId === curUser.playerId) continue;
      user.socket.write(moveTownResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default moveTownHandler;
