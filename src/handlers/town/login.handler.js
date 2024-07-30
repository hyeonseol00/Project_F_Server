import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { findUserByUsername } from '../../db/user/user.db.js';

const loginHandler = async ({ socket, payload }) => {
  try {
    const { nickname, password } = payload;
    let response;
    let flag = true;

    // DB에서 user, character 정보 가져오기
    const userInDB = await findUserByUsername(nickname);
    if (!userInDB || userInDB.password !== password) {
      flag = false;
    }

    // 성공시 response 전달
    if (flag) {
      response = createResponse('response', 'S_LogIn', {
        success: true,
        message: '로그인을 성공했습니다.',
      });
    } else {
      response = createResponse('response', 'S_LogIn', {
        success: false,
        message: '아이디 또는 비밀번호가 틀렸습니다.',
      });
    }

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export default loginHandler;
