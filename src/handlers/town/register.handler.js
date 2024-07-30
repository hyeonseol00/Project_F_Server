import { handleError } from '../../utils/error/errorHandler.js';
import { findUserByUsername, insertUser } from '../../db/user/user.db.js';
import { createResponse } from '../../utils/response/createResponse.js';

const registerHandler = async ({ socket, payload }) => {
  try {
    const { nickname, password } = payload;
    let response;
    let message;
    let flag = true;

    // DB에서 nickname 중복 체크
    const userInDB = await findUserByUsername(nickname);
    if (!userInDB) {
      await insertUser(nickname, password);
    }
    // DB 에 중복된 nickname 이 있다.
    else {
      flag = false;
    }

    if (nickname.trim().length === 0) {
      flag = false;
      message = '아이디를 입력하세요.';
    } else if (nickname.length < 2) {
      flag = false;
      message = '아이디는 2자 이상으로 입력하세요.';
    } else if (nickname.length > 10) {
      flag = false;
      message = '아이디는 10자 이하로 입력하세요.';
    }

    if (password.trim().length === 0) {
      flag = false;
      message = '비밀번호를 입력하세요.';
    } else if (password.length < 6) {
      flag = false;
      message = '비밀번호는 6자 이상으로 입력하세요.';
    }

    // 성공시 response 전달
    if (flag) {
      response = createResponse('response', 'S_Register', {
        success: true,
        message: '회원가입을 성공했습니다.',
      });
    } else {
      response = createResponse('response', 'S_Register', {
        success: false,
        message: message,
      });
    }

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export default registerHandler;
