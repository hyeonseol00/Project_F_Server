import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterHatcheryHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const user = getUserBySocket(socket);

    const enterHatcheryResponse = createResponse('response', 'S_EnterHatchery', {
      player: user.getPlayerInfo(),
    });

    socket.write(enterHatcheryResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterHatcheryHandler;
