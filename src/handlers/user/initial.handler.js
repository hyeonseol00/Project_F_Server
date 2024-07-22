import { addUser, getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';
import joinGameHandler from '../game/joinGame.handler.js';
import createGameHandler from '../game/createGame.handler.js';
import { config } from '../../config/config.js';
import { insertUserByUsername, findUserByUsername } from '../../db/backup/coordinates.db.js';
import CustomError from '../../utils/error/customError.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, playerId, latency } = payload;
    const gameSession = getGameSession(config.session.id);
    const user = getUserById(playerId);
    if (user) throw new CustomError(ErrorCodes.DUPLICATE_DEVICE_ID, '중복된 deviceId 입니다.');

    let userData = await findUserByUsername(deviceId);
    if (!userData) userData = await insertUserByUsername(deviceId);

    addUser(socket, deviceId, playerId, latency, userData.x, userData.y);

    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      {
        userId: deviceId,
        x: userData.x,
        y: userData.y,
      },
      playerId,
      'InitData',
    );

    socket.write(initialResponse);

    if (!gameSession)
      createGameHandler({ socket, userId: deviceId, payload: { gameId: config.session.id } });
    else joinGameHandler({ socket, userId: deviceId, payload: { gameId: config.session.id } });
  } catch (err) {
    handleError(socket, err);
  }
};

export default initialHandler;
