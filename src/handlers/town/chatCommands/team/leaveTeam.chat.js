import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam } from '../../../../session/user.session.js';
import { notFoundTeam } from '../exceptions.js';

export const leaveTeam = (sender) => {
  const teamId = sender.teamId;

  // 예외처리: 1.떠날 팀이 없는 경우
  if (notFoundTeam(sender)) {
    return;
  }

  // 본인을 팀에서 제외하고, 메세지 전송
  sender.setTeam(null);
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] 팀을 탈퇴했습니다!',
  });
  sender.socket.write(response);

  // 팀 전체에게 메세지 전송(현재 본인은 나간 상태)
  const teamMembers = getAllMembersInTeam(teamId);
  for (const member of teamMembers) {
    let joinResponse = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${sender.nickname} 이(가) 팀을 탈퇴했습니다.`,
    });
    member.socket.write(joinResponse);
  }
};
