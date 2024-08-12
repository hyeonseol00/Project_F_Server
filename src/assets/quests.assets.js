import { questTable } from './assets.js';
import { getQuests } from '../db/game/game.db.js';

export const loadQuestTable = async () => {
  const quests = await getQuests();

  quests.forEach((quest) => {
    questTable.push(quest);
  });
};

export const getquestById = (questId) => {
  return questTable.find((quest) => quest.questId === questId);
};
