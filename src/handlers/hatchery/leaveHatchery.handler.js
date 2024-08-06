import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const leaveHatchery = async ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);

    const leaveHatcheryResponse = createResponse('response', 'S_LeaveDungeon', {});
    user.socket.write(leaveHatcheryResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default leaveHatchery;
