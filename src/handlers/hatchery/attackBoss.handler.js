import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
// import { questProgressHandler } from '../../town/chatCommands/quest/questProgress.chat.js';

const attackBossHatcheryHandler = async ({ socket, payload }) => {
  try {
    const player = getUserBySocket(socket);
    const playerStatInfo = player.playerInfo.statInfo;
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

    const players = hatcherySession.players;
    for (const player of players) {
      player.socket.write(attackBossResponse);
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
    handleError(socket, err);
  }
};

export default attackBossHatcheryHandler;
