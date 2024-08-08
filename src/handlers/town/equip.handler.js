import isInteger from '../../utils/isInteger.js';
import updateEquip from '../../utils/equip.js';
import { getItemById } from '../../assets/item.assets.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const equipHandler = (user, message) => {
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
  const findItem = user.findMountingItemByInven(Number(message));
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

  const { itemId, itemType, name, requireLevel } = findItem;
  if (level < requireLevel) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${name} 장비는 레벨 ${requireLevel} 이상만 착용할 수 있습니다.`,
    });
    user.socket.write(response);

    return;
  }

  // updateEquip(findItem.itemType, findItem, user);
  switch (findItem.itemType) {
    case 'weapon':
      updateEquip(weapon, findItem, user);
      break;
    case 'armor':
      updateEquip(armor, findItem, user);
      break;
    case 'gloves':
      updateEquip(gloves, findItem, user);
      break;
    case 'shoes':
      updateEquip(shoes, findItem, user);
      break;
    case 'accessory':
      updateEquip(accessory, findItem, user);
      break;
    default:
      break;
  }
  // S_EquipWeapon 패킷 전송
  const equipResponse = createResponse('response', 'S_EquipWeapon', {
    itemId: itemId,
    itemType: itemType,
  });
  user.socket.write(equipResponse);
};
