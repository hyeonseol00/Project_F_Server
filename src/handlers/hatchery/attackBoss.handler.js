import {
  getPlayerInfo,
  getStatInfo,
  setStatInfo,
} from '../../classes/DBgateway/playerinfo.gateway.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { config } from '../../config/config.js';
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
    if (hatcherySession.boss.hp <= 0) return;
    const playerStatInfo = await getStatInfo(curUser.socket);

    if (curUser.isBuff) {
      const isBerserker = hatcherySession.berserkerList.find(
        (nickname) => nickname === curUser.nickname,
      );
      const isInvincible = hatcherySession.invincibilityList.find(
        (nickname) => nickname === curUser.nickname,
      );
      const isMage = hatcherySession.mageList.find((nickname) => nickname === curUser.nickname);
      if (isBerserker) {
        playerStatInfo.critRate += config.skill.critRateBuff;
        playerStatInfo.critDmg *= 2;
      } else if (isInvincible) {
        playerStatInfo.atk *= config.skill.atkBuff;
      } else if (isMage) {
        playerStatInfo.atk += playerStatInfo.magic;
      }
    }

    let decreaseHp = playerStatInfo.atk;

    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= playerStatInfo.critRate) {
      const criticalRate = playerStatInfo.critDmg / 100;
      decreaseHp = Math.floor(playerStatInfo.atk * criticalRate);
    }

    hatcherySession.boss.hp -= decreaseHp;
    console.log(
      `decreaseHp: ${decreaseHp}, isBuff: ${curUser.isBuff}, criRate: ${playerStatInfo.critRate}`,
    );

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

    // boss hp 0 만든 player msg 전송
    if (hatcherySession.boss.hp <= 0) {
      for (const nickname of hatcherySession.playerNicknames) {
        const user = getUserByNickname(nickname);
        user.socket.write(attackBossResponse);
        user.socket.write(killBossResponse);
      }
    }
    // boss hp에 따라 phase 구분
    else {
      let phaseChanged = false;
      const secondPhaseResponse = createResponse('response', 'S_EnterSecondPhase', {
        bindTime: config.hatchery.bindTime,
        updatedBossSpeed: config.hatchery.updatedBossSpeed,
      });
      const thirdPhaseResponse = createResponse('response', 'S_EnterThirdPhase', {
        deathCountTime: config.hatchery.deathCountTime,
      });
      for (const nickname of hatcherySession.playerNicknames) {
        const user = getUserByNickname(nickname);
        user.socket.write(attackBossResponse);

        if (hatcherySession.phase === 1 && bossCurHp < Math.floor(hatcherySession.boss.maxHp / 2)) {
          phaseChanged = true;
          hatcherySession.boss.speed = config.hatchery.updatedBossSpeed;

          user.socket.write(secondPhaseResponse);
        }
        if (hatcherySession.phase === 2 && bossCurHp < Math.floor(hatcherySession.boss.maxHp / 5)) {
          phaseChanged = true;
          user.socket.write(thirdPhaseResponse);
        }
      }
      if (phaseChanged) {
        hatcherySession.phase++;
        if (hatcherySession.phase === 3) {
          await startThirdPhase(hatcherySession);
        }
      }
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

const startThirdPhase = async (hatcherySession) => {
  setTimeout(async () => {
    if (hatcherySession.boss.hp > 0 && hatcherySession.phase === 3) {
      for (const nickname of hatcherySession.playerNicknames) {
        const attackedUser = getUserByNickname(nickname);
        const userStatInfo = await getStatInfo(attackedUser.socket);
        if (userStatInfo.hp <= 0) continue;
        userStatInfo.hp = 0;
        await setStatInfo(attackedUser.socket, userStatInfo);
        const gameOverResponse = createResponse('response', 'S_SetPlayerHpMpHatchery', {
          playerId: attackedUser.playerId,
          playerCurHp: userStatInfo.hp,
          playerCurMp: userStatInfo.mp,
        });
        hatcherySession.playerNicknames.forEach((nickname) => {
          const user = getUserByNickname(nickname);
          user.socket.write(gameOverResponse);
        });
      }
    }
  }, config.hatchery.deathCountTime * 1000);
};

export default attackBossHatcheryHandler;
