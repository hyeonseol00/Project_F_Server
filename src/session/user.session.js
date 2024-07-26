import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import { getRegistCount } from './GaApplication.session.js';

export const addUser = (
  socket,
  playerId,
  characterClass,
  hp,
  mp,
  attack,
  defense,
  magic,
  speed,
  level,
) => {
  const user = new User(
    getRegistCount(),
    playerId,
    characterClass,
    socket,
    hp,
    mp,
    attack,
    defense,
    magic,
    speed,
    level,
  );
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);

  if (index !== -1) return userSessions.splice(index, 1)[0];
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.playerId === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
