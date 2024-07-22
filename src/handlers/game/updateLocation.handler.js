import { getGameSession } from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { config } from '../../config/config.js';

const updateLocationHandler = ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const gameId = config.session.id;
    const gameSession = getGameSession(gameId);

    if (!gameSession)
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');

    const user = gameSession.getUser(userId);
    if (!user) throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');

    const packet = gameSession.getAllLocation(userId, x, y);

    socket.write(packet);
  } catch (err) {
    handleError(socket, err);
  }
};

export default updateLocationHandler;
