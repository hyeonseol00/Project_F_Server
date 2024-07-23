import { config } from '../config/config.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handleError } from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

  const user = getUserBySocket(socket);
  const gameSession = getGameSession(config.session.townId);

  gameSession.removeUser(user.id);

  console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
  console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

  removeUser(socket);
};
