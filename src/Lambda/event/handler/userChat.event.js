import { getAllUsers, getUserByNickname } from '../../../session/user.session.js';
import { endEvent } from '../endEvent.js';
import { createResponse } from '../../../utils/response/createResponse.js';

let userPoints = [];

export const chatEventHandler = (payload) => {
  try {
    const { gameTime } = payload;

    userPoints = [];

    setTimeout(timeOver, gameTime);
  } catch (err) {
    console.log(err);
  }
};

// 유저의 채팅 횟수
export const countingUserChat = (payload) => {
  try {
    const { sender: user } = payload;
    if (!userPoints[user.nickname]) {
      userPoints[user.nickname] = 0;
    }
    userPoints[user.nickname]++;
  } catch (err) {
    console.log(err);
  }
};

export const timeOver = () => {
  try {
    const allUser = getAllUsers();

    let winUser,
      maxPoint = 0;
    for (const user in userPoints) {
      if (maxPoint < userPoints[user]) {
        winUser = getUserByNickname(user);
        maxPoint = userPoints[user];
      }
    }

    let response;
    for (const user of allUser) {
      if (maxPoint === 0) {
        response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[Event]: 우승자 없음!!`,
        });
        continue;
      }
      response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[Event]: 우승자 채팅 횟수: ${maxPoint}회`,
      });

      user.socket.write(response);
    }
    endEvent(winUser, 1);
  } catch (err) {
    console.log(err);
  }
};
