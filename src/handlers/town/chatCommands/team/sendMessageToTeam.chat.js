import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam } from '../../../../session/user.session.js';
import { notFoundTeam } from '../exceptions.js';

export const sendMessageToTeam = (sender, message) => {
  const teamMembers = getAllMembersInTeam(sender.teamId);

  // 예외처리: 1.떠날 팀이 없는 경우
  if (notFoundTeam(sender)) {
    return;
  }

  // 팀 전체에게 메세지 전송
  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[Team] ${sender.nickname}: ${message}`,
  });
  teamMembers.forEach((member) => {
    member.socket.write(chatResponse);
  });
};
