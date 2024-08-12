import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';
import { getRegistCount } from './GaApplication.session.js';
import { checkAndStartQuest } from './quest.session.js';

export const addUser = (socket, nickname, characterClass, effect, items, character) => {
  const user = new User(
    getRegistCount(),
    nickname,
    characterClass,
    socket,
    effect,
    items,
    character,
  );

  if (!user.playerId) {
    console.error('User ID is not correctly initialized.');
    return null;
  }

  userSessions.push(user);

  const quest = checkAndStartQuest(user);
  if (quest) {
    user.socket.write(
      JSON.stringify({
        type: 'newQuest',
        data: { questId: quest.questId, questName: quest.questName },
      }),
    );
  }
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
