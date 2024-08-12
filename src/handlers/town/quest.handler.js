import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import {
  updateQuestProgress,
  addUserQuest,
  getUserQuests,
  getQuestsByLevel,
  removeUserQuest,
} from '../../db/user/user.db.js';
import { getquestById } from '../../assets/quests.assets.js';
import isInteger from '../../utils/isInteger.js';
import { getUserBySocket } from '../../session/user.session.js';

// 퀘스트 수락 핸들러
const acceptQuestHandler = async (sender, message) => {
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

    const existingQuests = await getUserQuests(user.characterId);
    const questAccepted = existingQuests.find((quest) => quest.questId === questId);

    if (questAccepted) {
      throw new Error('이미 수락한 퀘스트입니다.');
    }

    const quest = await getquestById(questId);
    if (!quest) {
      throw new Error('존재하지 않는 퀘스트입니다.');
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
      message: '[System] 퀘스트를 성공적으로 수락했습니다.',
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

// 유저 퀘스트 목록 조회 핸들러
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
      console.log(QuestInfo);

      questInfos.push(currentQuestInfo);
    }

    const response = createResponse('response', 'S_GetQuests', { quests: questInfos });
    user.socket.write(response);

    const questNames = questInfos.map((questInfo) => questInfo.questName).join(', ');
    console.log(questNames);

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 현재 진행 중인 퀘스트: ${questNames}`,
    });

    user.socket.write(chatResponse);
  } catch (err) {
    handleError(sender.socket, err);
  }
};

// 퀘스트 진행 상황 확인 및 업데이트 핸들러
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

    if (!quest) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: '[System] 존재하지 않는 퀘스트입니다.',
      });
      socket.write(response);
      return;
    }

    // 퀘스트 상태 업데이트 로직 추가 (몬스터 처치 등)
    if (userQuest.status !== '완료') {
      userQuest.killCount += 1; // 여기에 progressIncrement 값을 사용하려면 추가적인 로직 필요
      if (userQuest.killCount >= quest.monsterTarget) {
        // 목표 몬스터 수 달성 시
        userQuest.status = '완료';
      }
      await updateQuestProgress(user.characterId, questId, userQuest.killCount, userQuest.status);
    }

    const currentProgress = userQuest.killCount;
    const totalProgress = quest.monsterTarget;

    const progressMessage = `[System] 퀘스트 진행 상황: ${currentProgress}/${totalProgress} 몬스터 처치 완료.`;

    // 응답 생성
    const response = createResponse('response', 'S_UpdateQuest', {
      success: true,
      message: progressMessage,
    });

    socket.write(response);

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: progressMessage,
    });

    socket.write(chatResponse);
  } catch (err) {
    handleError(sender.socket, err);
  }
};

// 퀘스트 완료 핸들러
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

    await updateQuestProgress(user.characterId, questId, 100, '완료');

    const quest = await getquestById(questId);

    const response = createResponse('response', 'S_CompleteQuest', {
      questId,
      success: true,
      message: '퀘스트를 성공적으로 완료했습니다.',
      quest,
    });

    user.socket.write(response);

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `퀘스트 완료: ${quest.questName}`,
    });

    user.socket.write(chatResponse);

    // 완료된 퀘스트를 목록에서 삭제
    await removeUserQuest(user.characterId, questId);
  } catch (err) {
    handleError(sender.socket, err);
  }
};

// 퀘스트 시작 알림 핸들러
const checkAndStartQuestHandler = async (user) => {
  const userLevel = user.playerInfo.statInfo.level;

  const availableQuests = await getQuestsByLevel(userLevel);

  for (const quest of availableQuests) {
    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${quest.questDescription} 퀘스트가 도착했습니다.`,
    });

    user.socket.write(chatResponse);
  }
};

export {
  acceptQuestHandler,
  getQuestsHandler,
  completeQuestHandler,
  questProgressHandler,
  checkAndStartQuestHandler,
};
