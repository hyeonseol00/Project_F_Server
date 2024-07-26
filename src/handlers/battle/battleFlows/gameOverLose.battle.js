import { removeDungeon } from '../../../session/dungeon.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function gameOverLoseScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
    socket.write(responseLeaveDungeon);

    removeDungeon(nickname);
  }
}
