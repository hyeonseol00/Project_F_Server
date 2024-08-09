import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { findQuestById, updateQuestProgress, addUserQuest } from '../../db/game/game.db.js';
import { checkAndStartQuest } from '../../session/quest.session.js';

const acceptQuestHandler = async ({ socket, payload }) => {
  try {
    const { questId } = payload;
    const user = getUserBySocket(socket);

    // 유저가 이미 수락한 퀘스트인지 확인
    const existingQuest = await getUserQuests(user.playerId);
    const questAccepted = existingQuest.find((quest) => quest.questId === questId);

    if (questAccepted) {
      throw new Error('Quest already accepted');
    }

    // 퀘스트 정보 가져오기
    const quest = await findQuestById(questId);

    if (!quest) {
      throw new Error('Quest not found');
    }

    // 유저 퀘스트 추가
    await addUserQuest(user.playerId, questId);

    // 응답 생성
    const acceptQuestResponse = createResponse('response', 'S_AcceptQuest', {
      quest,
      success: true,
      message: 'Quest accepted successfully',
    });

    socket.write(acceptQuestResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

const updateQuestHandler = async ({ socket, payload }) => {
  try {
    const { questId, objectiveId, progress } = payload;
    const user = getUserBySocket(socket);

    // 유저 퀘스트 진행 상황 업데이트
    await updateQuestProgress(user.playerId, questId, progress, 'IN_PROGRESS');

    // 퀘스트 정보 가져오기
    const quest = await findQuestById(questId);

    // 응답 생성
    const updateQuestResponse = createResponse('response', 'S_UpdateQuest', {
      quest,
      success: true,
      message: 'Quest progress updated successfully',
    });

    socket.write(updateQuestResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

const completeQuestHandler = async ({ socket, payload }) => {
  try {
    const { questId } = payload;
    const user = getUserBySocket(socket);

    // 유저 퀘스트 진행 상황 완료 처리
    await updateQuestProgress(user.playerId, questId, 100, 'COMPLETED');

    // 퀘스트 정보 가져오기
    const quest = await findQuestById(questId);

    // 응답 생성
    const completeQuestResponse = createResponse('response', 'S_CompleteQuest', {
      questId,
      success: true,
      message: 'Quest completed successfully',
      quest,
    });

    socket.write(completeQuestResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export { acceptQuestHandler, updateQuestHandler, completeQuestHandler };
