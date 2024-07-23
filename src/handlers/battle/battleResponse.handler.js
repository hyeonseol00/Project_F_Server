import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const battleResponseHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);

  switch (payload.responseCode) {
    case 0:
      const btns = [];
      for (let i = 0; i < 3; i++) {
        btns.push({ msg: `${i}`, enable: true });
      }
      const battleLog = {
        msg: '공격할 몬스터를 선택하세요.',
        typingAnimation: true,
        btns,
      };
      const response = createResponse('battle', 'S_BattleLog', { battleLog });

      socket.emit(response);
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
  }
};

export default battleResponseHandler;
