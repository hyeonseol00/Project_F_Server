import { getItemById } from '../../session/item.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const sellItemHandler = async (user, message) => {
  const [id, quantity] = message.split(' ');
  const sellItem = getItemById(Number(id));
  const itemCost = sellItem.itemCost;
  if (!sellItem) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: ` 존재하는 아이템이 아닙니다. `,
    });
    user.socket.write(response);
    return;
  }
  // console.log(Number(user.gold));
  //아이템 테이블과 팔고싶은 아이템 ID가 같을 경우
  if (Number(id) === sellItem.itemId) {
    const findItem = user.findItemByInven(Number(id));
    // 아이템이 인벤토리 없을 때, 인벤토리보다 더 많이 파려고 할 때, 정상적일 떄
    if (!findItem) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: ` 인벤토리에 아이템이 존재하지 않습니다. `,
      });
      user.socket.write(response);
      return;
    } else {
      if (findItem.itemType === 'potion') {
        if (findItem.quantity < Number(quantity)) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: ` 포션을 ${findItem.quantity}개 이상 판매할 수 없습니다. `,
          });
          user.socket.write(response);
          return;
        } else {
          const addGold = itemCost * Number(quantity) * 0.7;
          user.plusGold(addGold);
          user.decPotion(sellItem.itemId, Number(quantity));

          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: ` ${sellItem.itemName} 포션이 ${quantity}개 판매가 완료되었습니다. 골드가 ${user.gold} 있습니다.`,
          });
          user.socket.write(response);
          return;
        }
      } else {
        if (findItem.quantity < Number(quantity)) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: ` ${findItem.quantity}개 이상 판매할 수 없습니다. `,
          });
          user.socket.write(response);
          return;
        } else {
          const addGold = itemCost * Number(quantity) * 0.7;
          user.plusGold(Math.floor(addGold));

          user.decMountingItem(sellItem.itemId, Number(quantity));

          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: ` ${sellItem.itemName} 아이템이 ${quantity}개 판매가 완료되었습니다. 골드가 ${user.gold} 있습니다.`,
          });
          user.socket.write(response);
          return;
        }
      }
    }
  }
};

export default sellItemHandler;
