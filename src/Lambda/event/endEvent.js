import { getPlayerInfo, setGold } from '../../classes/DBgateway/playerinfo.gateway.js';
import { getAllUsers } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { REWARD_LIST } from '../rewardMapping.js';
import { PROCESSING_EVENTS } from '../worldChat.js';

export const endEvent = async (winUser, eventId) => {
  try {
    const endedEventIdx = PROCESSING_EVENTS.findIndex((e) => e.eventId === eventId);
    const curEventRewardId = PROCESSING_EVENTS[endedEventIdx].rewardId;

    const allUser = getAllUsers();
    const chatMsg = winUser
      ? `[Event]: 우승자 ${winUser.nickname}!!\n[Event]: 우승자에게 ${REWARD_LIST[curEventRewardId].gold} 골드가 지급됩니다.`
      : '우승자 없음!';
    for (const user of allUser) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg,
      });

      user.socket.write(response);
    }

    // 보상 지급 및 종료된 이벤트 삭제
    if (winUser) {
      const winUserInfo = await getPlayerInfo(winUser.socket);
      await setGold(winUser.socket, winUserInfo.gold + REWARD_LIST[curEventRewardId].gold);

      const response = createResponse('response', 'S_Chat', {
        playerId: winUser.playerId,
        chatMsg: `[Event]: 보상이 지급되었습니다.`,
      });
      winUser.socket.write(response);
    }

    if (endedEventIdx !== -1) PROCESSING_EVENTS.splice(endedEventIdx, 1);

    // 패킷 만들기 귀찮아서 재사용
    //   const userRewardRespons = createResponse('response', 'S_SellItem', {
    //     item: {
    //       id: -1,
    //       quantity: -1,
    //     },
    //     gold: winUserInfo.gold + REWARD_LIST[rewardId],
    //   });
    //   winUser.socket.write(userRewardRespons);
  } catch (err) {
    console.error(err);
  }
};
