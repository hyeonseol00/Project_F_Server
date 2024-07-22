import { config } from '../config/config.js';
import { updateUserBackupCoordinate } from '../db/backup/coordinates.db.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';

export const onEnd = (socket) => async () => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(config.session.id);

  await updateUserBackupCoordinate(user.id, user.x, user.y);

  gameSession.removeUser(user.id);

  console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
  console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

  removeUser(socket);
};
