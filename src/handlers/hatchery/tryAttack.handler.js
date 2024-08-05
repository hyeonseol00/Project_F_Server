import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const tryAttackHatchery = async ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    const players = hatcherySession.players;

    const tryAttackResponse = createResponse('response', 'S_MoveAtHatchery', {
      playerId: user.playerId,
    });

    for (const player of players) {
      if (player.playerId === user.playerId) {
        continue;
      }
      player.socket.write(tryAttackResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default tryAttackHatchery;
