import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function selectItemScene(responseCode, dungeon, socket) {
  const usedItemIdx = responseCode - 1;
  const player = dungeon.player;
  const playerStatInfo = player.playerInfo.statInfo;
  const usedItem = player.items[usedItemIdx];

  let msg = `${usedItem.name}을 사용하여\n`;
  usedItem.quantity--;

  // S_SetPlayerHp 패킷
  if (usedItem.hp && playerStatInfo.hp !== playerStatInfo.maxHp) {
    msg += `Player의 체력을 ${Math.floor(Math.min(usedItem.hp, playerStatInfo.maxHp - playerStatInfo.hp))}만큼 회복했습니다.\n`;
    playerStatInfo.hp = Math.min(usedItem.hp + playerStatInfo.hp, playerStatInfo.maxHp);
    const responseSetPlayerHp = createResponse('response', 'S_SetPlayerHp', {
      hp: playerStatInfo.hp,
    });
    socket.write(responseSetPlayerHp);
  }

  // S_SetPlayerMp 패킷
  if (usedItem.mp && playerStatInfo.mp !== playerStatInfo.maxMp) {
    msg += `Player의 마나를 ${Math.floor(Math.min(usedItem.mp, playerStatInfo.maxMp - playerStatInfo.mp))}만큼 회복했습니다.\n`;
    playerStatInfo.mp = Math.min(usedItem.mp + playerStatInfo.mp, playerStatInfo.maxMp);
    const responseSetPlayerMp = createResponse('response', 'S_SetPlayerMp', {
      mp: playerStatInfo.mp,
    });
    socket.write(responseSetPlayerMp);
  }

  // exp 증가
  if (usedItem.exp) {
    player.experience += usedItem.exp;
    msg += `Player의 경험치가 ${usedItem.exp}만큼 증가했습니다.\n`;
  }

  if (msg === `${usedItem.name}을 사용하여\n`) {
    // 회복할 스탯이 없다면
    usedItem.quantity++;
    if (usedItem.hp) msg = `이미 hp가 가득 찬 상태입니다.        \n`;
    if (usedItem.mp) msg = `이미 mp가 가득 찬 상태입니다.         \n`;
    if (usedItem.hp && usedItem.mp) msg = `이미 hp, mp가 가득 찬 상태입니다.\n`;
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
