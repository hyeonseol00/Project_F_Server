import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default function switchToGameOverWin(dungeon, socket) {
  const item = dungeon.selectItem;
  const player = dungeon.player;
  if (item.isPotion) {
    // 보상이 소비 아이템일 경우
    const potionIdx = player.getPotionIdx(item.name);
    if (potionIdx === -1) {
      // 아이템이 없으면 추가
      player.potions.push(item);
    } else {
      // 있으면 quantity 증가
      player.potions[potionIdx].quantity += item.quantity;
    }
  } else {
    // 보상이 장착 아이템일 경우
    const itemIdx = player.getPotionIdx(item.name);
    if (itemIdx === -1) {
      // 아이템이 없으면 추가
      player.mountingItems.push(item);
    } else {
      // 있으면 quantity 증가
      player.mountingItems[itemIdx].quantity += item.quantity;
    }
  }
  const msg = `${item.name}을 획득했습니다.\n마을로 귀환하겠습니다!`;
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
