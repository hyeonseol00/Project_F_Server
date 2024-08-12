import { getDungeonMonster, getMonster } from '../db/game/game.db.js';
import { redisCli } from '../init/redis/redis.js';
import { config } from '../config/config.js';

export const loadMonsterTable = async () => {
  const monsterComponent = await getMonster();

  monsterComponent.forEach(async (monster) => {
    await redisCli.hSet(`${config.redisKey.monsterTable}`, `${monster.monsterId}`, JSON.stringify(monster));
  });

};

export const getMonsterById = async (monsterId) => {
  const monsterData = await redisCli.hGet(`${config.redisKey.monsterTable}`, `${monsterId}`);

  if (monsterId !== 0) {
    return JSON.parse(monsterData);
  }
};

export const loadDungeonMonster = async () => {
  const dungeonMonsterComponent = await getDungeonMonster();

  await redisCli.set(`${config.redisKey.dungeonTable}`, JSON.stringify(dungeonMonsterComponent));
};

export const getMonsterByDungeonId = async (dungeonId) => {
  const dungeonMonsterData = await redisCli.get(`${config.redisKey.dungeonTable}`);

  const dungeonMonster = JSON.parse(dungeonMonsterData).filter(
    (dungeon) => dungeon.dungeonId === dungeonId,
  );

  return dungeonMonster;
};
