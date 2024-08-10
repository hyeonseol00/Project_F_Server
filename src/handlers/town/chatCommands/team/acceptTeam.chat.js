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

export const acceptTeam = (sender, message) => {
    const nickname = message;
    const targetUser = getUserByNickname(nickname);
  
    // 예외처리: 1. 이미 팀에 속해 있는 경우, 2.초대받지 않은 경우
    if (alreadyHaveTeam(sender) || notFoundInvitation(sender, targetUser)) {
      return;
    }
  
    // 팀에 합류
    sender.teamId = targetUser.teamId;
    sender.isOwner = false;
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 팀 가입에 성공적으로 완료했습니다!',
    });
    sender.socket.write(response);
  
    // 초대 목록에서 팀 ID 제거
    sender.invitedTeams = sender.invitedTeams.filter((id) => id !== targetUser.teamId);
  
    // 팀 멤버들에게 본인이 들어왔다는 메시지를 전송합니다.
    const teamMembers = getAllUsersInTeam(targetUser.teamId);
    teamMembers.forEach((member) => {
      const joinResponse = createResponse('response', 'S_Chat', {
        playerId: member.playerId,
        chatMsg: `[System] ${sender.nickname} 이(가) 팀에 가입했습니다!`,
      });
      member.socket.write(joinResponse);
    });
  };