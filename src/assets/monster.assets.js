import { getDungeonMonster, getMonster } from '../db/game/game.db.js';
import { monsterTable } from './assets.js';
import { dungeonMonster } from './assets.js';

export const loadMonsterTable = async () => {
  const monsterComponet = await getMonster();
  monsterComponet.forEach((monster) => {
    monsterTable.push(monster);
  });
};

export const loadDungeonMonster = async () => {
  const monsterComponet = await getDungeonMonster();
  monsterComponet.forEach((monster) => {
    dungeonMonster.push(monster);
  });
};

export const getMonsterByDungeonId = (dungeonId) => {
  return dungeonMonster.filter((dungeon) => dungeon.dungeonId === dungeonId);
};

export const getMonsterById = (monsterId) => {
  if (monsterId !== 0) {
    return monsterTable.find((monster) => monster.monsterId === monsterId);
  }
};
