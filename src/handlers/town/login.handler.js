import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByUsername } from '../../db/user/user.db.js';

const loginHandler = async ({ socket, payload }) => {
  try {
    const { nickname, password } = payload;
    let response;
    let flag = true;
    let message;

    // DB에서 user, character 정보 가져오기
    if (
      nickname === null ||
      nickname.trim() === '' ||
      password === null ||
      password.trim() === ''
    ) {
      flag = false;
      message = '아이디와 비밀번호를 모두 입력하세요.';
    } else {
      const userInDB = await findUserByUsername(nickname);
      if (!userInDB || userInDB.password !== password) {
        flag = false;
        message = '아이디 또는 비밀번호가 틀렸습니다.';
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
