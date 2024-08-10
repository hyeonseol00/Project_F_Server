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

export const sendTeamList = (sender) => {
    if (notFoundTeam(sender)) {
      return;
    }
  
    const teamMembers = getAllUsersInTeam(sender.teamId);
    const memberList = teamMembers.map((member) => member.nickname).join(', ');
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] 팀 멤버: ${memberList}`,
    });
    sender.socket.write(response);
  };