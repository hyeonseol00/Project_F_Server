import { handleError } from '../../utils/error/errorHandler.js';
import { findUserByUsername, insertUser } from '../../db/user/user.db.js';
import { createResponse } from '../../utils/response/createResponse.js';

const registerHandler = async ({ socket, payload }) => {
  try {
    const { nickname, password } = payload;
    let response;
    let message;
    let flag = true;

    // 특수문자 및 공백 정규 표현식
    const specialCharRegex = /[^a-zA-Z0-9가-힣]/; // 알파벳 대소문자 및 숫자만 허용 (특수문자는 금지)
    const whitespaceRegex = /\s/; // 공백 문자(띄어쓰기)를 찾는 정규 표현식

    if (
      nickname === null ||
      nickname.trim() === '' ||
      password === null ||
      password.trim() === ''
    ) {
      message = '아이디와 비밀번호를 모두 입력하세요.';
      flag = false;
    } else {
      const userInDB = await findUserByUsername(nickname);
      if (userInDB) {
        flag = false;
        message = '중복된 아이디입니다.';
      }

      if (nickname.trim().length === 0) {
        flag = false;
        message = '공백은 입력할 수 없습니다.';
      } else if (nickname.length < 2) {
        flag = false;
        message = '아이디는 2자 이상으로 입력하세요.';
      } else if (nickname.length > 10) {
        flag = false;
        message = '아이디는 10자 이하로 입력하세요.';
      } else if (whitespaceRegex.test(nickname)) {
        flag = false;
        message = '아이디에 공백을 사용할 수 없습니다.';
      } else if (specialCharRegex.test(nickname)) {
        flag = false;
        message = '아이디에 특수문자를 사용할 수 없습니다.';
      }

      if (password.trim().length === 0) {
        flag = false;
        message = '공백은 입력할 수 없습니다.';
      } else if (password.length < 6) {
        flag = false;
        message = '비밀번호는 6자 이상으로 입력하세요.';
      } else if (whitespaceRegex.test(password)) {
        flag = false;
        message = '비밀번호에 공백을 사용할 수 없습니다.';
      } else if (specialCharRegex.test(password)) {
        flag = false;
        message = '비밀번호에 특수문자를 사용할 수 없습니다.';
      }

      if (flag) {
        await insertUser(nickname, password);
        message = '회원가입을 성공했습니다.';
      }
    }

    // 성공시 response 전달
    response = createResponse('response', 'S_Register', {
      success: flag,
      message: message,
    });

    socket.write(response);
  } catch (err) {
    handleError(socket, err);
  }
};

export default registerHandler;
