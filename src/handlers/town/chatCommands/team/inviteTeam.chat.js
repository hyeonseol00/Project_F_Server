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

export const inviteTeam = (sender, message) => {
    const invitedNickname = message;
    const targetUser = getUserByNickname(invitedNickname);
  
    // 예외처리: 1. 팀이 없는 경우 2.해당 유저가 없는 경우 3.해당 유저가 이미 팀이 있는 경우 4.유저가 이미 초대를 한 경우
    if (
      checkParams(sender, [message]) ||
      notFoundTeam(sender) ||
      notFoundUser(sender, targetUser) ||
      alreadyHaveTeam(sender, targetUser) ||
      alreadyInvited(sender, targetUser)
    ) {
      return;
    }
  
    // 초대 목록이 없는 경우 초기화합니다.
    if (!targetUser.invitedTeams) {
      targetUser.invitedTeams = [];
    }
    targetUser.invitedTeams.push(sender.teamId);
  
    const response = createResponse('response', 'S_Chat', {
      playerId: targetUser.playerId,
      chatMsg: `[System] ${sender.nickname} 이(가) 팀 초대를 했습니다.`,
    });
    targetUser.socket.write(response);
  };