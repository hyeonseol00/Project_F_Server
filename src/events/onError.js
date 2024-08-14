import { config } from '../config/config.js';
import { removeDungeon } from '../session/dungeon.session.js';
import { getGameSession } from '../session/game.session.js';
import { getHatcherySession } from '../session/hatchery.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { handleError } from '../utils/error/errorHandler.js';
import { updateCharacterStatus } from '../db/user/user.db.js';
import { updateCharacterItems } from '../db/user/items/items.db.js';
import leaveTownHandler from '../handlers/town/leave.handler.js';
import { getInven } from '../classes/DBgateway/playerinfo.gateway.js';

export const onError = (socket) => async (err) => {
  try {
    handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

    const user = await getUserBySocket(socket);
    const gameSession = getGameSession(config.session.townId);
    const hatcherySession = getHatcherySession();

    if (user) {
      gameSession.removeUser(user.nickname);
      hatcherySession.removePlayer(user.nickname);
      const inventory = await getInven(socket);
      updateCharacterStatus(user);
      updateCharacterItems(user.characterId, inventory);
    }
    removeDungeon(user.nickname);

    console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
    console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

    leaveTownHandler(socket, user);

    await removeUser(socket);
  } catch (err) {
    handleError(socket, err);
  }
};
