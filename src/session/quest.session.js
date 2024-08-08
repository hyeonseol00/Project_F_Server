import { questSessions } from './sessions.js';
import Quest from '../classes/models/quest.class.js';
import { config } from '../config/config.js';
import { addUserQuest } from '../db/game/game.db.js';

// 퀘스트 배열 정의
const quests = [
  {
    level: 1,
    questId: 1,
    questName: 'Level 1 Quest',
    questDescription: 'Defeat 5 monsters in Level 1 dungeon',
    monsterCount: 5,
    rewardExp: 200,
    rewardGold: 1000,
  },
  {
    level: config.levelThresholds.level1,
    questId: 2,
    questName: 'Level 5 Quest',
    questDescription: 'Defeat 10 monsters in Level 2 dungeon',
    monsterCount: 10,
    rewardExp: 600,
    rewardGold: 3000,
  },
  {
    level: config.levelThresholds.level2,
    questId: 3,
    questName: 'Level 10 Quest',
    questDescription: 'Defeat 20 monsters in Level 3 dungeon',
    monsterCount: 20,
    rewardExp: 1000,
    rewardGold: 5000,
  },
  {
    level: config.levelThresholds.level3,
    questId: 4,
    questName: 'Level 15 Quest',
    questDescription: 'Defeat 30 monsters in Level 4 dungeon',
    monsterCount: 30,
    rewardExp: 1500,
    rewardGold: 10000,
  },
];

// 퀘스트 세션 관리 함수들
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
    console.error(`Quest not found: ${questId}`);
  }
};

export const getAllQuestSessions = () => {
  return questSessions;
};

// 유저 레벨에 따른 퀘스트 자동 시작 함수
export const checkAndStartQuest = (user) => {
  const questToStart = quests.find((quest) => quest.level === user.playerInfo.statInfo.level);

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
    addUserQuest(user.playerId, questToStart.questId); // 유저 퀘스트 데이터베이스에 추가
    return questToStart;
  }

  return null;
};
