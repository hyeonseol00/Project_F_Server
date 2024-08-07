import { getLevelTable } from '../db/game/game.db.js';
import { levelTable } from './sessions.js';

export const getLevelById = (levelId) => {
  return levelTable.find((level) => level.levelId === levelId);
};

export const loadLevelTable = async () => {
  const levelComponet = await getLevelTable();
  levelComponet.forEach((level) => {
    levelTable.push(level);
  });
};
