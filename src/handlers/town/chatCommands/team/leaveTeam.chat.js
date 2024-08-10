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

export const leaveTeam = (sender) => {
    // 나갈 teamId를 미리 저장합니다.
    const teamId = sender.teamId;
  
    // 예외처리: 1.떠날 팀이 없는 경우
    if (notFoundTeam(sender)) {
      return;
    }
  
    // 본인을 팀에서 제외합니다.
    sender.teamId = undefined;
    sender.isOwner = undefined;
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 팀을 탈퇴했습니다!',
    });
    sender.socket.write(response);
  
    // 팀 멤버들을 불러옵니다.(현재 본인은 나간 상태)
    const teamMembers = getAllUsersInTeam(teamId);
  
    // 팀 멤버들에게 본인이 나갔다는 메세지를 전송합니다.
    for (const member of teamMembers) {
      let joinResponse = createResponse('response', 'S_Chat', {
        playerId: member.playerId,
        chatMsg: `[System] ${sender.nickname} 이(가) 팀을 탈퇴했습니다.`,
      });
      member.socket.write(joinResponse);
    }
  };