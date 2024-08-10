import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllUsersInTeam, getUserByNickname } from '../../../../session/user.session.js';
import {
  notFoundTeam,
  alreadyHaveTeam,
  notFoundUser,
  notFoundUserInTeam,
  alreadyInvited,
  notFoundInvitation,
  targetToSelf,
  checkParams,
} from '../exceptions.js';

export const createTeam = (sender) => {
    const teamId = `TeamName ${Date.now()}`;
  
    // 예외처리: 1. 팀에 이미 들어간 경우
    if (alreadyHaveTeam(sender)) {
      return;
    }
  
    sender.isOwner = true;
    sender.teamId = teamId;
  
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 팀이 생성되었습니다!',
    });
    sender.socket.write(response);
  };