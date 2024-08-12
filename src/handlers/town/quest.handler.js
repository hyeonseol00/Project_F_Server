import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import {
  findQuestById,
  updateQuestProgress,
  addUserQuest,
  getUserQuests,
} from '../../db/game/game.db.js';

// 퀘스트 수락 핸들러
const acceptQuestHandler = async ({ socket, payload }) => {
  try {
    const { questId } = payload;
    const user = getUserBySocket(socket);

    const existingQuests = await getUserQuests(user.playerId);
    const questAccepted = existingQuests.find((quest) => quest.questId === questId);

    if (questAccepted) {
      throw new Error('이미 수락한 퀘스트입니다.');
    }

    const quest = await findQuestById(questId);
    if (!quest) {
      throw new Error('존재하지 않는 퀘스트입니다.');
    }

    await addUserQuest(user.playerId, questId);

    const response = createResponse('response', 'S_AcceptQuest', {
      quest,
      success: true,
      message: '퀘스트를 성공적으로 수락했습니다.',
    });

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

// 유저 퀘스트 목록 조회 핸들러
const getQuestsHandler = async ({ socket }) => {
  try {
    const user = getUserBySocket(socket);
    const quests = await getUserQuests(user.playerId);

    const response = createResponse('response', 'S_GetQuests', { quests });
    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

// 퀘스트 진행 상황 업데이트 핸들러
const questProgressHandler = async ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const { questId, monsterId, progressIncrement } = payload;

    // 퀘스트 진행 상황 업데이트
    await updateQuestProgress(user.playerId, questId, monsterId, progressIncrement);

    // 업데이트된 퀘스트 정보 가져오기
    const quest = await findQuestById(questId);

    // 현재 진행 상황 계산
    const currentProgress = quest.progress; // 현재 잡은 몬스터 수
    const totalProgress = quest.monsterCount; // 목표 몬스터 수

    const message = `퀘스트 진행 상황이 업데이트되었습니다. 현재 진행 상황: ${currentProgress}/${totalProgress} 몬스터 처치.`;

    // 응답 생성
    const response = createResponse('response', 'S_UpdateQuestProgress', {
      success: true,
      message,
    });

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

// 퀘스트 완료 핸들러
const completeQuestHandler = async ({ socket, payload }) => {
  try {
    const { questId } = payload;
    const user = getUserBySocket(socket);

    await updateQuestProgress(user.playerId, questId, 100, '완료');

    const quest = await findQuestById(questId);

    const response = createResponse('response', 'S_CompleteQuest', {
      questId,
      success: true,
      message: '퀘스트를 성공적으로 완료했습니다.',
      quest,
    });

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export { acceptQuestHandler, getQuestsHandler, completeQuestHandler, questProgressHandler };
