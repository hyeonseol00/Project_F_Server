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

const questRewardHandler = async (sender, message) => {
  try {
    const user = sender;

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
    let playerExp = user.playerInfo.statInfo.exp + quest.rewardExp;
    let playerGold = user.gold + quest.rewardGold;

    // 골드 업데이트
    user.setGold(playerGold);

    // 레벨업 로직
    const playerLevel = user.playerInfo.statInfo.level;
    const nextLevelData = getLevelById(playerLevel + 1);
    let levelUpMessage = '';

    if (playerExp >= nextLevelData.requiredExp && playerLevel < config.battleScene.maxLevel) {
      playerExp -= nextLevelData.requiredExp;
      user.setLevel(playerLevel + 1, playerExp);

      user.playerInfo.statInfo.maxHp += nextLevelData.hp;
      user.playerInfo.statInfo.maxMp += nextLevelData.mp;
      user.playerInfo.statInfo.hp = user.playerInfo.statInfo.maxHp;
      user.playerInfo.statInfo.mp = user.playerInfo.statInfo.maxMp;
      user.playerInfo.statInfo.atk += nextLevelData.attack;
      user.playerInfo.statInfo.def += nextLevelData.defense;
      user.playerInfo.statInfo.magic += nextLevelData.magic;
      user.playerInfo.statInfo.speed += nextLevelData.speed;
      user.playerInfo.statInfo.critRate += nextLevelData.critical;
      user.playerInfo.statInfo.critDmg += nextLevelData.criticalAttack;
      user.playerInfo.statInfo.avoidRate += nextLevelData.avoidAbility;
      user.playerInfo.skillPoint += nextLevelData.skillPoint;

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
      user.playerInfo.statInfo.exp = playerExp;
    }

    // DB에 유저 상태와 퀘스트 상태 업데이트
    await updateCharacterStatus(user);
    await updateQuestProgress(user.characterId, questId, userQuest.killCount, 'REWARD_CLAIMED');

    // 퀘스트를 보상 후에 제거
    await removeUserQuest(user.characterId, questId);

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
