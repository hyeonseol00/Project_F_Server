import { getUserBySocket } from '../../session/user.session.js';
import { updateQuestProgress } from '../../db/user/user.db.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { config } from '../../config/config.js';
import { getLevelById } from '../../assets/level.assets.js';
import { getquestById } from '../../assets/quests.assets.js';

const questRewardHandler = async ({ socket, payload }) => {
  try {
    const { questId } = payload;
    const user = getUserBySocket(socket);

    const quest = getquestById(questId);

    if (!quest) {
      throw new Error('퀘스트가 존재하지 않습니다.');
    }

    const userQuests = await getUserQuests(user.characterId);
    const userQuest = userQuests.find((q) => q.questId === questId);

    if (!userQuest || userQuest.status !== '완료') {
      throw new Error('퀘스트가 완료되지 않았거나 존재하지 않습니다.');
    }

    // 보상 지급 (경험치, 골드 등)
    let playerExp = user.playerInfo.statInfo.exp + quest.rewardExp;
    user.playerInfo.gold += quest.rewardGold;

    // 레벨업 로직
    const playerLevel = user.playerInfo.statInfo.level;
    const nextLevelData = getLevelById(playerLevel + 1);
    let levelUpMessage = '';

    if (playerExp >= nextLevelData.requiredExp && playerLevel < config.battleScene.maxLevel) {
      // 레벨업 처리
      playerExp -= nextLevelData.requiredExp;
      user.playerInfo.statInfo.level += 1;
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

      // 레벨업 메시지
      levelUpMessage = `레벨업! ${playerLevel + 1} 레벨이 되었습니다!\n
        최대 체력: +${nextLevelData.hp}, 최대 마나: +${nextLevelData.mp}\n
        공격력: +${nextLevelData.attack}, 방어력: +${nextLevelData.defense}, 마법력: +${nextLevelData.magic}\n
        속도: +${nextLevelData.speed}, 크리티컬 확률: +${nextLevelData.critical}\n
        회피 확률: +${nextLevelData.avoidAbility}, 스킬 포인트: +${nextLevelData.skillPoint}`;

      const chatMessageResponse = createResponse('response', 'S_Chat', {
        playerId: user.characterId,
        chatMsg: levelUpMessage,
      });

      socket.write(chatMessageResponse);
    }

    // 경험치 업데이트
    user.playerInfo.statInfo.exp = playerExp;

    await updateQuestProgress(user.characterId, questId, userQuest.killCount, '보상 완료');

    const rewardMessage = `퀘스트 완료 보상으로 ${quest.rewardExp} 경험치와 ${quest.rewardGold} 골드를 획득했습니다!`;
    const rewardResponse = createResponse('response', 'S_Chat', {
      playerId: user.characterId,
      chatMsg: rewardMessage,
    });

    socket.write(rewardResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default questRewardHandler;
