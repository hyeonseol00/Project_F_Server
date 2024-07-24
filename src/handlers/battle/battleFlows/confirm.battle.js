import { config } from '../../../config/config.js';
import { getDungeonByUserId, removeDungeon } from '../../../session/dungeon.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToActionScene from './switchScene/action.switch.js';

export default function confirmScene(responseCode, dungeon, nickname, socket) {
  switch (responseCode) {
    case config.confirmButton.confirm:
      const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
      socket.write(responseLeaveDungeon);

      removeDungeon(nickname);
      break;
    case config.confirmButton.cancel:
      switchToActionScene(dungeon, socket);
      break;
  }
}
