import { getItemById } from '../../../assets/item.assets.js';
import {
  decItem,
  getPotionItems,
  getStatInfo,
  setStatInfo,
} from '../../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToActionScene from './switchScene/action.switch.js';

export default async function selectItemScene(responseCode, dungeon, socket) {
  const usedItemIdx = responseCode - 1;
  const player = dungeon.player;
  const playerStatInfo = await getStatInfo(socket);
  const potions = await getPotionItems(socket);
  const usedItem = potions[usedItemIdx];
  // 취소 버튼이면 action 선택씬으로 복귀
  if (responseCode === potions.length + 1) {
    switchToActionScene(dungeon, socket);
    return;
  }
  const usedItemInfo = await getItemById(usedItem.id);

  let msg = `${usedItemInfo.itemName}을 사용하여\n`;
  await decItem(socket, usedItem.id, 1);

  // S_SetPlayerHp 패킷
  if (usedItemInfo.itemHp && playerStatInfo.hp !== playerStatInfo.maxHp) {
    msg += `Player의 체력을 ${Math.floor(Math.min(usedItemInfo.itemHp, playerStatInfo.maxHp - playerStatInfo.hp))}만큼 회복했습니다.\n`;
    playerStatInfo.hp = Math.min(usedItemInfo.itemHp + playerStatInfo.hp, playerStatInfo.maxHp);
    const responseSetPlayerHp = createResponse('response', 'S_SetPlayerHp', {
      hp: playerStatInfo.hp,
    });
    socket.write(responseSetPlayerHp);
  }

  // S_SetPlayerMp 패킷
  if (usedItemInfo.itemMp && playerStatInfo.mp !== playerStatInfo.maxMp) {
    msg += `Player의 마나를 ${Math.floor(Math.min(usedItemInfo.itemMp, playerStatInfo.maxMp - playerStatInfo.mp))}만큼 회복했습니다.\n`;
    playerStatInfo.mp = Math.min(usedItemInfo.itemMp + playerStatInfo.mp, playerStatInfo.maxMp);
    const responseSetPlayerMp = createResponse('response', 'S_SetPlayerMp', {
      mp: playerStatInfo.mp,
    });
    socket.write(responseSetPlayerMp);
  }

  if (msg === `${usedItemInfo.itemName}을 사용하여\n`) {
    // 회복할 스탯이 없다면
    player.addItem(usedItem.id, 1);
    if (usedItemInfo.itemHp) msg = `이미 hp가 가득 찬 상태입니다.\n`;
    else if (usedItemInfo.itemMp) msg = `이미 mp가 가득 찬 상태입니다.\n`;
  } else {
    await setStatInfo(socket, playerStatInfo);
  }

  const btns = [{ msg: '다음', enable: true }];
  // S_BattleLog 패킷
  const battleLog = {
    msg,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.itemUsing;

  // 끝날 때 db에도 update
}
