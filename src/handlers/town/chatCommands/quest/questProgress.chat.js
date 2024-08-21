import { handleError } from '../../../../utils/error/errorHandler.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { getUserQuests } from '../../../../db/user/user.db.js';
import { getquestById } from '../../../../assets/quests.assets.js';
import isInteger from '../../../../utils/isInteger.js';

const questProgressHandler = async (sender, message) => {
  try {
    const socket = sender.socket;
    const user = sender;

    if (!isInteger(message)) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: '[System] 퀘스트 ID(숫자)을(를) 입력하세요.',
      });
      socket.write(response);
      return;
    }

    const questId = Number(message);
    const userQuests = await getUserQuests(user.characterId);
    const userQuest = userQuests.find((q) => q.questId === questId);

    if (!userQuest) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: '[System] 해당 퀘스트를 찾을 수 없습니다.',
      });
      socket.write(response);
      return;
    }

    const quest = await getquestById(questId);
    const currentProgress = userQuest.killCount;
    const totalProgress = quest.monsterTarget;

    // 퀘스트 진행 상황 확인 메시지
    const progressMessage = `[System] 퀘스트 진행 상황: ${currentProgress}/${totalProgress} 몬스터 처치 완료.`;
    socket.write(
      createResponse('response', 'S_Chat', { playerId: user.playerId, chatMsg: progressMessage }),
    );
  } catch (err) {
    handleError(sender.socket, err);
  }
};

export default questProgressHandler;
