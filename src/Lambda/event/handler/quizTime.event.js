import { getAllUsers } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { endEvent } from '../endEvent.js';

let answer;

export const quizTimeHandler = (payload) => {
  const { problem, answer: ans } = payload;
  answer = ans;
  const allUser = getAllUsers();

  for (const user of allUser) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[Event]: 문제: '${problem}'`,
    });

    user.socket.write(response);
  }
};

export const getUserChat = (user, message) => {
  const allUser = getAllUsers();

  if (message === answer) {
    for (const user of allUser) {
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[Event]: 정답: '${answer}'`,
      });

      user.socket.write(response);
    }

    endEvent(user, 2);
  }
};
