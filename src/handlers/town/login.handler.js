import { handleError } from '../../utils/error/errorHandler.js';

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
      });
    } else {
      response = createResponse('response', 'S_LogIn', {
        success: false,
      });
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default loginHandler;
