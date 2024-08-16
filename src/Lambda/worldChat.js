import { sendMessageToAll } from '../handlers/town/chat.handler.js';
import { getAllUsers } from '../session/user.session.js';
import { createResponse } from '../utils/response/createResponse.js';
import { chatHandlerMappings } from './eventMapping.js';

export const PROCESSING_EVENTS = []; // 현재 진행 중인 이벤트 목록

// 이벤트 감지 시 유저들에게 이벤트 알림 전송.
export const eventNotificationHandler = async (data) => {
  const { message, eventId, rewardId, Items: payload } = data;

  const allUser = getAllUsers();

  PROCESSING_EVENTS.push({
    eventId,
    rewardId,
  });

  for (const user of allUser) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[Event]: ${message}`,
    });

    chatHandlerMappings[eventId]([...payload]);

    user.socket.write(response);
  }
};
