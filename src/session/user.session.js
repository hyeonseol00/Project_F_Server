import User from '../classes/models/user.class.js';
import { getRegistCount } from './GaApplication.session.js';
import { redisCli } from '../init/redis/redis.js';
import { getPlayerInfo } from '../classes/DBgateway/playerinfo.gateway.js';
import { userSessions } from './sessions.js';

const sessionManager = `userSession:`;
export const addUser = async (socket, effectCode, character) => {
  const user = {
    // session management field
    playerId: getRegistCount(),
    characterId: character.characterId,
    socket: socket,
    lastUpdateTime: Date.now(),
    nickname: character.characterName,

    // // players's game data
    // playerInfo : {
    //   playerId: curUser.playerId, // not neccessary
    //   nickname,
    //   class: characterClass,
    //   gold: curUser.gold,
    //   transform: transformInfo,  // not neccessary
    //   statInfo,
    //   inven,
    //   equipment,
    // },

    effectCode,
    worldLevel: character.worldLevel,
    skillPoint: character.skillPoint,
  };
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
export const getUserByNickname = (nickname) => {
  return userSessions.find((user) => user.nickname === nickname);
};

export const getAllMembersInTeam = (teamId) => {
  return userSessions.filter((user) => user.teamId === teamId);
};

export const getAllUsers = () => {
  return userSessions;
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
