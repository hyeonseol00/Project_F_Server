import { getAllLevelData } from '../db/game/game.db.js';
import { redisCli } from '../init/redis/redis.js';

const levelTable = 'levelTable:';

export const getLevelById = async (levelId) => {
  const levelData = await redisCli.get(`${levelTable}${levelId}`);

  return JSON.parse(levelData);
};

export const loadLevelTable = async () => {
  const levelComponet = await getAllLevelData();

  levelComponet.forEach(async (level) => {
    await redisCli.set(`${levelTable}${level.levelId}`, JSON.stringify(level));
  });
};
