import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { updateQuestProgress, addUserQuest, getUserQuests } from '../../db/user/user.db.js';
import { getQuestsByLevel } from '../../db/game/game.db.js';
import { getquestById } from '../../assets/quests.assets.js';
import isInteger from '../../utils/isInteger.js';

// 던전 ID와 퀘스트 ID 매핑 함수
const getQuestIdForDungeon = (dungeonId) => {
  const dungeonQuestMapping = {
    5001: 1, // 1성 던전 (ID: 5001) -> 퀘스트 ID 1
    5002: 2, // 2성 던전 (ID: 5002) -> 퀘스트 ID 2
    5003: 3, // 3성 던전 (ID: 5002) -> 퀘스트 ID 3
    5004: 4, // 4성 던전 (ID: 5002) -> 퀘스트 ID 4
    // 최종던전 추가 필요
  };

  return dungeonQuestMapping[dungeonId] || null;
};
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

    if (user.playerInfo.statInfo.level < quest.levelRequired) {
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

// 퀘스트 진행 상황 확인 핸들러
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
// 전투 후 퀘스트 진행 상황 업데이트 핸들러
const updateQuestProgressAfterBattle = async (user, questId, progressIncrement = 1) => {
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

// 퀘스트 시작 알림 핸들러
const checkAndStartQuestHandler = async (sender) => {
  try {
    const user = sender;
    const userLevel = user.playerInfo.statInfo.level;

    // 유저가 이미 수락한 퀘스트 목록 가져오기
    const existingQuests = await getUserQuests(user.characterId);
    const acceptedQuestIds = existingQuests.map((quest) => quest.questId);

    const availableQuests = await getQuestsByLevel(userLevel);

    console.log(`Available quests for level ${userLevel}:`, availableQuests);

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
          chatMsg: `[System] ${quest.quest_name}가 도착했습니다!`,
        });

        console.log(
          `Sending quest notification for ${quest.quest_name} to playerId ${user.playerId}`,
        );
        user.socket.write(chatResponse);

        // 짧은 지연 시간 추가 (50ms)
        await new Promise((resolve) => setTimeout(resolve, 50));

        // 추가로 소켓 버퍼 상태 확인
        if (!user.socket.writable) {
          console.error('Socket is not writable');
        }
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

export {
  acceptQuestHandler,
  getQuestsHandler,
  completeQuestHandler,
  questProgressHandler,
  checkAndStartQuestHandler,
  getQuestIdForDungeon,
  updateQuestProgressAfterBattle,
};
