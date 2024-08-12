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

  await redisCli.set(`${sessionManager}${user.playerId}`, JSON.stringify(user));
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
  const keys = await redisCli.keys(`${sessionManager}*`);
  if (!keys || keys.length === 0) {
    return false;
  }

  for (const key of keys) {
    const userData = await redisCli.get(key);
    if (userData) {
      const userObject = JSON.parse(userData);
      const user = User.fromJSON(userObject); // JSON을 User 인스턴스로 변환
      if (user.socket === socket) {
        return user; // User 인스턴스를 반환
        // await redisCli.del(user);
      }
    }
  }
};
// for (const user of allUser) {
// return redisCli.del(user);
// }

// export const getUserBySocket = async (socket) => {
//   const allUser = await redisCli.keys(${sessionManager}*);
//   if (allUser === null) {
//     return false;
//   }

//   const user = JSON.parse(allUser).find((user) => user.socket === socket);
//   return user;
// };
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
  const keys = await redisCli.keys(`${sessionManager}*`);
  const users = [];
  if (allUser === null) {
    return false;
  }
  for (const key of keys) {
    const user = await redisCli.get(key);
    if (user) {
      users.push(JSON.parse(user));
    }
  }
  return users;
  // return userSessions;
};

// export const getUsers = async () => {
//   const keys = await redisClient.keys(${USER_KEY_PREFIX}*);
//   const users = [];
//   for (const key of keys) {
//     const user = await redisClient.get(key);
//     if (user) {
//       users.push(JSON.parse(user));
//     }
//   }
//   return users;
// };

export const remove2 = async () => {
  const keys = await redisCli.keys(`${sessionManager}*`);
  for (const key of keys) {
    await redisCli.del(key);
  }
};
