import Item from '../classes/models/item.class.js';
import { createResponse } from './response/createResponse.js';
import { getItemById } from '../assets/item.assets.js';

let statInfo;
const quantity = 1;
async function updateEquip(equippedItem, findItemInfo, user) {
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed, critRate, critDmg, avoidRate, exp } =
    user.playerInfo.statInfo;

  const {
    itemId,
    itemType,
    itemName,
    itemHp,
    itemMp,
    itemAttack,
    itemDefense,
    itemMagic,
    itemSpeed,
    itemAvoidance,
    itemCritical,
  } = findItemInfo;

  if (equippedItem !== 0) {
    const equippedItemInfo = await getItemById(equippedItem);
    user.setItemId(itemType, itemId);

    const updateCritical = critRate + itemCritical - equippedItemInfo.itemCritical;
    const updateAvoidAbility = avoidRate + itemAvoidance - equippedItemInfo.itemAvoidance;

    statInfo = {
      level,
      hp:
        maxHp + itemHp - equippedItemInfo.itemHp < hp
          ? maxHp + itemHp - equippedItemInfo.itemHp
          : hp,
      maxHp: maxHp + itemHp - equippedItemInfo.itemHp,
      mp:
        maxMp + itemMp - equippedItemInfo.itemMp < mp
          ? maxMp + itemMp - equippedItemInfo.itemMp
          : mp,
      maxMp: maxMp + itemMp - equippedItemInfo.itemMp,
      atk: atk + itemAttack - equippedItemInfo.itemAttack,
      def: def + itemDefense - equippedItemInfo.itemDefense,
      magic: magic + itemMagic - equippedItemInfo.itemMagic,
      speed: speed + itemSpeed - equippedItemInfo.itemSpeed,
      critRate: updateCritical,
      critDmg,
      avoidRate: updateAvoidAbility,
      exp,
    };

    user.setStatInfo(statInfo);

    const isInven = user.getItem(equippedItem);
    if (!isInven) {
      const item = new Item(equippedItem, quantity);
      user.pushItem(item);
      if (user.getItemQuantity(itemId) === 1) {
        user.deleteItem(itemId);
      } else {
        user.decItem(itemId, quantity);
      }
    } else {
      user.addItem(isInven.itemId, quantity);
      if (user.getItemQuantity(itemId) === 1) {
        user.deleteItem(itemId);
      } else {
        user.decItem(itemId, quantity);
      }
    }

    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${equippedItemInfo.itemName}을(를) 해제하고 ${itemName}을(를) 장착했습니다.`,
    });
    user.socket.write(response);
  } else {
    user.setItemId(itemType, itemId);
    const updateCritical = critRate + itemCritical;
    const updateAvoidAbility = avoidRate + itemAvoidance;

    statInfo = {
      level,
      hp: hp,
      maxHp: maxHp + itemHp,
      mp: mp,
      maxMp: maxMp + itemMp,
      atk: atk + itemAttack,
      def: def + itemDefense,
      magic: magic + itemMagic,
      speed: speed + itemSpeed,
      critRate: updateCritical,
      critDmg,
      avoidRate: updateAvoidAbility,
      exp,
    };

    user.setStatInfo(statInfo);

    if (user.getItemQuantity(itemId) === 1) {
      user.deleteItem(itemId);
    } else {
      user.decItem(itemId, quantity);
    }

    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${itemName}을(를) 장착했습니다.`,
    });
    user.socket.write(response);
  }
}

export default updateEquip;
