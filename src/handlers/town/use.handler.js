import { getItemById } from '../../session/item.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

function isInteger(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s === '' || isNaN(s)) return false; // 빈 문자열이거나 숫자가 아닌 경우 false 반환

  const num = Number(s);
  return Number.isInteger(num); // 정수인지 확인
}

// user 객체 내에 포션 아이템을 찾는 함수 추가
function findPotionById(user, itemId) {
  return user.potions.find((potion) => potion.itemId === itemId);
}

export const useHandler = (user, message) => {
  const { hp, maxHp, mp, maxMp } = user.playerInfo.statInfo;

  if (!isInteger(message)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 아이템 ID(숫자)를(를) 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  const itemId = Number(message);
  const findItem = findPotionById(user, itemId);

  if (!findItem) {
    console.log(`아이템을 찾을 수 없습니다. itemId: ${itemId}`);
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 사용 가능한 아이템이 아닙니다.`,
    });
    user.socket.write(response);
    return;
  }

  if (findItem.itemType !== 'potion') {
    console.log(`아이템 유형이 포션이 아닙니다. itemType: ${findItem.itemType}`);
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 사용 가능한 아이템이 아닙니다.`,
    });
    user.socket.write(response);
    return;
  }

  // `getItemById` 함수로 포션의 상세 정보를 가져옴
  const itemInfo = getItemById(itemId);
  const { itemHp, itemMp } = itemInfo;
  const { quantity, name: itemName } = findItem;

  console.log(
    `사용하려는 아이템: ${itemName}, HP 증가량: ${itemHp}, MP 증가량: ${itemMp}, 현재 수량: ${quantity}`,
  );

  if (quantity <= 0) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 아이템의 수량이 부족합니다.`,
    });
    user.socket.write(response);
    return;
  }

  // HP와 MP를 증가시킴
  const newHp = Math.min(hp + itemHp, maxHp);
  const newMp = Math.min(mp + itemMp, maxMp);

  // 상태 업데이트
  user.playerInfo.statInfo.hp = newHp;
  user.playerInfo.statInfo.mp = newMp;
  user.decPotion(itemId, 1);

  const updatedQuantity = user.getPotionItemQuantity(itemId);
  if (updatedQuantity === 0) {
    user.deletePotionItem(itemId);
  }

  // 인벤토리 업데이트
  const invenItem = user.findItemByInven(itemId);
  if (invenItem) {
    if (invenItem.quantity <= 1) {
      user.removeItemFromInven(itemId);
    } else {
      invenItem.quantity -= 1;
    }
  }

  // S_UseItem 패킷 전송
  const useItemResponse = createResponse('response', 'S_UseItem', {
    item: {
      itemId: itemId,
      quantity: updatedQuantity,
    },
  });
  user.socket.write(useItemResponse);

  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] ${itemName}을(를) 사용했습니다. HP: ${newHp}, MP: ${newMp}`,
  });
  user.socket.write(response);
  console.log(`아이템 사용 완료: ${itemName}, 남은 수량: ${updatedQuantity}`);
};

export default useHandler;
