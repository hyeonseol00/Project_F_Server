import { instanceDungeonSessions } from './sessions.js';
import InstanceDungeon from '../classes/models/dungeon.class.js';

export const addDungeon = (nickname, dungeonCode) => {
  const dungeon = new InstanceDungeon(nickname, dungeonCode);
  instanceDungeonSessions.push(dungeon);

  return dungeon;
};

export const removeDungeon = (nickname) => {
  const index = instanceDungeonSessions.findIndex((dungeon) => dungeon.nickname === nickname);

  if (index !== -1) {
    return instanceDungeonSessions.splice(index, 1);
  }
};

export const getDungeonByNickname = (nickname) => {
  return instanceDungeonSessions.find((dungeon) => dungeon.nickname === nickname);
};
