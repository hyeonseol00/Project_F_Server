import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam } from '../../../../session/user.session.js';
import { notFoundTeam } from '../exceptions.js';
import { getPlayerInfo, getTeam } from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const sendTeamList = async (sender) => {
  // 예외처리: 1.떠날 팀이 없는 경우
  if (await notFoundTeam(sender)) {
    return;
  }
  const { teamId: senderTeamId } = await getTeam(sender.socket);
  const teamMembers = await getAllMembersInTeam(senderTeamId);
  const memberList = await Promise.all(
    teamMembers.map(async (member) => {
      const memberInfo = await getPlayerInfo(member.socket);
      return memberInfo.nickname;
    }),
  ).then((nicknames) => nicknames.join(', '));

  // 본인에게 메세지 전송
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[System] 팀 멤버: ${memberList}`,
  });
  sender.socket.write(response);
};
