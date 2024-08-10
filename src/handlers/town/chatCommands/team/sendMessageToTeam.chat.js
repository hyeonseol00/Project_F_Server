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

export const sendMessageToTeam = (sender, message) => {
    // 팀 멤버들을 불러옵니다.
    const teamMembers = getAllUsersInTeam(sender.teamId);
  
    // 예외처리: 1. 메세지가 없는 경우 2. 팀이 없는 경우
    if (checkParams(sender, [message]) || notFoundTeam(sender)) {
      return;
    }
  
    // 모든 팀 유저에게 메세지를 전송합니다.
    const chatResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[Team] ${sender.nickname}: ${message}`,
    });
    teamMembers.forEach((member) => {
      member.socket.write(chatResponse);
    });
  };