import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByUsername } from '../../db/user/user.db.js';
import { getUserByNickname } from '../../session/user.session.js';
import { config } from '../../config/config.js';

const loginHandler = async ({ socket, payload }) => {
  try {
    const { nickname, password, clientVersion } = payload;
    let response;
    let flag = true;
    let message;

    if (clientVersion !== config.client.version) {
      response = createResponse('response', 'S_LogIn', {
        success: false,
        message: '클라이언트 버전이 일치하지 않습니다.',
      });

      socket.write(response);

      return;
    }

    if (
      nickname === null ||
      nickname.trim() === '' ||
      password === null ||
      password.trim() === ''
    ) {
      // DB에서 user, character 정보 가져오기
      flag = false;
      message = '아이디와 비밀번호를 모두 입력하세요.';
    } else {
      const userInDB = await findUserByUsername(nickname);
      if (!userInDB || userInDB.password !== password) {
        flag = false;
        message = '아이디 또는 비밀번호가 틀렸습니다.';
      } else if (await getUserByNickname(nickname)) {
        flag = false;
        message = '이미 접속 중인 유저입니다';
      } else {
        message = '로그인을 성공했습니다.';
      }
    }

    // 응답 생성
    response = createResponse('response', 'S_LogIn', {
      success: flag,
      message: message,
    });

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export default loginHandler;
