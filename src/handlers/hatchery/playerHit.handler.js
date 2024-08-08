import { getHatcherySession } from '../../session/hatchery.session';
import { getUserBySocket } from '../../session/user.session';
import { createResponse } from '../../utils/response/createResponse';

const playerHitHatcheryHandler = async ({ socket, payload }) => {
  try {
    const player = getUserBySocket(socket);
    const playerStatInfo = player.playerInfo.statInfo;
    const hatcherySession = getHatcherySession();
    const boss = hatcherySession.boss;

    let decreaseHp = playerStatInfo.atk;
    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= boss.critical) {
      const criticalRate = boss.criticalAttack / 100;
      decreaseHp = boss.power * criticalRate;
    }

    playerStatInfo.hp -= decreaseHp;
    if (playerStatInfo.hp <= 0) {
      playerStatInfo.hp = 0;
    }

    const playerHitResponse = createResponse('response', 'S_SetPlayerHp', {
      playerId: player.playerId,
      playerCurHp: playerStatInfo.hp,
    });
    hatcherySession.players.forEach((player) => {
      player.socket.write(playerHitResponse);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default playerHitHatcheryHandler;
