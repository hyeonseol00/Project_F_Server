import { getStatInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const attackBossHatcheryHandler = async ({ socket, payload }) => {
  try {
    const playerStatInfo = await getStatInfo(socket);
    const hatcherySession = getHatcherySession();

    let decreaseHp = playerStatInfo.atk;

    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= playerStatInfo.critRate) {
      const criticalRate = playerStatInfo.critDmg / 100;
      decreaseHp = playerStatInfo.atk * criticalRate;
    }

    hatcherySession.boss.hp -= decreaseHp;

    const bossCurHp = hatcherySession.boss.hp > 0 ? hatcherySession.boss.hp : 0;
    const attackBossResponse = createResponse('response', 'S_SetHatcheryBossHp', {
      bossCurHp,
    });

    const players = hatcherySession.playerNicknames;
    for (const player of players) {
      player.socket.write(attackBossResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default attackBossHatcheryHandler;
