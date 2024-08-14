import { handleError } from '../../../../utils/error/errorHandler.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { updateQuestProgress, getUserQuests } from '../../../../db/user/user.db.js';
import { getquestById } from '../../../../assets/quests.assets.js';
import isInteger from '../../../../utils/isInteger.js';

const completeQuestHandler = async (sender, message) => {
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

    const quest = await getquestById(questId);

    if (!quest) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 존재하지 않는 퀘스트입니다.`,
      });
      user.socket.write(response);
      return;
    }

    // 퀘스트 완료 조건 검사
    if (userQuest.killCount < quest.monsterTarget) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 퀘스트 완료 조건을 충족하지 못했습니다. 남은 몬스터: ${
          quest.monsterTarget - userQuest.killCount
        }마리`,
      });
      user.socket.write(response);
      return;
    }

    // 퀘스트 상태를 'COMPLETED'로 업데이트
    await updateQuestProgress(user.characterId, questId, quest.monsterTarget, 'COMPLETED');

    const completeResponse = createResponse('response', 'S_CompleteQuest', {
      questId,
      success: true,
      message: '퀘스트를 성공적으로 완료했습니다.',
      quest,
    });

    user.socket.write(completeResponse);

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 퀘스트 완료: ${quest.questName}`,
    });

    user.socket.write(chatResponse);
  } catch (err) {
    handleError(sender.socket, err);
  }
};

export default completeQuestHandler;
