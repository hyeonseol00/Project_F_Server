import { getItemById } from '../../session/item.session.js';
import Item from '../../classes/models/item.class.js';
import { createResponse } from '../../utils/response/createResponse.js';

function isInteger(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s === '' || isNaN(s)) return false; // 빈 문자열이거나 숫자가 아닌 경우 false 반환

  const num = Number(s);
  return Number.isInteger(num); // 정수인지 확인
}

const buyItemHandler = async (user, message) => {
  //유저가 사고 싶은 아이템 ID 가져오기
  const [id, quantity] = message.split(' ');
  const buyItem = getItemById(Number(id));

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
      chatMsg: `[System] 1개 이상만 구매할 수 있습니다. `,
    });
    user.socket.write(response);
    return;
  }

  if (!buyItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 존재하는 아이템이 아닙니다. `,
    });
    user.socket.write(response);
    return;
  }

  if (buyItem.itemCost === -1) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] ${buyItem.itemName}은 던전에서만 드랍 가능한 아이템입니다. `,
    });
    user.socket.write(response);
    return;
  }

  const itemCost = buyItem.itemCost * Number(quantity);
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
          Number(quantity),
          buyItem,
        );

        user.pushPotionItem(potion);
      } else {
        user.addPotion(buyItem.itemId, Number(quantity));
      }

      user.minusGold(itemCost);

      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] ${buyItem.itemName} 포션이 ${Number(quantity)}개 구매가 완료되었습니다. 골드가 ${user.gold} 남았습니다.`,
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
          Number(quantity),
          buyItem,
        );
        user.pushMountingItem(item);
      } else {
        user.addMountingItem(buyItem.itemId, Number(quantity));
      }
      user.minusGold(itemCost);

      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] ${buyItem.itemName} 아이템을 ${Number(quantity)}개 구매하였습니다. 남은 돈은 ${user.gold} 입니다. `,
      });
      user.socket.write(response);
      return;
    }
  } else {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 돈이 부족합니다. `,
    });
    user.socket.write(response);
    return;
  }
};

export default buyItemHandler;
