import { createResponse } from '../../../../utils/response/createResponse.js';
import { getAllMembersInTeam, getUserByNickname } from '../../../../session/user.session.js';
import { alreadyHaveTeam, notFoundInvitation, notFoundTeam, notFoundUser } from '../exceptions.js';
import {
  getInvitedTeams,
  getPlayerInfo,
  getTeam,
  setInvitedTeams,
  setTeam,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const acceptTeam = async (sender, message) => {
  const nickname = message;
  const targetUser = await getUserByNickname(nickname);
  const targetUserInfo = await getPlayerInfo(targetUser ? targetUser.socket : null);

  // 예외처리: 1. 해당 유저가 없는 경우, 2. 이미 팀에 속해 있는 경우, 3. 초대받지 않은 경우 4. 팀을 찾지 못한 경우
  if (
    notFoundUser(sender, targetUser) ||
    (await alreadyHaveTeam(sender)) ||
    (await notFoundInvitation(sender, targetUser)) ||
    (await notFoundTeam(sender, targetUser))
  ) {
    return;
  }

  // 팀에 가입하고, 본인에게 메세지 전송
  const { teamId: targetUserTeamId } = await getTeam(targetUser.socket);
  await setTeam(sender.socket, targetUserTeamId, false);
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[System] ${targetUserInfo.nickname} 의 팀에 가입했습니다!`,
  });
  sender.socket.write(response);

  // 초대 목록에서 팀 ID 제거
  const senderInvitedTeams = await getInvitedTeams(sender.socket);
  const invitedTeams = senderInvitedTeams.filter((id) => id !== targetUserTeamId);
  await setInvitedTeams(sender.socket, invitedTeams);

  // 팀 멤버들에게 본인이 들어왔다는 메시지를 전송합니다.
  const teamMembers = await getAllMembersInTeam(targetUserTeamId);
  const senderInfo = await getPlayerInfo(sender.socket);
  for (const member of teamMembers) {
    if (member.playerId === sender.playerId) continue;
    const joinResponse = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${senderInfo.nickname} 이(가) 팀에 가입했습니다!`,
    });
    member.socket.write(joinResponse);
  }
};
