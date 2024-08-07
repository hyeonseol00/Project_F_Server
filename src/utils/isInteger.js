//입력이 정수인지 확인하는 함수
function isInteger(string) {
  string += ''; // 문자열로 변환
  string = string.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (string === '' || isNaN(string)) return false; // 빈 문자열이거나 숫자가 아닌 경우 false 반환

  const num = Number(string);
  return Number.isInteger(num); // 정수인지 확인
}

export default isInteger;
