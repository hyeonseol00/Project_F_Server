import { handleError } from '../../utils/error/errorHandler.js';
import { getUserBySocket } from '../../session/user.session.js';
import { itemTable } from '../../session/sessions.js';
import { getItemById } from '../../session/item.session.js';
import User from '../../classes/models/user.class.js';
import { getItemCostbyId } from '../../session/item.session.js';
import Item from '../../classes/models/item.class.js';
import { createResponse } from '../../utils/response/createResponse.js';

const buyItemHandler = async (user, message) => {
  console.log(Number(user.gold));
  //유저가 사고 싶은 아이템 ID 가져오기
  const [id, quantity] = message.split(' ');
  const buyItem = getItemById(Number(id));
  const itemCost = buyItem.itemCost;

  if (!buyItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: ` 존재하는 아이템이 아닙니다. `,
    });
    user.socket.write(response);
    return;
  }
  //유저 골드가 충분할 경우
  if (user.gold >= itemCost) {
    if (buyItem.itemType === 'potion') {
      //소비 아이템
      const potionIdx = user.getPotionIdx(buyItem.itemName);
      if (potionIdx === -1) {
        const potion = new Item(
          buyItem.itemId,
          buyItem.itemType,
          buyItem.itemName,
          buyItem.itemHp,
          buyItem.itemMp,
          buyItem.requireLevel,
          1,
          buyItem,
        );

        user.potions.push(buyItem);
      } else {
        addPotion(buyItem.itemId, quantity);
      }

      user.minusGold(itemCost);

      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: ` ${buyItem.itemName} 포션 구매가 완료되었습니다. 골드가 ${user.gold} 남았습니다.`,
      });
      user.socket.write(response);
      return;
    } else {
      //장비 아이템
      const itemInx = user.getItemIdx2(buyItem.itemId);
      if (itemInx == -1) {
        const item = new Item(
          buyItem.itemId,
          buyItem.itemType,
          buyItem.itemName,
          buyItem.itemHp,
          buyItem.itemMp,
          buyItem.requireLevel,
          1,
          buyItem,
        );
        user.pushMountingItem(item);
      } else {
        user.addMountingItem(buyItem.itemId, quantity);
      }
      user.minusGold(itemCost); //유저 DB에서 골드 수정

      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: ` ${buyItem.itemName} 아이템을 구매하였습니다. 남은 돈은 ${user.gold} 입니다. `,
      });
      user.socket.write(response);
      return;
    }
  } else {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: ` 돈이 부족합니다. `,
    });
    user.socket.write(response);
    return;
  }
};

export default buyItemHandler;
