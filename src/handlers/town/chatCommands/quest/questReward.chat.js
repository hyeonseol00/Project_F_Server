import {
  updateQuestProgress,
  getUserQuests,
  updateCharacterStatus,
  removeUserQuest,
} from '../../../../db/user/user.db.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { handleError } from '../../../../utils/error/errorHandler.js';
import { config } from '../../../../config/config.js';
import { getLevelById } from '../../../../assets/level.assets.js';
import { getquestById } from '../../../../assets/quests.assets.js';
import isInteger from '../../../../utils/isInteger.js';
import {
  getGold,
  getPlayerInfo,
  getStatInfo,
  setGold,
  setStatInfo,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';
import { getGameSession } from '../../../../session/game.session.js';

const questRewardHandler = async (sender, message) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const user = sender;
    const userStatInfo = await getStatInfo(user.socket);

    if (!isInteger(message)) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 퀘스트 ID(숫자)을(를) 입력하세요.`,
      });
      user.socket.write(response);
      return;
    }

    const questId = Number(message);

    const userQuests = await getUserQuests(user.characterId);
    const userQuest = userQuests.find((q) => q.questId === questId);

    if (!userQuest) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 해당 퀘스트를 찾을 수 없습니다.`,
      });
      user.socket.write(response);
      return;
    }

    if (userQuest.status === 'REWARD_CLAIMED') {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 이미 보상을 수령한 퀘스트입니다.`,
      });
      user.socket.write(response);
      return;
    }

    if (userQuest.status !== 'COMPLETED') {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 퀘스트가 완료되지 않았거나 존재하지 않습니다.`,
      });
      user.socket.write(response);
      return;
    }

    const quest = getquestById(questId);

    if (!quest) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 존재하지 않는 퀘스트입니다.`,
      });
      user.socket.write(response);
      return;
    }

    // 보상 지급 (경험치, 골드 등)
    let playerExp = userStatInfo.exp + quest.rewardExp;
    let playerGold = Number(await getGold(user.socket)) + quest.rewardGold;

    await setGold(user.socket, playerGold);

    // 레벨업 로직
    const playerLevel = userStatInfo.level;
    const nextLevelData = getLevelById(playerLevel + 1);
    let levelUpMessage = '';

    if (playerExp >= nextLevelData.requiredExp && playerLevel < config.battleScene.maxLevel) {
      playerExp -= nextLevelData.requiredExp;

      userStatInfo.level = playerLevel + 1;
      userStatInfo.exp = playerExp;
      userStatInfo.maxHp += nextLevelData.hp;
      userStatInfo.maxMp += nextLevelData.mp;
      userStatInfo.hp = userStatInfo.maxHp;
      userStatInfo.mp = userStatInfo.maxMp;
      userStatInfo.atk += nextLevelData.attack;
      userStatInfo.def += nextLevelData.defense;
      userStatInfo.magic += nextLevelData.magic;
      userStatInfo.speed += nextLevelData.speed;
      userStatInfo.critRate += nextLevelData.critical;
      userStatInfo.critDmg += nextLevelData.criticalAttack;
      userStatInfo.avoidRate += nextLevelData.avoidAbility;

      skillPointUpdate(socket, user.skillPoint + nextLevelData.skillPoint);

      if ((playerLevel + 1) % 5 === 0) {
        user.worldLevel++;
      }

      levelUpMessage = `[System] 레벨업! ${playerLevel + 1} 레벨이 되었습니다!\n
          최대 체력: +${nextLevelData.hp}, 최대 마나: +${nextLevelData.mp}\n
          공격력: +${nextLevelData.attack}, 방어력: +${nextLevelData.defense}, 마법력: +${nextLevelData.magic}\n
          속도: +${nextLevelData.speed}, 크리티컬 확률: +${nextLevelData.critical}\n
          회피 확률: +${nextLevelData.avoidAbility}, 스킬 포인트: +${nextLevelData.skillPoint}`;

      const chatMessageResponse = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: levelUpMessage,
      });

      user.socket.write(chatMessageResponse);
    } else {
      userStatInfo.exp = playerExp;
    }

    await setStatInfo(user.socket, userStatInfo);

    // DB에 퀘스트 상태 업데이트
    await updateQuestProgress(user.characterId, questId, userQuest.killCount, 'REWARD_CLAIMED');

    // 퀘스트를 보상 후에 제거
    await removeUserQuest(user.characterId, questId);

    const playerInfo = await getPlayerInfo(user.socket);
    playerInfo.transform = gameSession.transforms[user.nickname];
    const statUpdateResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });
    user.socket.write(statUpdateResponse);

    const rewardMessage = `[System] 퀘스트 완료 보상으로 ${quest.rewardExp} 경험치와 ${quest.rewardGold} 골드를 획득했습니다!`;
    const rewardResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: rewardMessage,
    });

    console.log(`Sending reward message to playerId ${user.playerId}: ${rewardMessage}`);

    user.socket.write(rewardResponse);
  } catch (err) {
    const errorMessage = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] 오류가 발생했습니다: ${err.message}`,
    });
    sender.socket.write(errorMessage);
    handleError(sender.socket, err);
  }
};

export default questRewardHandler;
