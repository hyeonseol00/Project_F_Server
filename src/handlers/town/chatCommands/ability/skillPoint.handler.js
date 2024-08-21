import { createResponse } from '../../../../utils/response/createResponse.js';
import isInteger from '../../../../utils/isInteger.js';
import { getPlayerInfo } from '../../../../classes/DBgateway/playerinfo.gateway.js';
import { updateAbility } from './upAbility.js';
import { getGameSession } from '../../../../session/game.session.js';
import { config } from '../../../../config/config.js';

export const skillPointHandler = async (user, message) => {
  const gameSession = getGameSession(config.session.townId);
  const userInfo = await getPlayerInfo(user.socket);
  const [upAbility, quantity] = message.split(' ');
  const { skillPoint } = user;

  if (!isInteger(quantity)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 사용할 skillPoint 수량을 정확히 입력하세요.`,
    });
    user.socket.write(response);
    return;
  }

  if (Number(skillPoint) === 0) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: '[System] 스킬 포인트가 없습니다.',
    });
    user.socket.write(response);
    return;
  }

  //남은 스킬포인트보다 더 많은 quantity를 요청할 경우
  if (skillPoint < quantity) {
    const response = createResponse('response', 'S_Chat', {
      playerId: user.playerId,
      chatMsg: `[System] 스킬 포인트가 부족합니다. 남은 포인트 ${skillPoint}`,
    });
    user.socket.write(response);
    return;
  }

  //능력치 올리기
  const upAbilityValue = 5;
  switch (upAbility) {
    case 'hp':
      await updateAbility(user.socket, upAbility, userInfo.statInfo, Number(quantity), skillPoint);
      break;
    case 'mp':
      await updateAbility(user.socket, upAbility, userInfo.statInfo, Number(quantity), skillPoint);
      break;
    case 'atk':
      await updateAbility(user.socket, upAbility, userInfo.statInfo, Number(quantity), skillPoint);
      break;
    case 'def':
      await updateAbility(user.socket, upAbility, userInfo.statInfo, Number(quantity), skillPoint);
      break;
    case 'magic':
      await updateAbility(user.socket, upAbility, userInfo.statInfo, Number(quantity), skillPoint);
      break;
    case 'speed':
      await updateAbility(user.socket, upAbility, userInfo.statInfo, Number(quantity), skillPoint);
      break;
    default:
      const response = createResponse('response', 'S_Chat', {
        playerId: user.playerId,
        chatMsg: `[System] 올리고 싶은 능력치를 영어로 정확히 입력해주세요. (ex: hp, mp, atk, def, magic, speed)`,
      });
      user.socket.write(response);
      return;
  }

  const playerInfo = await getPlayerInfo(user.socket);
  playerInfo.transform = gameSession.transforms[user.nickname];
  const statUpdateResponse = createResponse('response', 'S_Enter', {
    player: playerInfo,
  });
  user.socket.write(statUpdateResponse);

  const response = createResponse('response', 'S_Chat', {
    playerId: user.playerId,
    chatMsg: `[System] 스킬포인트 ${quantity}를 소모하여 ${quantity * upAbilityValue} 능력치를 올렸습니다.`,
  });
  user.socket.write(response);
  return;
};
