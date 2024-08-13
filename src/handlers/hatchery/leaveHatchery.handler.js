import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const leaveHatcheryHandler = ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const hatcherySession = getHatcherySession();

    const playerDespawnResponse = createResponse('response', 'S_DespawnHatchery', {
      playerId: user.playerId,
    });
    hatcherySession.players.forEach((player) => {
      player.socket.write(playerDespawnResponse);
    });

    const leaveHatcheryResponse = createResponse('response', 'S_LeaveDungeon', {});
    socket.write(leaveHatcheryResponse);

    hatcherySession.removePlayer(user.nickname);
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveHatcheryHandler;
