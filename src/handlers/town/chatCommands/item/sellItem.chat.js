import { createResponse } from '../../../../utils/response/createResponse.js';
import isInteger from '../../../../utils/isInteger.js';
import { getItemById } from '../../../../assets/item.assets.js';
import {
  decItem,
  deleteItem,
  getItem,
  getItemQuantity,
  getPlayerInfo,
  setGold,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const sellItem = async (user, message) => {
  const [stringId, stringQuantity] = message.split(' ');
  const id = Number(stringId),
    quantity = Number(stringQuantity);
  const userInfo = await getPlayerInfo(user.socket);
  const sellItem = await getItemById(id);

  if (!isInteger(id)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 아이템 ID(숫자)를(를) 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  if (!isInteger(quantity)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 수량(숫자)을(를) 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  if (quantity <= 0) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 1개 이상만 판매할 수 있습니다. `,
    });
    user.socket.write(response);
    return;
  }

  if (!sellItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 존재하는 아이템이 아닙니다. `,
    });
    user.socket.write(response);
    return;
  }

  if (sellItem.itemCost === -1) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 판매가 불가능한 아이템입니다. `,
    });
    user.socket.write(response);
    return;
  }

  const itemCost = sellItem.itemCost;
  // 아이템 테이블과 팔고 싶은 아이템 ID가 같을 경우
  if (id === sellItem.id) {
    const findItem = await getItem(user.socket, id);
    const findItemInfo = await getItemById(id);

    if (!findItem) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 인벤토리에 아이템이 존재하지 않습니다. `,
      });
      user.socket.write(response);
      return;
    }

    if (findItemInfo.itemType === 'potion') {
      if (findItem.quantity < quantity) {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] 포션을 ${findItem.quantity}개 이상 판매할 수 없습니다. `,
        });
        user.socket.write(response);
        return;
      }

      const addGold = itemCost * quantity * 0.7;
      const leftGold = userInfo.gold + Math.floor(addGold);
      await setGold(user.socket, leftGold);
      await decItem(user.socket, sellItem.id, quantity);

      if ((await getItemQuantity(user.socket, sellItem.id)) === 0) {
        await deleteItem(user.socket, sellItem.id);
      }

      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] ${sellItem.itemName} 포션이 ${quantity}개 판매가 완료되었습니다. 골드가 ${leftGold} 있습니다.`,
      });
      user.socket.write(response);

      // S_SellItem 패킷 전송
      const sellItemResponse = createResponse('response', 'S_SellItem', {
        item: {
          id,
          quantity: await getItemQuantity(user.socket, id),
        },
        gold: leftGold,
      });
      user.socket.write(sellItemResponse);
      return;
    }

    if (findItemInfo.itemType !== 'potion') {
      if (findItem.quantity < quantity) {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${findItem.quantity}개 이상 판매할 수 없습니다. `,
        });
        user.socket.write(response);
        return;
      }

      const addGold = itemCost * quantity * 0.7;
      const leftGold = userInfo.gold + Math.floor(addGold);
      await setGold(user.socket, leftGold);
      await decItem(user.socket, sellItem.id, quantity);

      if ((await getItemQuantity(user.socket, sellItem.id)) === 0) {
        await deleteItem(user.socket, sellItem.id);
      }

      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] ${sellItem.itemName} 아이템이 ${quantity}개 판매가 완료되었습니다. 골드가 ${leftGold} 있습니다.`,
      });
      user.socket.write(response);

      // S_SellItem 패킷 전송
      const sellItemResponse = createResponse('response', 'S_SellItem', {
        item: {
          id,
          quantity: await getItemQuantity(user.socket, id),
        },
        gold: leftGold,
      });
      user.socket.write(sellItemResponse);
      return;
    }
  }
};
