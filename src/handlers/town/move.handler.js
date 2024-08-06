import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const moveTownHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const users = gameSession.users;
    const { transform } = payload;

    // console.log(
    //   `transform: x: ${transform.posX}, y: ${transform.posY}, z: ${transform.posZ}, angle: ${transform.rot}`,
    // );

    const curUser = getUserBySocket(socket);

    curUser.updatePosition(transform);

    const moveTownResponse = createResponse('response', 'S_Move', {
      playerId: curUser.playerId,
      transform,
    });

    for (const user of users) {
      if (user.playerId === curUser.playerId) continue;
      // console.log("이동 패킷을 받는 다른 유저: ", user.playerId);
      user.socket.write(moveTownResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default moveTownHandler;
