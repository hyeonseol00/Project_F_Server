import { getAllLevelData } from '../db/game/game.db.js';
import { levelTable } from './assets.js';

export const getLevelById = (levelId) => {
  return levelTable.find((level) => level.levelId === levelId);
};

export const loadLevelTable = async () => {
  const levelComponet = await getAllLevelData();
  levelComponet.forEach((level) => {
    levelTable.push(level);
  });
};
