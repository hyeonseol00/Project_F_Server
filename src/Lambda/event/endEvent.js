import { getPlayerInfo, setGold } from '../../classes/DBgateway/playerinfo.gateway.js';
import { getAllUsers } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { REWARD_LIST } from '../rewardMapping.js';

export const endEvent = async (winUser, eventId) => {
  const allUser = getAllUsers();

  for (const user of allUser) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[Event]: 우승자 ${winUser.nickname}!!\n[Event]: 우승자에게 ~~@@#$%$% 보상이 지급됩니다.`,
    });

    user.socket.write(response);
  }

  const winUserInfo = await getPlayerInfo(winUser.socket);

  // flags의 idx로 reward[flagIdx]로 rewardId 찾아서 REWARD_LIST에서 불러오기
  const index = FLAGS.indexOf(eventId);
  const rewardId = REWARDS[index];
  await setGold(winUser.socket, winUserInfo.gold + REWARD_LIST[rewardId].gold);

  const response = createResponse('response', 'S_Chat', {
    playerId: winUser.playerId,
    chatMsg: `[Event]: 보상이 지급되었습니다.`,
  });

  winUser.socket.write(response);

  // 패킷 만들기 귀찮아서 재사용
  //   const userRewardRespons = createResponse('response', 'S_SellItem', {
  //     item: {
  //       id: -1,
  //       quantity: -1,
  //     },
  //     gold: winUserInfo.gold + REWARD_LIST[rewardId],
  //   });
  //   winUser.socket.write(userRewardRespons);
};
