// Lodash 라이브러리를 가져옵니다.
import _ from 'lodash';

// 입력이 정수인지 확인하는 함수
function isInteger(string) {
  // 입력을 문자열로 변환하고 양쪽 공백을 제거합니다.
  const trimmedString = _.trim(string);

  // 문자열이 빈 문자열이거나 숫자가 아니면 false를 반환합니다.
  if (trimmedString === '' || _.isNaN(trimmedString)) return false;

  // 숫자로 변환 후 정수인지 확인합니다.
  const num = Number(trimmedString);
  return _.isInteger(num);
}

export default isInteger;
