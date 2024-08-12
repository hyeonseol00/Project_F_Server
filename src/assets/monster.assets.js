import { getDungeonMonster, getMonster } from '../db/game/game.db.js';
import { redisCli } from '../init/redis/redis.js';

const monsterTable = 'monsterTable:';
const dungeonMonsterTable = 'dungeonMonsterTable';

export const loadMonsterTable = async () => {
  const monsterComponet = await getMonster();

  monsterComponet.forEach(async (monster) => {
    await redisCli.set(`${monsterTable}${monster.monsterId}`, JSON.stringify(monster));
  });
};

export const getMonsterById = async (monsterId) => {
  const monsterData = await redisCli.get(`${monsterTable}${monsterId}`);

  if (monsterId !== 0) {
    return JSON.parse(monsterData);
  }
};

export const loadDungeonMonster = async () => {
  const dungeonMonsterComponet = await getDungeonMonster();

  await redisCli.set(`${dungeonMonsterTable}`, JSON.stringify(dungeonMonsterComponet));
};

export const getMonsterByDungeonId = async (dungeonId) => {
  const dungeonMonsterData = await redisCli.get(`${dungeonMonsterTable}`);

  const dungeonMonster = JSON.parse(dungeonMonsterData).filter(
    (dungeon) => dungeon.dungeonId === dungeonId,
  );

  return dungeonMonster;
};
