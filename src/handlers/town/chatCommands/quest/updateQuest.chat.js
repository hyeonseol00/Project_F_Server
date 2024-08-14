import { getUserQuests, updateQuestProgress } from '../../../../db/user/user.db.js';

export const updateQuestProgressAfterBattle = async (user, questId, progressIncrement = 1) => {
  try {
    const userQuests = await getUserQuests(user.characterId);
    const userQuest = userQuests.find((q) => q.questId === questId);

    if (!userQuest) {
      console.error(`퀘스트 ID ${questId}에 해당하는 사용자의 퀘스트를 찾을 수 없습니다.`);
      return;
    }

    // 퀘스트가 완료되지 않았을 경우, 진행 상황을 업데이트
    if (userQuest.status !== 'COMPLETED') {
      userQuest.killCount += progressIncrement;

      console.log(`Updated Kill Count for Quest ID ${questId}: ${userQuest.killCount}`);

      // DB에 업데이트
      await updateQuestProgress(user.characterId, questId, userQuest.killCount, userQuest.status);
    }
  } catch (err) {
    console.error('Error in updateQuestProgressAfterBattle:', err);
  }
};
