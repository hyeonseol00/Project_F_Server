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

export const joinTeam = (sender, message) => {
    const nickname = message;
    const targetUser = getUserByNickname(nickname);
  
    // 예외처리: 1. 매개변수 개수가 다름 2. 팀에 이미 들어간 경우, 3. 해당 유저가 없는경우, 4. 해당 유저가 팀이 없는 경우
    if (
      checkParams(sender, [message]) ||
      alreadyHaveTeam(sender) ||
      notFoundUser(sender, targetUser) ||
      notFoundTeam(sender, targetUser)
    ) {
      return;
    }
  
    const teamMembers = getAllUsersInTeam(targetUser.teamId); // 팀 멤버들을 불러옵니다.
  
    // 본인을 팀에 넣습니다.
    sender.teamId = targetUser.teamId;
    sender.isOwner = false;
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 팀에 가입했습니다!',
    });
    sender.socket.write(response);
  
    // 팀 멤버들에게 본인이 들어왔다는 메세지를 전송합니다.
    for (const member of teamMembers) {
      let joinResponse = createResponse('response', 'S_Chat', {
        playerId: member.playerId,
        chatMsg: `[System] ${sender.nickname} 이(가) 팀에 가입했습니다!`,
      });
      member.socket.write(joinResponse);
    }
  };