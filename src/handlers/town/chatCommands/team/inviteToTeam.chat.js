import { createResponse } from '../../../../utils/response/createResponse.js';
import { getUserByNickname } from '../../../../session/user.session.js';
import { notFoundTeam, alreadyHaveTeam, notFoundUser, alreadyInvited } from '../exceptions.js';
import {
  getInvitedTeams,
  getPlayerInfo,
  getTeam,
  setInvitedTeams,
} from '../../../../classes/DBgateway/playerinfo.gateway.js';

export const inviteToTeam = async (sender, message) => {
  const senderInfo = await getPlayerInfo(sender.socket);
  const invitedNickname = message;
  const targetUser = await getUserByNickname(invitedNickname);

  // 예외처리: 1. 팀이 없는 경우 2. 해당 유저가 없는 경우 3. 해당 유저가 이미 팀이 있는 경우 4.유저가 이미 초대를 한 경우
  if (
    notFoundTeam(sender) ||
    notFoundUser(sender, targetUser) ||
    alreadyHaveTeam(sender, targetUser) ||
    alreadyInvited(sender, targetUser)
  ) {
    return;
  }

  // 초대 목록이 없는 경우 초기화합니다.
  if (!(await getInvitedTeams(targetUser.socket))) {
    await setInvitedTeams(targetUser.socket, []);
  }
  const invitedTeams = [];
  const { teamId: senderTeamId } = await getTeam(sender.socket);
  invitedTeams.push(senderTeamId);
  await setInvitedTeams(targetUser.socket, invitedTeams);

  const response = createResponse('response', 'S_Chat', {
    playerId: targetUser.playerId,
    chatMsg: `[System] ${senderInfo.nickname} 이(가) 당신을 팀에 초대하였습니다.`,
  });
  targetUser.socket.write(response);
};
