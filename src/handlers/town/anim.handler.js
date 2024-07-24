import { handleError } from '../../utils/error/errorHandler.js';

import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { findCharacterByUserIdAndClass, findUserByUsername } from '../../db/user/user.db.js';
import { getAllGameSessions } from '../../session/game.session.js';

const animHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const nickname = user.playerId;
    const characterClass = user.characterClass;
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    const session = getAllGameSessions (); 
    if (!session[0]) throw new Error('게임 세션을 찾을 수 없습니다.');

    let userInDB = await findUserByUsername(nickname);
    let character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
    
    if (!character) throw new Error('캐릭터를 찾을 수 없습니다.');

    const animationResponse = createResponse('response', 'S_Animation', {
      playerId: user.id,
      animCode: payload.animCode
    });

  socket.write(animationResponse);
  } catch (err) {
    console.error('애니메이션 처리 중 에러가 발생했습니다:', err.message); 
    handleError(socket, err.message, '애니메이션 처리 중 에러가 발생했습니다: ' + err.message);
  }
};

export default animHandler;
