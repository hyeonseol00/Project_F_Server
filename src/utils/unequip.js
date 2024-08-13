import { getItemById } from '../assets/item.assets.js';
import { createResponse } from './response/createResponse.js';
import Item from '../classes/models/item.class.js';
import {
  addItem,
  getItem,
  getPlayerInfo,
  pushItem,
  setItemId,
  setStatInfo,
} from '../classes/DBgateway/playerinfo.gateway.js';

let statInfo;
const quantity = 1;
const itemId = 0;
async function updateUnEquip(uneqipItem, user) {
  const userInfo = await getPlayerInfo(user.socket);
  const { level, hp, maxHp, mp, maxMp, atk, def, magic, speed, critRate, critDmg, avoidRate, exp } =
    userInfo.statInfo;

  const uneqipItemInfo = await getItemById(uneqipItem);
  await setItemId(user.socket, uneqipItemInfo.itemType, itemId);

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

  await setStatInfo(user.socket, statInfo);

  const isInven = await getItem(user.socket, uneqipItemInfo.itemId);
  if (!isInven) {
    const item = new Item(uneqipItem, quantity);
    await pushItem(user.socket, item);
  } else {
    await addItem(user.socket, uneqipItemInfo.itemId, quantity);
  }

  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] ${uneqipItemInfo.itemName} 장비를 해제했습니다.`,
  });
  user.socket.write(response);
}

export default updateUnEquip;
