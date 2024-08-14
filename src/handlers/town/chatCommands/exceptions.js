import { createResponse } from '../../../utils/response/createResponse.js';
import { getAllMembersInTeam } from '../../../session/user.session.js';
import {
  getInvitedTeams,
  getPlayerInfo,
  getTeam,
} from '../../../classes/DBgateway/playerinfo.gateway.js';

export const notFoundTeam = async (sender, targetUser = undefined) => {
  let targetUserSocket = targetUser ? targetUser.socket : null;
  const targetUserInfo = await getPlayerInfo(targetUserSocket);
  let chatMsg = targetUser
    ? `[System] ${targetUserInfo.nickname} 은(는) 팀이 없습니다.`
    : `[System] 팀이 없습니다.`;
  targetUser = targetUser || sender;
  targetUserSocket = targetUser ? targetUser.socket : null;

  // 타켓 유저가 팀이 없다면, 해당 사실을 해당 유저에게 전송합니다.
  const { teamId: targetUserTeamId } = await getTeam(user.socket);
  if (!targetUserTeamId) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const alreadyHaveTeam = async (sender, targetUser = undefined) => {
  const targetUserSocket = targetUser ? targetUser.socket : null;
  const targetUserInfo = await getPlayerInfo(targetUserSocket);
  let chatMsg = targetUser
    ? `[System] ${targetUserInfo.nickname} 은(는) 이미 팀이 있습니다.`
    : `[System] 이미 팀이 있습니다.`;
  const user = targetUser || sender;

  // 타켓 유저가 팀이 없다면, 해당 사실을 해당 유저에게 전송합니다.
  const { teamId: targetUserTeamId } = await getTeam(user.socket);
  if (targetUserTeamId) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const notFoundUser = (sender, targetUser) => {
  // 해당 유저를 찾을 수 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!targetUser) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] 해당 유저를 찾을 수 없습니다.`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const notFoundUserInTeam = async (sender, targetUser = undefined) => {
  const targetUserNickname = targetUser ? targetUser.nickname : null;
  const teamMembers = await getAllMembersInTeam(sender.teamId); // 팀 멤버들을 불러옵니다.
  const foundTargetUser = teamMembers.map((member) => member.nickname).includes(targetUserNickname);

  // 해당 유저를 찾을 수 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!foundTargetUser) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] 팀에서 해당 유저를 찾을 수 없습니다.`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const alreadyInvited = async (sender, targetUser = undefined) => {
  const targetUserSocket = targetUser ? targetUser.socket : null;
  const { teamId: senderTeamId } = await getTeam(sender.socket);
  if ((await getInvitedTeams(targetUserSocket))?.includes(senderTeamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] 해당 유저는 이미 초대되었습니다.`,
    });
    sender.socket.write(response);
    return true;
  }
  return false;
};

export const notFoundInvitation = async (sender, targetUser = undefined) => {
  const targetUserSocket = targetUser ? targetUser.socket : null;
  const { teamId: targetUserTeamId } = await getTeam(targetUserSocket);
  if (!targetUser || !(await getInvitedTeams(sender.socket)).includes(targetUserTeamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 당신은 팀에 초대되지 않았습니다.',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
};

export const targetToSelf = async (sender, targetUserInfo = undefined) => {
  const targetUserNickname = targetUserInfo ? targetUserInfo.nickname : null;
  const senderInfo = await getPlayerInfo(sender.socket);
  if (senderInfo.nickname === targetUserNickname) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 본인이 대상이 될 수 없습니다.',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
};

export const includeInvalidParams = (sender, params) => {
  const expectedParamsN = params.length;
  const filterdParams = params.filter((param) => param !== ' ' && param !== '');

  if (filterdParams.length !== expectedParamsN) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 잘못된 명령어 사용법입니다. /help로 확인하세요.',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
};

export const notHaveKickAuthority = (sender) => {
  if (!sender.isOwner) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 해당 유저를 추방할 권한이 없습니다',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
};
