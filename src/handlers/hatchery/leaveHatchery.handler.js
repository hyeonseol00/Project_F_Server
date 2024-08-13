import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const leaveHatcheryHandler = ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    hatcherySession.removePlayer(user.nickname);

    const leaveHatcheryResponse = createResponse('response', 'S_LeaveDungeon', {});
    socket.write(leaveHatcheryResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveHatcheryHandler;
