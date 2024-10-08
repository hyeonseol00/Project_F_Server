import { getAllUsers } from '../session/user.session.js';
import { createResponse } from '../utils/response/createResponse.js';
import { chatHandlerMappings } from './eventMapping.js';

export const PROCESSING_EVENTS = []; // 현재 진행 중인 이벤트 목록
let lock = 0;
// 이벤트 감지 시 유저들에게 이벤트 알림 전송.
export const eventNotificationHandler = async (data) => {
  try {
    const { eventName, eventId, rewardId, startTime, endTime } = data;

    const allUser = getAllUsers();

    if (PROCESSING_EVENTS.find((e) => e.eventId === eventId)) {
      return;
    }

    PROCESSING_EVENTS.push({
      eventId,
      rewardId: rewardId ? rewardId : 1,
    });

    for (const user of allUser) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[Event]: ${eventName}`,
      });

      user.socket.write(response);
    }

    // 이벤트 내용 나온 뒤 이벤트 진행
    chatHandlerMappings[eventId](data);
  } catch (err) {
    console.error(err);
  }
};
