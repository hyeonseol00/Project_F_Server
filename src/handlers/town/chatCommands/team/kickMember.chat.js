import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam, getUserByNickname } from '../../../../session/user.session.js';
import {
  notFoundTeam,
  notFoundUserInTeam,
  notHaveKickAuthority,
  targetToSelf,
} from '../exceptions.js';

export const kickMember = async (sender, message) => {
  const nickname = message;
  const targetUser = await getUserByNickname(nickname);

  // 예외처리: 1. 본인을 지정한 경우 2. 팀이 없는 경우, 3. 해당 유저가 팀에 없는 경우, 4. 추방 권한이 없는 경우
  if (
    targetToSelf(sender, targetUser) ||
    notFoundTeam(sender) ||
    notFoundUserInTeam(sender, targetUser) ||
    notHaveKickAuthority(sender)
  ) {
    return;
  }

  // 타겟 유저를 팀에서 제외하고, 메세지 전송
  targetUser.setTeam(null);
  const kickResponse = createResponse('response', 'S_Chat', {
    playerId: targetUser.playerId,
    chatMsg: '[System] 팀에서 추방되었습니다.',
  });
  targetUser.socket.write(kickResponse);

  // 팀 전체에게 메세지 전송(현재 타겟 유저는 강퇴된 상태)
  const teamMembers = await getAllMembersInTeam(sender.teamId);
  for (const member of teamMembers) {
    let response = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${targetUser.nickname} 이(가) 팀에서 추방되었습니다.`,
    });
    member.socket.write(response);
  }
};
