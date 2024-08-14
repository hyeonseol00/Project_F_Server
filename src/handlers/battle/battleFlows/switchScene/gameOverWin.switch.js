import { getItemById } from '../../../../assets/item.assets.js';
import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { getItemIdx } from '../../../../classes/DBgateway/playerinfo.gateway.js';
import { addItem, pushItem } from '../../../../classes/DBgateway/playerinfo.gateway.js';
export default async function switchToGameOverWin(dungeon, socket) {
  const item = dungeon.selectItem;
  const itemInfo = await getItemById(item.id);
  const player = dungeon.player;

  // const itemIdx = player.getItemIdx(item.id);
  const itemIdx = await getItemIdx(socket, item.id);
  if (itemIdx === -1) {
    // 아이템이 없으면 추가
    // player.items.push(item);
    await pushItem(socket, item);
  } else {
    // 있으면 quantity 증가
    // player.items[itemIdx].quantity += item.quantity;
    await addItem(socket, item.id, item.quantity);
  }

  const msg = `${itemInfo.itemName}을 획득했습니다.\n마을로 귀환하겠습니다!`;
  const btns = [{ msg: '마을로 귀환', enable: true }];
  const battleLog = {
    msg,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.gameOverWin;
}
