import { getItemById } from '../../../../assets/item.assets.js';
import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default function switchToGameOverWin(dungeon, socket) {
  const item = dungeon.selectItem;
  const itemInfo = getItemById(item.itemId);
  const player = dungeon.player;

  const itemIdx = player.getItemIdx(item.itemId);
  if (itemIdx === -1) {
    // 아이템이 없으면 추가
    player.items.push(item);
  } else {
    // 있으면 quantity 증가
    player.items[itemIdx].quantity += item.quantity;
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
