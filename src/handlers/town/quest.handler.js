import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { updateQuestProgress, addUserQuest, getUserQuests } from '../../db/user/user.db.js';
import { getquestById } from '../../assets/quests.assets.js';
import { getUserBySocket } from '../../session/user.session.js';
import isInteger from '../../utils/isInteger.js';

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

    await addUserQuest(user.characterId, questId);

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

    const response = createResponse('response', 'S_AcceptQuest', {
      quest: QuestInfo,
      success: true,
      message: '[System] 퀘스트를 성공적으로 수락했습니다.',
    });

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 퀘스트 수락: ${QuestInfo.questName}`,
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

// 퀘스트 진행 상황 확인 핸들러
const questProgressHandler = async (sender, message) => {
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

    // 업데이트된 퀘스트 정보 가져오기
    const quest = await getquestById(questId);

    // 퀘스트 진행 상황 업데이트
    await updateQuestProgress(user.characterId, questId, killCount, status);

    // 현재 진행 상황 계산
    const currentProgress = quest.progress; // 현재 잡은 몬스터 수
    const totalProgress = quest.monsterCount; // 목표 몬스터 수

    const message = `퀘스트 진행 상황: ${currentProgress}/${totalProgress} 몬스터 처치 완료.`;

    // 응답 생성
    const response = createResponse('response', 'S_UpdateQuest', {
      success: true,
      message,
    });

    user.socket.write(response);

    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: message,
    });

    user.socket.write(chatResponse);
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
  } catch (err) {
    handleError(sender.socket, err);
  }
};

const removeQuestHandler = (questId) => {
  return 0;
};

const checkAndStartQuestHandler = (user) => {
  // user.quests가 undefined인 경우 빈 배열로 처리
  const userQuests = user.quests || [];

  if (!user.playerInfo || !user.playerInfo.statInfo) {
    console.error('user.playerInfo 또는 user.playerInfo.statInfo가 정의되지 않았습니다.');
    return null;
  }

  const userLevel = user.playerInfo.statInfo.level;

  const completedAllPreviousQuests = quests.slice(0, -1).every((quest) => {
    const userQuest = userQuests.find((q) => q.questId === quest.questId);
    return userQuest && userQuest.status === '완료';
  });

  let questToStart;
  if (completedAllPreviousQuests) {
    questToStart = quests.find((quest) => quest.questId === 5);
  } else {
    questToStart = quests.find((quest) => quest.level === userLevel);
  }

  if (questToStart) {
    console.log(`시작할 퀘스트: ${JSON.stringify(questToStart)}`);
    const success = addUserQuest(user.playerId, questToStart.questId);
    if (success) {
      return questToStart;
    }
  } else {
    console.error('시작할 수 있는 퀘스트가 없습니다.');
  }

  return null;
};

export {
  acceptQuestHandler,
  getQuestsHandler,
  completeQuestHandler,
  questProgressHandler,
  checkAndStartQuestHandler,
  removeQuestHandler,
};
