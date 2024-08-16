import { sendMessageToAll } from '../handlers/town/chat.handler.js';
import { getAllUsers } from '../session/user.session.js';
import { createResponse } from '../utils/response/createResponse.js';
import { chatHandlerMappings } from './eventMapping.js';

export const FLAGS = [];
export const REWARDS = [];

// 이벤트 감지 시 유저들에게 이벤트 알림 전송.
export const eventNotificationHandler = async (data) => {
  const { message, eventId, rewardId, payload } = data;

  const allUser = getAllUsers();

  FLAGS.push(eventId);
  REWARDS.push(rewardId);

  for (const user of allUser) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[Event]: ${message}`,
    });

    chatHandlerMappings[eventId](payload);

    user.socket.write(response);
  }
};
