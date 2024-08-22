import { getStatInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
// import { questProgressHandler } from '../../town/chatCommands/quest/questProgress.chat.js';

const attackBossHatcheryHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const hatcherySession = getHatcherySession();
  await hatcherySession.addGameQueue(user.nickname);
};

export const gameQueueProcess = async (nickname) => {
  const curUser = getUserByNickname(nickname);

  try {
    const hatcherySession = getHatcherySession();
    const playerStatInfo = await getStatInfo(curUser.socket);

    if (hatcherySession.boss.hp <= 0) {
      return;
    }

    let decreaseHp = playerStatInfo.atk;

    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= playerStatInfo.critRate) {
      const criticalRate = playerStatInfo.critDmg / 100;
      decreaseHp = Math.floor(playerStatInfo.atk * criticalRate);
    }

    hatcherySession.boss.hp -= decreaseHp;

    const bossCurHp = hatcherySession.boss.hp > 0 ? hatcherySession.boss.hp : 0;
    const attackBossResponse = createResponse('response', 'S_SetHatcheryBossHp', {
      bossCurHp,
    });

    const killBossResponse = createResponse('response', 'S_KillBoss', {
      playerId: curUser.playerId,
      btnTexts: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      message:
        `${nickname}님께서 ${hatcherySession.boss.name}을(를) 처치했습니다!\n` +
        `${nickname}님의 보상 선택 대기중입니다...`,
    });

    for (const nickname of hatcherySession.playerNicknames) {
      const user = getUserByNickname(nickname);
      user.socket.write(attackBossResponse);
      user.socket.write(killBossResponse);
    }

    // 최종 보스 처치 퀘스트의 진행 상황 업데이트
    // if (hatcherySession.boss.hp <= 0) {
    //   questProgressHandler({
    //     socket,
    //     payload: {
    //       questId: player.currentQuestId,
    //       monsterId: hatcherySession.boss.monsterId,
    //       progressIncrement: 1, // 보스 처치로 진행 상황 1 증가
    //     },
    //   });
    // }
  } catch (err) {
    handleError(curUser.socket, err);
  }
};

export default attackBossHatcheryHandler;
