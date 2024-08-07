import { getMonster } from '../db/game/game.db.js';
import { monsterTable } from './sessions.js';

export const loadMonsterTable = async () => {
  const monsterComponet = await getMonster();
  monsterComponet.forEach((monster) => {
    monsterTable.push(monster);
  });
};
