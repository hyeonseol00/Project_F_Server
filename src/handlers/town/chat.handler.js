import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { getAllGameSessions } from '../../session/game.session.js';


const chatHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserBySocket(socket);
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    const session = getAllGameSessions (); 
    if (!session[0]) throw new Error('게임 세션을 찾을 수 없습니다.');

    
    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: payload.playerId,
      chatMsg: payload.chatMsg
    });

    socket.write(chatResponse);
  } catch (err) {
    console.error('채팅 전송 중 에러가 발생했습니다:', err.message); 
    handleError(socket, err.message, '채팅 전송 중 에러가 발생했습니다: ' + err.message);
  }
};

export default chatHandler;
