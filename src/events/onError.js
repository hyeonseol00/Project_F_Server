import { config } from '../config/config.js';
import { removeDungeon } from '../session/dungeon.session.js';
import { getGameSession } from '../session/game.session.js';
import { getHatcherySession } from '../session/hatchery.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handleError } from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

  const user = getUserBySocket(socket);
  const gameSession = getGameSession(config.session.townId);
  const hatcherySession = getHatcherySession();

  if (user) {
    const sessionItems = [...user.potions, ...user.mountingItems];

    gameSession.removeUser(user.playerId);
    hatcherySession.removePlayer(user.nickname);

    updateCharacterStatus(user);
    updateCharacterItems(user.characterId, sessionItems);
  }
  removeDungeon(user.nickname);

  console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
  console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

  removeUser(socket);
};
