import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import { getRegistCount } from './GaApplication.session.js';
import { redisCli } from '../init/redis/redis.js';

const sessionManager = `userSession:`;
export const addUser = async (socket, nickname, characterClass, effect, items, character) => {
  const user = new User(
    getRegistCount(),
    nickname,
    characterClass,
    socket,
    effect,
    items,
    character,
  );
  await redisCli.hSet(`${sessionManager}`, `${user.playerId}`, JSON.stringify(user));
  return user;
};

export const removeUser = async (socket) => {
  const allUser = await redisCli.get(`${sessionManager}*`);
  if (allUser === null) {
    return false;
  }
  const user = JSON.parse(allUser).find((user) => user.socket === socket);
  if (user) {
    await redisCli.del(`${user.playerId}:${socket}:${user.nickname}`);
    return user;
  }
  // const index = userSessions.findIndex((user) => user.socket === socket);
  // if (index !== -1) return userSessions.splice(index, 1)[0];
};

// export const getUserById = (id) => {
//   return redisCli.get(`${id}:${user.socket}`);
//   // return userSessions.find((user) => user.playerId === id);
// };

export const getUserBySocket = async (socket) => {
  const allUser = await redisCli.hGet(`${sessionManager}`, `*`);
  console.log(allUser);
  if (allUser === null) {
    return false;
  }
  const user = JSON.parse(allUser).find((user) => user.socket === socket);
  return user;
  // return userSessions.find((user) => user.socket === socket);
};
export const getUserByNickname = async (nickname) => {
  const allUser = await redisCli.get(`${sessionManager}*`);
  if (allUser === null) {
    return false;
  }

  const user = JSON.parse(allUser).find((user) => user.nickname === nickname);
  return user;
  // return userSessions.find((user) => user.nickname === nickname);
};

export const getAllMembersInTeam = async (teamId) => {
  const allUser = await redisCli.get(`${sessionManager}*`);
  if (allUser === null) {
    return false;
  }
  const user = JSON.parse(allUser).filter((user) => user.teamId === teamId);
  return user;
};

export const getAllUsers = async () => {
  const allUser = await redisCli.get(`${sessionManager}*`);
  if (allUser === null) {
    return false;
  }
  return JSON.parse(allUser);
  // return userSessions;
};
