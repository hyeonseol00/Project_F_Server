import { getItemById } from '../../assets/item.assets.js';
import { getLevelById } from '../../assets/level.assets.js';
import {
  addItem,
  getGold,
  getItemIdx,
  getStatInfo,
  pushItem,
  setGold,
  setStatInfo,
  skillPointUpdate,
} from '../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../config/config.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const hatcherySelectRewardHandler = async ({ socket, payload }) => {
  try {
    const targetUser = getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    const selectedBtn = payload.selectedBtn !== null ? payload.selectedBtn : 0;
    let itemName;

    /***** 아이템 지급 로직 *****/
    const items = [];
    const btnTexts = [];
    for (let i = 0; i < config.dropItem.quantity; i++) {
      const item = hatcherySession.getRandomItem();
      items.push(item);
      const itemInfo = await getItemById(items[i].id);
      btnTexts.push(`${itemInfo.itemName} x${items[i].quantity}`);

      if (i === selectedBtn) {
        itemName = itemInfo.itemName;
      }
    }
    const selectItem = items[selectedBtn];

    const itemIdx = await getItemIdx(socket, selectItem.id);
    if (itemIdx === -1) {
      await pushItem(socket, selectItem);
    } else {
      await addItem(socket, selectItem.id, selectItem.quantity);
    }

    const nicknames = hatcherySession.playerNicknames;
    for (let i = 0; i < nicknames.length; i++) {
      const user = getUserByNickname(nicknames[i]);

      /***** 골드 지급 로직 *****/
      const userStatInfo = await getStatInfo(user.socket);
      let playerExp = userStatInfo.exp + hatcherySession.boss.exp;
      let playerGold = Number(await getGold(user.socket)) + hatcherySession.boss.gold;

      await setGold(user.socket, playerGold);

      /***** 경험치 지급 로직 *****/
      const playerLevel = userStatInfo.level;
      const nextLevelData = await getLevelById(playerLevel + 1);

      if (playerExp >= nextLevelData.requiredExp && playerLevel < config.battleScene.maxLevel) {
        playerExp -= nextLevelData.requiredExp;

        userStatInfo.level = playerLevel + 1;
        userStatInfo.exp = playerExp;
        userStatInfo.maxHp += nextLevelData.hp;
        userStatInfo.maxMp += nextLevelData.mp;
        userStatInfo.hp = userStatInfo.maxHp;
        userStatInfo.mp = userStatInfo.maxMp;
        userStatInfo.atk += nextLevelData.attack;
        userStatInfo.def += nextLevelData.defense;
        userStatInfo.magic += nextLevelData.magic;
        userStatInfo.speed += nextLevelData.speed;
        userStatInfo.critRate += nextLevelData.critical;
        userStatInfo.critDmg += nextLevelData.criticalAttack;
        userStatInfo.avoidRate += nextLevelData.avoidAbility;

        skillPointUpdate(socket, user.skillPoint + nextLevelData.skillPoint);

        if ((playerLevel + 1) % 5 === 0) {
          user.worldLevel++;
        }
      } else {
        userStatInfo.exp = playerExp;
      }

      await setStatInfo(user.socket, userStatInfo);
    }

    /***** S_HatcheryConfirmReward *****/
    const confirmRewardResponse = createResponse('response', 'S_HatcheryConfirmReward', {
      selectedBtn,
      btnTexts,
      message:
        `${targetUser.nickname}님께서 ${itemName}을(를) 획득했습니다!\n` +
        `${hatcherySession.boss.exp} 경험치, ${hatcherySession.boss.gold}골드를 획득했습니다.\n\n` +
        '잠시 후 마을로 귀환합니다.',
    });

    for (const nickname of hatcherySession.playerNicknames) {
      const target = getUserByNickname(nickname);
      target.socket.write(confirmRewardResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default hatcherySelectRewardHandler;
