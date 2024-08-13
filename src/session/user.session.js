import User from '../classes/models/user.class.js';
import { getRegistCount } from './GaApplication.session.js';
import { redisCli } from '../init/redis/redis.js';

const sessionManager = `userSession:`;
export const addUser = async (socket, effect, character) => {
  const user = {
    // session management field
    playerId: getRegistCount(),
    characterId: character.characterId,
    socket: socket,
    lastUpdateTime: Date.now(),

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
    // skillPoint : character.skillPoint,
    // worldLevel : character.worldLevel,
  };
  await redisCli.set(`${sessionManager}${socket.remotePort}`, JSON.stringify(user));
  return user;
};

export const removeUser = async (socket) => {
  const user = await redisCli.get(`${sessionManager}${socket.remotePort}`);

  if (user) {
    await redisCli.del(`${sessionManager}${socket.remotePort}`);
    return user;
  } else {
    console.log('user is not found...');
  }
};

export const getUserBySocket = async (socket) => {
  const user = await redisCli.get(`${sessionManager}${socket.remotePort}`);
  if (user) {
    return user;
  } else {
    console.log('user is not found...');
  }

  return null;
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
