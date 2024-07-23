import { instanceDungeonSessions } from './sessions.js';
import InstanceDungeon from '../classes/models/dungeon.class.js';

export const addDungeon = (playerId) => {
  const dungeon = new InstanceDungeon(playerId);
  instanceDungeonSessions.push(dungeon);

  return dungeon;
};

export const removeDungeon = (playerId) => {
  const index = instanceDungeonSessions.findIndex((dungeon) => dungeon.id === playerId);

  if (index !== -1) {
    return instanceDungeonSessions.splice(index, 1);
  }
};

export const getDungeonByUserId = (userId) => {
  return instanceDungeonSessions.find((dungeon) => dungeon.id === userId);
};
