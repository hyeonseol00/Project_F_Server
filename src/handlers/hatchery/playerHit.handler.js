import { getStatInfo, setStatInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const playerHitHatcheryHandler = async ({ socket, payload }) => {
  try {
    const player = getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    const isInvincible = hatcherySession.invincibilityList.find(
      (nickname) => nickname === player.nickname,
    );
    if (isInvincible) {
      return;
    }

    const playerStatInfo = await getStatInfo(socket);
    const boss = hatcherySession.boss;

    let decreaseHp = boss.power;
    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= boss.critical) {
      const criticalRate = boss.criticalAttack / 100;
      decreaseHp = Math.floor(boss.power * criticalRate);
    }

    let finalDamage = decreaseHp;
    if (hatcherySession.phase === 1)
      finalDamage = Math.floor(decreaseHp / (1 + playerStatInfo.def * 0.01)); // LOL 피해량 공식

    const isBerserker = hatcherySession.berserkerList.find(
      (nickname) => nickname === player.nickname,
    );

    playerStatInfo.hp -= finalDamage;
    if (playerStatInfo.hp <= 0) {
      playerStatInfo.hp = 0;
      if (isBerserker) {
        playerStatInfo.hp = 1;
      } else {
        hatcherySession.deadPlayer.push(player.nickname);
      }
    }

    const playerHitResponse = createResponse('response', 'S_SetPlayerHpMpHatchery', {
      playerId: player.playerId,
      playerCurHp: playerStatInfo.hp,
      playerCurMp: playerStatInfo.mp,
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
