import { handleError } from '../../../../utils/error/errorHandler.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { addUserQuest, getUserQuests } from '../../../../db/user/user.db.js';
import { getquestById } from '../../../../assets/quests.assets.js';
import isInteger from '../../../../utils/isInteger.js';
import { getPlayerInfo } from '../../../../classes/DBgateway/playerinfo.gateway.js';

const acceptQuestHandler = async (sender, message) => {
  try {
    const user = sender;
    const userInfo = await getPlayerInfo(user.socket);
    if (!isInteger(message)) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 퀘스트 ID(숫자)을(를) 입력하세요.`,
      });
      user.socket.write(response);
      return;
    }
    const questId = Number(message);

    const existingQuests = await getUserQuests(user.characterId);
    const questAccepted = existingQuests.find((quest) => quest.questId === questId);

    if (questAccepted) {
      throw new Error('이미 수락한 퀘스트입니다.');
    }

    const quest = await getquestById(questId);
    if (!quest) {
      throw new Error('존재하지 않는 퀘스트입니다.');
    }

    if (userInfo.statInfo.level < quest.levelRequired) {
      user.socket.write(
        createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] 이 퀘스트는 레벨 ${quest.levelRequired} 이상만 수락할 수 있습니다.`,
        }),
      );
      return;
    }
    await addUserQuest(user.characterId, questId, 0, 'IN_PROGRESS');

    user.currentQuestId = questId;
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
      questStatus: 'IN_PROGRESS',
      objectives,
    };

    const response = createResponse('response', 'S_AcceptQuest', {
      quest: QuestInfo,
      success: true,
      message: '퀘스트를 성공적으로 수락했습니다.',
    });

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 퀘스트 수락: ${QuestInfo.questDescription}`,
    });

    user.socket.write(response);
    user.socket.write(chatResponse);
  } catch (err) {
    handleError(sender.socket, err);
  }
};

export default acceptQuestHandler;
