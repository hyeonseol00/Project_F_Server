import Item from '../../../../classes/models/item.class.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import { getItemById } from '../../../../assets/item.assets.js';
import {
  addItem,
  decItem,
  deleteItem,
  getItem,
  getItemQuantity,
  getPlayerInfo,
  pushItem,
  setItemId,
  setStatInfo,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';

let statInfo;
const quantity = 1;
async function updateEquip(equippedItem, findItemInfo, user) {
  const userInfo = await getPlayerInfo(user.socket);
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed, critRate, critDmg, avoidRate, exp } =
    userInfo.statInfo;

  const {
    itemId: id,
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
    await setItemId(user.socket, itemType, id);

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

    await setStatInfo(user.socket, statInfo);

    const isInven = await getItem(user.socket, equippedItem);
    if (!isInven) {
      const item = new Item(equippedItem, quantity);
      await pushItem(user.socket, item);
      if ((await getItemQuantity(user.socket, id)) === 1) {
        await deleteItem(user.socket, id);
      } else {
        await decItem(user.socket, id, quantity);
      }
    } else {
      await addItem(user.socket, isInven.id, quantity);
      if ((await getItemQuantity(user.socket, id)) === 1) {
        await deleteItem(user.socket, id);
      } else {
        await decItem(user.socket, id, quantity);
      }
    }

    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${equippedItemInfo.itemName}을(를) 해제하고 ${itemName}을(를) 장착했습니다.`,
    });
    user.socket.write(response);
  } else {
    await setItemId(user.socket, itemType, id);
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

    await setStatInfo(user.socket, statInfo);

    if ((await getItemQuantity(user.socket, id)) === 1) {
      await deleteItem(user.socket, id);
    } else {
      await decItem(user.socket, id, quantity);
    }

    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${itemName}을(를) 장착했습니다.`,
    });
    user.socket.write(response);
  }
}

export default updateEquip;
