import { getAllUsers } from '../../../session/user.session.js';

const userPoints = [];

export const chatEventHandler = (payload) => {
  const { endTime } = payload;
  const [hour, min] = endTime.split(':');
  const today = new Date();
  const curMin = today.getMinutes();
  const time = (Number(min) - curMin) * 60 * 1000;

  setTimeout(timeOver(), time);
};

// 유저의 채팅 횟수
export const countingUserChat = (user) => {
  if (!userPoints[user]) {
    userPoints[user] = 0;
  }
  userPoints[user]++;
};

export const timeOver = () => {
  const allUser = getAllUsers();

  let winUser,
    maxPoint = 0;
  for (const user in userPoints) {
    if (maxPoint < userPoints[user]) {
      winUser = user;
      maxPoint = userPoints[user];
    }
  }

  for (const user of allUser) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[Event]: 우승자 채팅 횟수: ${maxPoint}회`,
    });

    user.socket.write(response);
  }

  endEvent(winUser, 1);
};
