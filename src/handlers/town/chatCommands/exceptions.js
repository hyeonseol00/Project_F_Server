import { createResponse } from "../../../utils/response/createResponse.js";

export const notFoundTeam = (sender, targetUser = undefined) => {
  let chatMsg = targetUser
    ? `[System] ${targetUser.nickname} 은(는) 팀이 없습니다.`
    : `[System] 팀이 없습니다.`;
  targetUser = targetUser || sender;

  // 타켓 유저가 팀이 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!targetUser.teamId) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const alreadyHaveTeam = (sender, targetUser = undefined) => {
  let chatMsg = targetUser
    ? `[System] ${targetUser.nickname} 은(는) 이미 팀이 있습니다.`
    : `[System] 이미 팀이 있습니다.`;
  targetUser = targetUser || sender;

  // 해당 유저가 팀이 있으면, 해당 사실을 해당 유저에게 전송합니다.
  if (targetUser.teamId) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const notFoundUser = (sender, targetUser = undefined) => {
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

export const notFoundUserInTeam = (sender, targetUser = undefined) => {
  const teamMembers = getAllUsersInTeam(sender.teamId); // 팀 멤버들을 불러옵니다.
  const foundTargetUser = teamMembers
    .map((member) => member.nickname)
    .includes(targetUser.nickname);

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

export const alreadyInvited = (sender, targetUser = undefined) => {
  if (targetUser.invitedTeams?.includes(sender.teamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] 해당 유저는 이미 초대되었습니다.`,
    });
    sender.socket.write(response);
    return true;
  }
  return false;
};

export const notFoundInvitation = (sender, targetUser = undefined) => {
  if (!targetUser || !sender.invitedTeams.includes(targetUser.teamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 당신은 팀에 초대되지 않았습니다.',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
};

export const targetToSelf = (sender, targetUser = undefined) => {
  if (sender.nickname == targetUser.nickname) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] 본인이 대상이 될 수 없습니다.',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
};

export const checkParams = (sender, params, expectedParamsN = 1) => {
  console.log(params);
  const filterdParams = params.filter(param => (param !== " " && param !== ""));
  
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
