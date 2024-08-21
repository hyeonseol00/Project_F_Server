import { getItemById } from '../../assets/item.assets.js';
import {
  decItem,
  deleteItem,
  getItem,
  getStatInfo,
  setStatInfo,
} from '../../classes/DBgateway/playerinfo.gateway.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const usePotionHandler = async ({ socket, payload }) => {
  try {
    const userStatInfo = await getStatInfo(socket);
    const { hp, maxHp, mp, maxMp, level } = userStatInfo;

    const { itemId: useItemId } = payload;
    const userItem = await getItem(socket, useItemId);

    const useItemInfo = await getItemById(useItemId);
    const { itemHp, itemMp, requireLevel } = useItemInfo;

    if (!userItem || userItem.quantity <= 0) {
      // 수량 부족 검증
      console.log(`${useItemInfo.itemName} 아이템이 없습니다.`);
      return;
    }

    if (level < requireLevel) {
      // 사용 요구 레벨 부족 검증
      return;
    }

    // HP와 MP를 증가시킴
    const newHp = Math.min(hp + itemHp, maxHp);
    const newMp = Math.min(mp + itemMp, maxMp);

    // 상태 업데이트
    userStatInfo.hp = newHp;
    userStatInfo.mp = newMp;
    await setStatInfo(socket, userStatInfo);

    // 인벤토리 업데이트
    if (userItem.quantity === 1) {
      await deleteItem(socket, useItemId);
    } else {
      await decItem(socket, useItemId, 1);
    }

    // S_TryUsePotion 패킷 전송
    const usePotionResponse = createResponse('response', 'S_TryUsePotion', {
      itemId: useItemId,
      quantity: userItem.quantity - 1,
    });
    socket.write(usePotionResponse);

    const user = await getUserBySocket(socket);
    const hatcherySession = getHatcherySession();
    // S_SetPlayerHpMpHatchery 패킷 전송
    const setPlayerStatResponse = createResponse('response', 'S_SetPlayerHpMpHatchery', {
      playerId: user.playerId,
      playerCurHp: userStatInfo.hp,
      playerCurMp: userStatInfo.mp,
    });
    hatcherySession.playerNicknames.forEach((nickname) => {
      const user = getUserByNickname(nickname);
      user.socket.write(setPlayerStatResponse);
    });
  } catch (err) {
    handleError(socket, err);
  }
};
