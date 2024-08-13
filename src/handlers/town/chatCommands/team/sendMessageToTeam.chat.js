import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam } from '../../../../session/user.session.js';
import { notFoundTeam } from '../exceptions.js';
import { getPlayerInfo } from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const sendMessageToTeam = async (sender, message) => {
  const senderInfo = await getPlayerInfo(sender.socket);
  const { teamId: senderTeamId } = await getTeam(sender.socket);
  const teamMembers = await getAllMembersInTeam(senderTeamId);

  // 예외처리: 1.떠날 팀이 없는 경우
  if (await notFoundTeam(sender)) {
    return;
  }

  // 팀 전체에게 메세지 전송
  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[Team] ${senderInfo.nickname}: ${message}`,
  });
  teamMembers.forEach((member) => {
    member.socket.write(chatResponse);
  });
};
