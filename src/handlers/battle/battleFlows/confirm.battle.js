import { config } from '../../../config/config.js';
import { getDungeonByUserId, removeDungeon } from '../../../session/dungeon.session.js';
import { createResponse, createResponseAsync } from '../../../utils/response/createResponse.js';
import switchToActionScene from './switchScene/action.switch.js';

export default async function confirmScene(responseCode, dungeon, nickname, socket) {
  switch (responseCode) {
    case config.confirmButton.confirm:
      const responseLeaveDungeon = await createResponseAsync('response', 'S_LeaveDungeon', {});
      socket.write(responseLeaveDungeon);

      removeDungeon(nickname);
      break;
    case config.confirmButton.cancel:
      await switchToActionScene(dungeon, socket);
      break;
  }
}
