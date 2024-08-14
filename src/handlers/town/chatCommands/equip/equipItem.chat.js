import { createResponse } from '../../../../utils/response/createResponse.js';
import isInteger from '../../../../utils/isInteger.js';
import updateEquip from './equip.js';
import { getItemById } from '../../../../assets/item.assets.js';
import { getItem, getPlayerInfo } from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const equipItem = async (user, message) => {
  const userInfo = await getPlayerInfo(user.socket);
  const { weapon, armor, gloves, shoes, accessory } = userInfo.equipment;
  const { level } = userInfo.statInfo;

  if (!isInteger(message)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 아이템 ID(숫자)를(를) 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  if (Number(message) <= 0) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 정확한 아이템ID를 입력하세요. `,
    });
    user.socket.write(response);
    return;
  }

  const isItemByTable = await getItemById(Number(message));
  if (!isItemByTable) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: '[System] 없는 아이템 입니다.',
    });
    user.socket.write(response);

    return;
  }

  const findItem = await getItem(user.socket, Number(message));
  if (!findItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${userInfo.nickname}의 인벤토리에 아이템이 존재하지 않습니다.`,
    });
    user.socket.write(response);

    return;
  }

  const findItemInfo = await getItemById(findItem.id);
  const { itemId: id, itemType, itemName, requireLevel } = findItemInfo;
  if (level < requireLevel) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${itemName} 장비는 레벨 ${requireLevel} 이상만 착용할 수 있습니다.`,
    });
    user.socket.write(response);

    return;
  }

  switch (itemType) {
    case 'weapon':
      updateEquip(weapon, findItemInfo, user);
      break;
    case 'armor':
      updateEquip(armor, findItemInfo, user);
      break;
    case 'gloves':
      updateEquip(gloves, findItemInfo, user);
      break;
    case 'shoes':
      updateEquip(shoes, findItemInfo, user);
      break;
    case 'accessory':
      updateEquip(accessory, findItemInfo, user);
      break;
    default:
      break;
  }
  // S_EquipWeapon 패킷 전송
  const equipResponse = createResponse('response', 'S_EquipWeapon', {
    itemId: id,
  });
  user.socket.write(equipResponse);
};
