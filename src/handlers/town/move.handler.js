import { getUserById, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { userSessions } from '../../session/sessions.js';

const moveTownHandler = async ({ socket, userId, payload }) => {
  try {
    const { transform } = payload;

    console.log(
      `transform: x: ${transform.posX}, y: ${transform.posY}, z: ${transform.posZ}, angle: ${transform.rot}`,
    );

    const curUser = getUserBySocket(socket);
    //console.log("curUser", curUser);

    curUser.updatePosition(transform.posX, transform.posY, transform.posZ, transform.rot);

    const moveTownResponse = createResponse('response', 'S_Move', {
      playerId: curUser.playerId,
      transform,
    });

    // console.log("userSessions", userSessions);

    for (const user of userSessions) {
      
      if (user.playerId === curUser.playerId) continue;
      console.log(user.playerId);
      user.socket.write(moveTownResponse);
    }

    //socket.write(moveTownResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default moveTownHandler;
