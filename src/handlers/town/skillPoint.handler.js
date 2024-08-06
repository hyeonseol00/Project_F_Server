import { createResponse } from '../../utils/response/createResponse.js';

//입력이 정수인지 확인하는 함수
function isInteger(s) {
  s += ''; // 문자열로 변환
  s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
  if (s === '' || isNaN(s)) return false; // 빈 문자열이거나 숫자가 아닌 경우 false 반환

  const num = Number(s);
  return Number.isInteger(num); // 정수인지 확인
}

export const skillPointHandler = async (user, message) => {
  let { hp, maxHp, mp, maxMp, atk, def, magic, speed, skillPoint } = user.playerInfo.statInfo;
  const [upAbility, quantity] = message.split(' ');
  const validAbilities = ['hp', 'mp', 'atk', 'def', 'magic', 'speed'];
  if (!validAbilities.includes(upAbility)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 올리고 싶은 능력치를 영어로 정확히 입력해주세요. (ex: hp, mp, atk, def, magic, speed)`,
    });
    user.socket.write(response);
    return;
  }

  if (!isInteger(quantity)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 사용할 skillPoint 수량을 정확히 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  if (Number(skillPoint) === 0) {
    const response = createResponse('response', 'S_CHAT', {
      playerId: user.playerId,
      chatMsg: '[System] 스킬 포인트가 없습니다.',
    });
    user.socket.write(response);
    return;
  }

  //남은 스킬포인트보다 더 많은 quantity를 요청할 경우
  if (skillPoint < quantity) {
    const response = createResponse('response', 'S_CHAT', {
      playerId: user.playerId,
      chatMsg: '[System] 스킬 포인트가 부족합니다.',
    });
    user.socket.write(response);
    return;
  }

  //능력치 올리기
  const upAbilityValue = +5;
  let statInfo;
  switch (upAbility) {
    case 'hp':
      statInfo = {
        hp: hp + upAbilityValue * Number(quantity),
        maxHp: maxHp + upAbilityValue * Number(quantity),
        mp: mp,
        maxMp: maxMp,
        atk: atk,
        def: def,
        magic: magic,
        speed: speed,
        skillPoint: skillPoint - Number(quantity),
      };
      break;
    case 'mp':
      statInfo = {
        hp: hp,
        maxHp: maxHp,
        mp: mp + upAbilityValue * Number(quantity),
        maxMp: maxMp + upAbilityValue * Number(quantity),
        atk: atk,
        def: def,
        magic: magic,
        speed: speed,
        skillPoint: skillPoint - Number(quantity),
      };
      break;
    case 'atk':
      statInfo = {
        hp: hp,
        maxHp: maxHp,
        mp: mp,
        maxMp: maxMp,
        atk: atk + upAbilityValue * Number(quantity),
        def: def,
        magic: magic,
        speed: speed,
        skillPoint: skillPoint - Number(quantity),
      };
      break;
    case 'def':
      statInfo = {
        hp: hp,
        maxHp: maxHp,
        mp: mp,
        maxMp: maxMp,
        atk: atk,
        def: def + upAbilityValue * Number(quantity),
        magic: magic,
        speed: speed,
        skillPoint: skillPoint - Number(quantity),
      };
      break;
    case 'magic':
      statInfo = {
        hp: hp,
        maxHp: maxHp,
        mp: mp,
        maxMp: maxMp,
        atk: atk,
        def: def,
        magic: magic + upAbilityValue * Number(quantity),
        speed: speed,
        skillPoint: skillPoint - Number(quantity),
      };
      break;
    case 'speed':
      statInfo = {
        hp: hp,
        maxHp: maxHp,
        mp: mp,
        maxMp: maxMp,
        atk: atk,
        def: def,
        magic: magic,
        speed: speed + upAbilityValue * Number(quantity),
        skillPoint: skillPoint - Number(quantity),
      };
      break;
  }
  await user.updateStatInfo(statInfo);
  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] 스킬포인트 ${quantity}를 소모하여 ${quantity * upAbilityValue} 능력치를 올렸습니다.`,
  });
  user.socket.write(response);
  return;
};
