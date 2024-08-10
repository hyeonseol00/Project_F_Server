import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam, getUserByNickname } from '../../../../session/user.session.js';
import isInteger from '../../../../utils/isInteger.js';
import updateEquip from '../../../../utils/equip.js';
import updateUnEquip from '../../../../utils/unequip.js';
import { getItemById } from '../../../../assets/item.assets.js';
import Item from '../../../../classes/models/item.class.js';

export const sellItem = async (user, message) => {
    const [id, quantity] = message.split(' ');
    const sellItem = getItemById(Number(id));
  
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
  
    if (Number(quantity) <= 0) {
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
    if (Number(id) === sellItem.itemId) {
      const findItem = user.getItem(Number(id));
      const findItemInfo = getItemById(Number(id));
  
      if (!findItem) {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] 인벤토리에 아이템이 존재하지 않습니다. `,
        });
        user.socket.write(response);
        return;
      }
  
      if (findItemInfo.itemType === 'potion') {
        if (findItem.quantity < Number(quantity)) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[System] 포션을 ${findItem.quantity}개 이상 판매할 수 없습니다. `,
          });
          user.socket.write(response);
          return;
        }
  
        const addGold = itemCost * Number(quantity) * 0.7;
        user.setGold(user.gold + Math.floor(addGold));
        user.decItem(sellItem.itemId, Number(quantity));
  
        if (user.getItemQuantity(sellItem.itemId) === 0) {
          user.deleteItem(sellItem.itemId);
        }
  
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${sellItem.itemName} 포션이 ${quantity}개 판매가 완료되었습니다. 골드가 ${user.gold} 있습니다.`,
        });
        user.socket.write(response);
  
        // S_SellItem 패킷 전송
        const sellItemResponse = createResponse('response', 'S_SellItem', {
          item: {
            id,
            quantity: user.getItemQuantity(id),
          },
          gold: user.gold,
        });
        user.socket.write(sellItemResponse);
        return;
      }
  
      if (findItemInfo.itemType !== 'potion') {
        if (findItem.quantity < Number(quantity)) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[System] ${findItem.quantity}개 이상 판매할 수 없습니다. `,
          });
          user.socket.write(response);
          return;
        }
  
        const addGold = itemCost * Number(quantity) * 0.7;
        user.setGold(user.gold + Math.floor(addGold));
        user.decItem(sellItem.itemId, Number(quantity));
  
        if (user.getItemQuantity(sellItem.itemId) === 0) {
          user.deleteItem(sellItem.itemId);
        }
  
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] ${sellItem.itemName} 아이템이 ${quantity}개 판매가 완료되었습니다. 골드가 ${user.gold} 있습니다.`,
        });
        user.socket.write(response);
  
        // S_SellItem 패킷 전송
        const sellItemResponse = createResponse('response', 'S_SellItem', {
          item: {
            id,
            quantity: user.getItem(id) ? user.getItem(id).quantity : 0,
          },
          gold: user.gold,
        });
        user.socket.write(sellItemResponse);
        return;
      }
    }
  };