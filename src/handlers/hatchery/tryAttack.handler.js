import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const tryAttackHatcheryHandler = async ({ socket, payload }) => {

  try {
    const {rotX, rotY, rotZ} = payload;

    const user = await getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    const nicknames = hatcherySession.playerNicknames;
    const players = [];
    for (let i = 0; i < nicknames.length; i++) {
      players.push(getUserByNickname(nicknames[i]));
    }

    // 근거리인 경우 전부 rot값이 전부 null전송됨. 하지만 코드는 돌아가죠? optional 좋다!
    const tryAttackResponse = createResponse('response', 'S_TryAttack', {
      playerId: user.playerId,
      rotX,
      rotY,
      rotZ
    });

    for (const player of players) {
      player.socket.write(tryAttackResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default tryAttackHatcheryHandler;
