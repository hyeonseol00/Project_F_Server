import { loadLevelTable } from '../../../assets/level.assets.js';
import { loadItemTable } from '../../../assets/item.assets.js';
import { loadMonsterTable } from '../../../assets/monster.assets.js';
import { loadDungeonMonster } from '../../../assets/monster.assets.js';
import { loadDungeonItem } from '../../../assets/item.assets.js';

export const redisConnect = async () => {
  console.info('Redis connected');
  await loadLevelTable();
  await loadItemTable();
  await loadMonsterTable();
  await loadDungeonMonster();
  await loadDungeonItem();
};
