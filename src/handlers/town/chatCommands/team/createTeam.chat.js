import { createResponse } from '../../../../utils/response/createResponse.js';
import { alreadyHaveTeam } from '../exceptions.js';

export const createTeam = (sender) => {
  
  // 예외처리: 1. 팀에 이미 들어간 경우
  if (alreadyHaveTeam(sender)) {
    return;
  }

  // 팀을 생성하고, 본인에게 메세지 전송
  const teamId = `TeamName ${Date.now()}`;
  sender.setTeam(teamId, true);
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] 팀이 생성되었습니다!',
  });
  sender.socket.write(response);
};
