import { handleError } from '../../utils/error/errorHandler.js';
import { findUserByUsername, insertUser } from '../../db/user/user.db.js';
import { createResponse } from '../../utils/response/createResponse.js';

const registerHandler = async ({ socket, payload }) => {
  try {
    const { nickname, password } = payload;
    let response;
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

    if (password.trim().length === 0) {
      flag = false;
    }

    // 성공시 response 전달
    if (flag) {
      response = createResponse('response', 'S_Register', {
        success: true,
      });
    } else {
      response = createResponse('response', 'S_Register', {
        success: false,
      });
    }

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export default registerHandler;
