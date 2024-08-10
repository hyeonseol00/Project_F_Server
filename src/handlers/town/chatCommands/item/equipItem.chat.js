import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam, getUserByNickname } from '../../../../session/user.session.js';
import isInteger from '../../../../utils/isInteger.js';
import updateEquip from '../../../../utils/equip.js';
import updateUnEquip from '../../../../utils/unequip.js';
import { getItemById } from '../../../../assets/item.assets.js';
import Item from '../../../../classes/models/item.class.js';

export const equipItem = (user, message) => {
  const { weapon, armor, gloves, shoes, accessory } = user.equipment;
  const { level } = user.playerInfo.statInfo;

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

  const isItemByTable = getItemById(Number(message));
  const findItem = user.getItem(Number(message));
  const findItemInfo = getItemById(findItem.itemId);
  if (!isItemByTable) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: '[System] 없는 아이템 입니다.',
    });
    user.socket.write(response);

    return;
  } else if (!findItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${user.nickname}의 인벤토리에 아이템이 존재하지 않습니다.`,
    });
    user.socket.write(response);

    return;
  }

  const { itemId, itemType, itemName, requireLevel } = findItemInfo;
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
    itemId: itemId,
  });
  user.socket.write(equipResponse);
};
