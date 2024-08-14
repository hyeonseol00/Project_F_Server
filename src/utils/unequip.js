import { getItemById } from '../assets/item.assets.js';
import { createResponse } from './response/createResponse.js';
import Item from '../classes/models/item.class.js';

let statInfo;
const quantity = 1;
const itemId = 0;
async function updateUnEquip(uneqipItem, user) {
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed, critRate, critDmg, avoidRate, exp } =
    user.playerInfo.statInfo;

  const uneqipItemInfo = await getItemById(uneqipItem);
  user.setItemId(uneqipItemInfo.itemType, itemId);

  const updateCritical = critRate - uneqipItemInfo.itemCritical;
  const updateAvoidAbility = avoidRate - uneqipItemInfo.itemAvoidance;

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
    critRate: updateCritical,
    critDmg,
    avoidRate: updateAvoidAbility,
    exp,
  };

  user.setStatInfo(statInfo);

  const isInven = user.getItem(uneqipItemInfo.itemId);
  if (!isInven) {
    const item = new Item(uneqipItem, quantity);
    user.pushItem(item);
  } else {
    user.addItem(uneqipItemInfo.itemId, quantity);
  }

  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] ${uneqipItemInfo.itemName} 장비를 해제했습니다.`,
  });
  user.socket.write(response);
}

export default updateUnEquip;
