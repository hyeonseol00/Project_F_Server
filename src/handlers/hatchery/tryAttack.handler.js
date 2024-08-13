import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const tryAttackHatcheryHandler = async ({ socket, payload }) => {
  try {
    const user = await getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    const nicknames = hatcherySession.playerNicknames;
    const players = [];
    for (let i = 0; i < nicknames.length; i++) {
      players.push(await getUserByNickname(nicknames[i]));
    }

    const tryAttackResponse = createResponse('response', 'S_TryAttack', {
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

export default tryAttackHatcheryHandler;
