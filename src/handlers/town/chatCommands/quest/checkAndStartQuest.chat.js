import { handleError } from '../../../../utils/error/errorHandler.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { getQuestsByLevel } from '../../../../db/game/game.db.js';
import { getUserQuests } from '../../../../db/user/user.db.js';

export const checkAndStartQuestHandler = async (sender) => {
  try {
    const user = sender;
    const userLevel = user.playerInfo.statInfo.level;

    // 유저가 이미 수락한 퀘스트 목록 가져오기
    const existingQuests = await getUserQuests(user.characterId);
    const acceptedQuestIds = existingQuests.map((quest) => quest.questId);

    const availableQuests = await getQuestsByLevel(userLevel);

    if (availableQuests.length === 0) {
      const noQuestResponse = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 현재 진행 가능한 퀘스트가 없습니다.`,
      });
      user.socket.write(noQuestResponse);
      return;
    }

    // 수락하지 않은 퀘스트만 알림
    for (const quest of availableQuests) {
      if (!acceptedQuestIds.includes(quest.quest_id)) {
        const chatResponse = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${quest.quest_name}(questId: ${quest.quest_id})가 도착했습니다!`,
        });

        user.socket.write(chatResponse);

        // 지연시간 추가
        // await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        console.log(
          `Quest ${quest.quest_name} has already been accepted by playerId ${user.playerId}`,
        );
      }
    }
  } catch (err) {
    console.error('Error in checkAndStartQuestHandler:', err);
    handleError(sender.socket, err);
  }
};
