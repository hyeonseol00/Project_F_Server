import { createResponse } from '../../../../utils/response/createResponse.js';
import isInteger from '../../../../utils/isInteger.js';
import { getItemById } from '../../../../assets/item.assets.js';
import {
  decItem,
  deleteItem,
  getItem,
  getItemQuantity,
  getPlayerInfo,
  setStatInfo,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const useItem = async (user, message) => {
  const userInfo = await getPlayerInfo(user.socket);
  const { hp, maxHp, mp, maxMp, level } = userInfo.statInfo;

  if (!isInteger(message)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 아이템 ID(숫자)를(를) 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  const id = Number(message);
  const findItem = await getItem(user.socket, id);
  const findItemInfo = await getItemById(id);

  if (!findItem) {
    console.log(`아이템을 찾을 수 없습니다. id: ${id}`);
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 사용 가능한 아이템이 아닙니다.`,
    });
    user.socket.write(response);
    return;
  }

  if (findItemInfo.itemType !== 'potion') {
    console.log(`아이템 유형이 포션이 아닙니다. itemType: ${findItemInfo.itemType}`);
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 사용 가능한 아이템이 아닙니다.`,
    });
    user.socket.write(response);
    return;
  }

  const { itemHp, itemMp, requireLevel, itemName } = findItemInfo;
  const { quantity } = findItem;

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

  // 필요한 레벨을 확인
  if (level < requireLevel) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 이 아이템은 레벨 ${requireLevel} 이상만 사용할 수 있습니다.`,
    });
    user.socket.write(response);
    return;
  }

  // HP와 MP를 증가시킴
  const newHp = Math.min(hp + itemHp, maxHp);
  const newMp = Math.min(mp + itemMp, maxMp);

  // 상태 업데이트
  userInfo.statInfo.hp = newHp;
  userInfo.statInfo.mp = newMp;

  // 인벤토리 업데이트
  const invenItem = await getItem(user.socket, id);
  if (invenItem) {
    if (invenItem.quantity <= 1) {
      await deleteItem(user.socket, id);
    } else {
      await decItem(user.socket, id, 1);
    }
  }

  const updatedQuantity = await getItemQuantity(user.socket, id);
  if (updatedQuantity === 0) {
    await deleteItem(user.socket, id);
  }

  // S_UseItem 패킷 전송
  const useItemResponse = createResponse('response', 'S_UseItem', {
    item: {
      id,
      quantity: updatedQuantity,
    },
  });
  user.socket.write(useItemResponse);

  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] ${itemName}을(를) 사용했습니다. HP: ${newHp}, MP: ${newMp}`,
  });
  user.socket.write(response);
  await setStatInfo(user.socket, userInfo.statInfo);
  console.log(`아이템 사용 완료: ${itemName}, 남은 수량: ${updatedQuantity}`);
};
