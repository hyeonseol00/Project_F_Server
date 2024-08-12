import { questSessions } from './session.js';
import Quest from '../classes/models/quest.class.js';
import { config } from '../config/config.js';
import { addUserQuest } from '../db/game/game.db.js';

// 기존 퀘스트 목록
const quests = [
  {
    level: 1,
    questId: 1,
    questName: '레벨 1 퀘스트',
    questDescription: '1성 던전에서 몬스터 5마리 처치',
    monsterCount: 5,
    rewardExp: 200,
    rewardGold: 1000,
  },
  {
    level: config.levelThresholds.level1,
    questId: 2,
    questName: '레벨 5 퀘스트',
    questDescription: '2성 던전에서 몬스터 10마리 처치',
    monsterCount: 10,
    rewardExp: 600,
    rewardGold: 3000,
  },
  {
    level: config.levelThresholds.level2,
    questId: 3,
    questName: '레벨 10 퀘스트',
    questDescription: '3성 던전에서 몬스터 20마리 처치',
    monsterCount: 20,
    rewardExp: 1000,
    rewardGold: 5000,
  },
  {
    level: config.levelThresholds.level3,
    questId: 4,
    questName: '레벨 15 퀘스트',
    questDescription: '4성 던전에서 몬스터 30마리 처치',
    monsterCount: 30,
    rewardExp: 1500,
    rewardGold: 10000,
  },
  // 최종 퀘스트
  {
    level: config.levelThresholds.level3,
    questId: 5,
    questName: '최종 퀘스트',
    questDescription: '최종 던전에서 보스를 처치',
    monsterCount: 1, // 보스 1마리 처치
    rewardExp: 3000,
    rewardGold: 20000,
  },
];

export const addQuestSession = (
  questId,
  questName,
  questDescription,
  questLevel,
  monsterCount,
  rewardExp,
  rewardGold,
) => {
  const quest = new Quest(
    questId,
    questName,
    questDescription,
    questLevel,
    monsterCount,
    rewardExp,
    rewardGold,
  );
  questSessions.push(quest);
  return quest;
};

export const removeQuestSession = (questId) => {
  const index = questSessions.findIndex((quest) => quest.questId === questId);
  if (index !== -1) return questSessions.splice(index, 1)[0];
};

export const getQuestSession = (questId) => {
  return questSessions.find((quest) => quest.questId === questId);
};

export const updateQuestProgress = (questId, count) => {
  const quest = getQuestSession(questId);
  if (quest) {
    quest.updateProgress(count);
  } else {
    console.error(`퀘스트를 찾을 수 없습니다: ${questId}`);
  }
};

export const getAllQuestSessions = () => {
  return questSessions;
};

export const checkAndStartQuest = (user) => {
  // 먼저 모든 이전 퀘스트가 완료되었는지 확인
  const completedAllPreviousQuests = quests
    .slice(0, -1) // 마지막 퀘스트를 제외한 모든 퀘스트
    .every((quest) => {
      const userQuest = user.quests.find((q) => q.questId === quest.questId);
      return userQuest && userQuest.status === '완료';
    });

  let questToStart;

  if (completedAllPreviousQuests) {
    // 모든 이전 퀘스트가 완료되었을 때 최종 퀘스트를 시작
    questToStart = quests.find((quest) => quest.questId === 5); // 최종 퀘스트
  } else {
    // 일반 퀘스트를 레벨에 따라 시작
    questToStart = quests.find((quest) => quest.level === user.playerInfo.statInfo.level);
  }

  if (questToStart) {
    addQuestSession(
      questToStart.questId,
      questToStart.questName,
      questToStart.questDescription,
      questToStart.level,
      questToStart.monsterCount,
      questToStart.rewardExp,
      questToStart.rewardGold,
    );
    addUserQuest(user.playerId, questToStart.questId);
    return questToStart;
  }

  return null;
};

export const loadQuestsIntoSession = () => {
  quests.forEach((quest) => {
    addQuestSession(
      quest.questId,
      quest.questName,
      quest.questDescription,
      quest.level,
      quest.monsterCount,
      quest.rewardExp,
      quest.rewardGold,
    );
  });
};
