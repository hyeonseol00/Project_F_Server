import { getStatInfo, setStatInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const playerHitHatcheryHandler = async ({ socket, payload }) => {
  try {
    const player = getUserBySocket(socket);
    const playerStatInfo = await getStatInfo(socket);
    const hatcherySession = getHatcherySession();
    const boss = hatcherySession.boss;

    let decreaseHp = boss.power;
    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= boss.critical) {
      const criticalRate = boss.criticalAttack / 100;
      decreaseHp = Math.floor(boss.power * criticalRate);
    }
    const finalDamage = Math.floor(decreaseHp / (1 + playerStatInfo.def * 0.01)); // LOL 피해량 공식

    playerStatInfo.hp -= finalDamage;
    if (playerStatInfo.hp <= 0) {
      playerStatInfo.hp = 0;
    }

    const playerHitResponse = createResponse('response', 'S_SetPlayerHpHatchery', {
      playerId: player.playerId,
      playerCurHp: playerStatInfo.hp,
    });
    hatcherySession.playerNicknames.forEach((nickname) => {
      const user = getUserByNickname(nickname);
      user.socket.write(playerHitResponse);
    });

    await setStatInfo(socket, playerStatInfo);
  } catch (err) {
    handleError(socket, err);
  }
};

export default playerHitHatcheryHandler;
