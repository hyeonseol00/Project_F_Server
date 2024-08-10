import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam } from '../../../../session/user.session.js';
import { notFoundTeam } from '../exceptions.js';

export const sendTeamList = (sender) => {
  // 예외처리: 1.떠날 팀이 없는 경우
  if (notFoundTeam(sender)) {
    return;
  }
  const teamMembers = getAllMembersInTeam(sender.teamId);
  const memberList = teamMembers.map((member) => member.nickname).join(', ');

  // 본인에게 메세지 전송
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[System] 팀 멤버: ${memberList}`,
  });
  sender.socket.write(response);
};
