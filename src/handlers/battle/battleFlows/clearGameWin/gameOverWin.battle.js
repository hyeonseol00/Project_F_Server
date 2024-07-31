import { removeDungeon } from '../../../../session/dungeon.session.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default function gameOverWinScene(responseCode, dungeon, socket) {
  const nickname = dungeon.player.nickname;

  if (responseCode == 1) {
    const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
    socket.write(responseLeaveDungeon);
    console.log(dungeon.player.mountingItems);
    removeDungeon(nickname);
  }
}
