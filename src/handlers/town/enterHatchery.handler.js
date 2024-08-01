import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterHatcheryHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const hatcherySession = getHatcherySession();
    const user = getUserBySocket(socket);

    const { hp, maxHp, name } = hatcherySession.monster;

    const enterHatcheryResponse = createResponse('response', 'S_EnterHatchery', {
      player: user.getPlayerInfo(),
      bossMaxHp: maxHp,
      bossName: name,
    });

    socket.write(enterHatcheryResponse);

    const setHatcheryBossHpResponse = createResponse('response', 'S_SetHatcheryBossHp', {
      bossCurHp: hp,
    });

    socket.write(setHatcheryBossHpResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterHatcheryHandler;
