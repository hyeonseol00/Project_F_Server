import { config } from '../config/config.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import leaveTownHandler from '../handlers/town/leave.handler.js';
import { removeDungeon } from '../session/dungeon.session.js';

export const onEnd = (socket) => async () => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(config.session.townId);

  if (gameSession.getUser(user)) {
    gameSession.removeUser(user.playerId);
  }
  removeDungeon(user.nickname);

  console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
  console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

  removeUser(socket);

  leaveTownHandler(socket, user);
};
