import { getItemById } from '../../../../assets/item.assets.js';
import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default async function dropItemScene(responseCode, dungeon, socket) {
  const selectNumber = responseCode - 1;
  const items = [];
  for (let i = 0; i < config.dropItem.quantity; i++) {
    items.push(dungeon.getRandomItem());
  }
  dungeon.selectItem = items[selectNumber];

  const btns = [];
  for (let i = 0; i < config.dropItem.quantity; i++) {
    const itemInfo = getItemById(items[i].itemId);
    btns.push({ msg: `${itemInfo.itemName} x${items[i].quantity}`, enable: false });
  }
  btns[selectNumber].enable = true;

  const battleLog = {
    msg: `보상을 획득하세요!`,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.goToTown;
}
