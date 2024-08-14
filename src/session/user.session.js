import { getPlayerInfo, getTeam } from '../classes/DBgateway/playerinfo.gateway.js';
import { getRegistCount } from './GaApplication.session.js';
import { userSessions } from './sessions.js';

export const addUser = async (socket, effectCode, character) => {
  const user = {
    playerId: getRegistCount(),
    characterId: character.characterId,
    socket: socket,
    lastUpdateTime: Date.now(),
    nickname: character.characterName,
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

export const getAllMembersInTeam = async (teamId) => {
  const result = [];

  for (const key in userSessions) {
    const team = await getTeam(userSessions[key].socket);

    if (team.teamId === teamId) {
      result.push(userSessions[key]);
    }
  }

  return result;
};

export const getAllUsers = () => {
  return userSessions;
};
