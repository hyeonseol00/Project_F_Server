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

export const kickMember = (sender, message) => {
    const nickname = message;
    const targetUser = getUserByNickname(nickname);
  
    // 예외처리: 1. 본인을 지정한 경우 2. 팀이 없는 경우, 3. 해당 유저가 없는경우, 4. 해당 유저가 팀에 없는 경우
    if (
      targetToSelf(sender, targetUser) ||
      notFoundTeam(sender) ||
      notFoundUser(sender, targetUser) ||
      notFoundUserInTeam(sender, targetUser)
    ) {
      return;
    }
  
    // 타켓 유저를 팀에서 강퇴합니다.
    targetUser.teamId = undefined;
    targetUser.isOwner = undefined;
    const kickResponse = createResponse('response', 'S_Chat', {
      playerId: targetUser.playerId,
      chatMsg: '[System] 팀에서 추방되었습니다.',
    });
    targetUser.socket.write(kickResponse);
  
    // 팀 멤버들을 불러옵니다.(현재 해당 유저는 강퇴된 상태)
    const teamMembers = getAllUsersInTeam(sender.teamId);
  
    // 팀 멤버들에게 해당 유저가 강퇴되었다는 메세지를 전송합니다.
    for (const member of teamMembers) {
      let response = createResponse('response', 'S_Chat', {
        playerId: member.playerId,
        chatMsg: `[System] ${targetUser.nickname} 이(가) 팀에서 추방되었습니다.`,
      });
      member.socket.write(response);
    }
  };