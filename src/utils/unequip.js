import { getItemById } from '../session/item.session.js';
import { createResponse } from './response/createResponse.js';
import Item from '../classes/models/item.class.js';

let statInfo;
function updateUnEquip(uneqipItem, user) {
  const { critical, avoidAbility } = user;
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed } = user.playerInfo.statInfo;

  const uneqipItemInfo = getItemById(uneqipItem);
  user.updateItemId(uneqipItemInfo.itemType, 0);

  statInfo = {
    level,
    hp: maxHp - uneqipItemInfo.itemHp < hp ? maxHp - uneqipItemInfo.itemHp : hp,
    maxHp: maxHp - uneqipItemInfo.itemHp,
    mp: maxMp - uneqipItemInfo.itemMp < mp ? maxMp - uneqipItemInfo.itemMp : mp,
    maxMp: maxMp - uneqipItemInfo.itemMp,
    atk: atk - uneqipItemInfo.itemAttack,
    def: def - uneqipItemInfo.itemDefense,
    magic: magic - uneqipItemInfo.itemMagic,
    speed: speed - uneqipItemInfo.itemSpeed,
  };

  const updateCritical = critical - uneqipItemInfo.itemCritical;
  const updateAvoidAbility = avoidAbility - uneqipItemInfo.itemAvoidance;

  user.updateStatInfo(statInfo);
  user.updateCriAvoid(updateCritical, updateAvoidAbility);

  const isInven = user.findMountingItemByInven(uneqipItemInfo.itemId);
  if (!isInven) {
    const item = new Item(1, uneqipItemInfo);
    user.pushMountingItem(item);
  } else {
    user.addMountingItem(uneqipItemInfo.itemId, 1);
  }

  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] ${uneqipItemInfo.itemName} 장비를 해제했습니다.`,
  });
  user.socket.write(response);
}

export default updateUnEquip;
