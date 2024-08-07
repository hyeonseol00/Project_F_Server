import { getItemById } from '../session/item.session.js';
import { createResponse } from './response/createResponse.js';
import Item from '../classes/models/item.class.js';

let statInfo;
function updateUnEquip(uneqipItem, user) {
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed, critRate, avoidRate } =
    user.playerInfo.statInfo;

  const uneqipItemInfo = getItemById(uneqipItem);
  user.setItemId(uneqipItemInfo.itemType, 0);

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

  const updateCritical = critRate - uneqipItemInfo.itemCritical;
  const updateAvoidAbility = avoidRate - uneqipItemInfo.itemAvoidance;

  user.setStatInfo(statInfo);
  user.setCriAvoid(updateCritical, updateAvoidAbility);

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
