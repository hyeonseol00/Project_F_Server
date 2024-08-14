import { handleError } from '../../../../utils/error/errorHandler.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { getUserQuests } from '../../../../db/user/user.db.js';
import { getquestById } from '../../../../assets/quests.assets.js';

const getQuestsHandler = async (sender) => {
  try {
    const user = sender;
    const quests = await getUserQuests(user.characterId);
    const questInfos = [];
    for (const quest of quests) {
      const currentQuestInfo = getquestById(quest.questId);
      const objectives = {
        objectiveId: currentQuestInfo.questId,
        description: currentQuestInfo.questDescription,
        currentProgress: quest.killCount,
        targetProgress: currentQuestInfo.monsterTarget,
      };
      const QuestInfo = {
        questId: quest.questId,
        questName: currentQuestInfo.questName,
        questDescription: currentQuestInfo.questDescription,
        questStatus: quest.status,
        objectives,
      };
      questInfos.push(currentQuestInfo);
    }

    const questNames = questInfos.map((questInfo) => questInfo.questName).join(', ');

    if (!questNames) {
      const noQuestsResponse = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: ' 진행중인 퀘스트가 없습니다.',
      });
      user.socket.write(noQuestsResponse);
      return;
    }

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 현재 진행 중인 퀘스트: ${questNames}`,
    });

    user.socket.write(chatResponse);

    const response = createResponse('response', 'S_GetQuests', { quests: questInfos });
    user.socket.write(response);
  } catch (err) {
    handleError(sender.socket, err);
  }
};

export default getQuestsHandler;
