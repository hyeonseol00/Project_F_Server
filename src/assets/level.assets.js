import { getAllLevelData } from '../db/game/game.db.js';
import { redisCli } from '../init/redis/redis.js';
import { config } from '../config/config.js';

export const loadLevelTable = async () => {
  const levelComponent = await getAllLevelData();

  levelComponent.forEach(async (level) => {
    await redisCli.hSet(`${config.redisKey.levelTable}`, `${level.levelId}`, JSON.stringify(level));
  }); 
};

export const getLevelById = async (levelId) => {
  const levelData = await redisCli.hGet(`${config.redisKey.levelTable}`, `${levelId}`);

  return JSON.parse(levelData);
};


