import { getItemById } from '../../session/item.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

function isInteger(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s === '' || isNaN(s)) return false; // 빈 문자열이거나 숫자가 아닌 경우 false 반환

  const num = Number(s);
  return Number.isInteger(num); // 정수인지 확인
}

const sellItemHandler = async (user, message) => {
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
      chatMsg: `[System] 구매할 수량(숫자)을(를) 입력하세요.`,
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
  //아이템 테이블과 팔고싶은 아이템 ID가 같을 경우
  if (Number(id) === sellItem.itemId) {
    const findItem = user.findItemByInven(Number(id));
    // 아이템이 인벤토리 없을 때, 인벤토리보다 더 많이 파려고 할 때, 정상적일 떄
    if (!findItem) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 인벤토리에 아이템이 존재하지 않습니다. `,
      });
      user.socket.write(response);
      return;
    } else {
      if (findItem.itemType === 'potion') {
        if (findItem.quantity < Number(quantity)) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[System] 포션을 ${findItem.quantity}개 이상 판매할 수 없습니다. `,
          });
          user.socket.write(response);
          return;
        } else {
          const addGold = itemCost * Number(quantity) * 0.7;
          user.plusGold(addGold);
          user.decPotion(sellItem.itemId, Number(quantity));

          if (user.getPotionItemQuantity(findItem.itemId) === 0) {
            user.deletePotionItem(findItem.itemId);
          }

          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[System] ${sellItem.itemName} 포션이 ${quantity}개 판매가 완료되었습니다. 골드가 ${user.gold} 있습니다.`,
          });
          user.socket.write(response);
          return;
        }
      } else {
        if (findItem.quantity < Number(quantity)) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[System] ${findItem.quantity}개 이상 판매할 수 없습니다. `,
          });
          user.socket.write(response);
          return;
        } else {
          const addGold = itemCost * Number(quantity) * 0.7;
          user.plusGold(Math.floor(addGold));
          user.decMountingItem(sellItem.itemId, Number(quantity));

          if (user.getItemQuantity(findItem.itemId) === 0) {
            user.deleteMountingItem(findItem.itemId);
          }

          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[System] ${sellItem.itemName} 아이템이 ${quantity}개 판매가 완료되었습니다. 골드가 ${user.gold} 있습니다.`,
          });
          user.socket.write(response);
          return;
        }
      }
    }
  }
};

export default sellItemHandler;
