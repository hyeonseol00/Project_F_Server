
import { createResponse } from '../../utils/response/createResponse.js';
import { getAllUsersInTeam, getUserByNickname } from '../../session/user.session.js';
import { findUserByUsername, findCharacterByUserIdAndClass } from '../../db/user/user.db.js';

const notFoundTeam = (sender, targetUser = undefined) => {
  let chatMsg = targetUser
    ? `[System] ${targetUser.nickname} don't have team...`
    : `[System] You don't have team...`;
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

const alreadyHaveTeam = (sender, targetUser = undefined) => {
  let chatMsg = targetUser
    ? `[System] ${targetUser.nickname} have already team...`
    : `[System] You have already team...`;
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

const notFoundUser = (sender, targetUser = undefined) => {
  // 해당 유저를 찾을 수 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!targetUser) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] The user cannot be found`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

const notFoundUserInTeam = (sender, targetUser = undefined) => {
  const teamMembers = getAllUsersInTeam(sender.teamId); // 팀 멤버들을 불러옵니다.
  const foundTargetUser = teamMembers
    .map((member) => member.nickname)
    .includes(targetUser.nickname);

  // 해당 유저를 찾을 수 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!foundTargetUser) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] The user cannot be found in team`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

const alreadyInvited = (sender, targetUser = undefined) => {
  if (targetUser.invitedTeams?.includes(sender.teamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] This user has already been invited.`,
    });
    sender.socket.write(response);
    return true;
  }
  return false;
}

const notFoundInvitation = (sender, targetUser = undefined) => {
  if (!targetUser || !sender.invitedTeams.includes(targetUser.teamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] You were not invited to this team.',
    });
    sender.socket.write(response);
    return true;
  }

  return false;
}

export const sendDirectMessage = (sender, message) => {

  const firstSpaceIdx = message.indexOf(' ');
  const recipientNickname = message.substring(0, firstSpaceIdx); // /w, /team 같은 명령어 파싱
  const msg = message.substring(firstSpaceIdx + 1);

  const recipient = getUserByNickname(recipientNickname);

  if (!recipient) {
    console.error(`Recipient not found: ${recipientNickname}`);
    return;
  }

  const senderChatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[DM] To_${recipient.nickname}: ${msg}`,
  });

  const recipientChatResponse = createResponse('response', 'S_Chat', {
    playerId: recipient.playerId,
    chatMsg: `[DM] ${sender.nickname}: ${msg}`,
  });

  try {
    sender.socket.write(senderChatResponse);       // 발신자에게 메시지 전송
    recipient.socket.write(recipientChatResponse); // 수신자에게 메시지 전송

  } catch (error) {
    console.error(`Failed to send message to recipient: ${error.msg}`);
  }
};

export const sendMyStat = async (sender, message) => {
  const userInDB = await findUserByUsername(sender.nickname);
  const character = await findCharacterByUserIdAndClass(userInDB.userId, sender.characterClass);
 
  const msg = `이름: ${character.characterName}
  레벨: ${character.characterLevel}
  경험치: ${character.characterLevel}
  직업: ${character.jobName}
  체력: ${character.curHp}/${character.maxHp}
  마나: ${character.curMp}/${character.maxMp}
  공격력: ${character.attack}
  주문력: ${character.magic}
  치명타 확률: ${character.critical}%
  치명타 피해: +${character.criticalAttack}%
  소지금: ${character.gold}`;

  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[System]: ${msg}`,
  });
  sender.socket.write(response);

  console.log(character);
};

export const sendMessageToTeam = (sender, message) => {
  // 팀 멤버들을 불러옵니다.
  const teamMembers = getAllUsersInTeam(sender.teamId);

  // 예외처리: 1. 팀이 없는 경우
  if (notFoundTeam(sender)) {
    return;
  }

  // 모든 팀 유저에게 메세지를 전송합니다.
  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[Team] ${sender.nickname}: ${message}`,
  });
  teamMembers.forEach((member) => {
    member.socket.write(chatResponse);
  });
};

export const createTeamHandler = (sender, message) => {
  const teamId = `TeamName ${Date.now()}`;

  // 예외처리: 1. 팀에 이미 들어간 경우
  if (alreadyHaveTeam(sender)) {
    return;
  }

  sender.isOwner = true;
  sender.teamId = teamId;
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] Team create successfully!',
  });
  sender.socket.write(response);
};

export const joinTeamHandler = (sender, message) => {
  const nickname = message;
  const targetUser = getUserByNickname(nickname);

  // 예외처리: 1. 팀에 이미 들어간 경우, 2. 해당 유저가 없는경우, 3. 해당 유저가 팀이 없는 경우
  if (
    alreadyHaveTeam(sender) ||
    notFoundUser(sender, targetUser) ||
    notFoundTeam(sender, targetUser)
  ) {
    return;
  }

  const teamMembers = getAllUsersInTeam(targetUser.teamId); // 팀 멤버들을 불러옵니다.

  // 본인을 팀에 넣습니다.
  sender.teamId = targetUser.teamId;
  sender.isOwner = false;
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] Team join successfully!',
  });
  sender.socket.write(response);

  // 팀 멤버들에게 본인이 들어왔다는 메세지를 전송합니다.
  for (const member of teamMembers) {
    let joinResponse = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${sender.nickname} join your team!`,
    });
    member.socket.write(joinResponse);
  }
};

export const leaveTeamHandler = (sender, message) => {
  // 나갈 teamId를 미리 저장합니다.
  const teamId = sender.teamId;

  // 예외처리: 떠날 팀이 없는 경우
  if (notFoundTeam(sender)) {
    return;
  }

  // 본인을 팀에서 제외합니다.
  sender.teamId = undefined;
  sender.isOwner = undefined;
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] Team leave successfully!',
  });
  sender.socket.write(response);

  // 팀 멤버들을 불러옵니다.(현재 본인은 나간 상태)
  const teamMembers = getAllUsersInTeam(teamId);

  // 팀 멤버들에게 본인이 나갔다는 메세지를 전송합니다.
  for (const member of teamMembers) {
    let joinResponse = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${sender.nickname} left your team`,
    });
    member.socket.write(joinResponse);
  }
};

export const inviteTeamHandler = (sender, message) => {
  const invitedNickname = message;
  const targetUser = getUserByNickname(invitedNickname);

  // 예외처리: 1. 팀이 없는 경우 2.해당 유저가 없는 경우 3.해당 유저가 이미 팀이 있는 경우 4.유저가 이미 초대를 한 경우
  if (
    notFoundTeam(sender) ||
    notFoundUser(sender, targetUser) ||
    alreadyHaveTeam(sender, targetUser) ||
    alreadyInvited(sender, targetUser)
  ) {
    return;
  }

  // 초대 목록이 없는 경우 초기화합니다.
  if (!targetUser.invitedTeams) {
    targetUser.invitedTeams = [];
  }
  targetUser.invitedTeams.push(sender.teamId);

  const response = createResponse('response', 'S_Chat', {
    playerId: targetUser.playerId,
    chatMsg: `[System] ${sender.nickname} invited you to join their team.`,
  });
  targetUser.socket.write(response);
};

export const acceptTeamHandler = (sender, message) => {
  const nickname = message;
  const targetUser = getUserByNickname(nickname);

  // 예외처리: 1. 이미 팀에 속해 있는 경우, 2.초대받지 않은 경우
  if (alreadyHaveTeam(sender) || notFoundInvitation(sender, targetUser)) {
    return;
  }

  // 팀에 합류
  sender.teamId = targetUser.teamId;
  sender.isOwner = false;
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] Successfully joined the team!',
  });
  sender.socket.write(response);

  // 초대 목록에서 팀 ID 제거
  sender.invitedTeams = sender.invitedTeams.filter(id => id !== targetUser.teamId);

  // 팀 멤버들에게 본인이 들어왔다는 메시지를 전송합니다.
  const teamMembers = getAllUsersInTeam(targetUser.teamId);
  teamMembers.forEach(member => {
    const joinResponse = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${sender.nickname} joined your team!`,
    });
    member.socket.write(joinResponse);
  });
}

export const kickMemberHandler = (sender, message) => {
  const nickname = message;
  const targetUser = getUserByNickname(nickname);

  // 예외처리: 1. 팀이 없는 경우, 2. 해당 유저가 없는경우, 3. 해당 유저가 팀에 없는 경우
  if (
    notFoundTeam(sender) ||
    notFoundUser(sender, targetUser) ||
    notFoundUserInTeam(sender, targetUser)
  ) {
    return;
  }

  // 타켓 유저를 팀에서 강퇴합니다.
  targetUser.teamId = undefined;
  targetUser.isOwner = undefined;
  const kickResponse = createResponse('response', 'S_Chat', {
    playerId: targetUser.playerId,
    chatMsg: '[System] You are kicked at team',
  });
  targetUser.socket.write(kickResponse);

  // 팀 멤버들을 불러옵니다.(현재 해당 유저는 강퇴된 상태)
  const teamMembers = getAllUsersInTeam(sender.teamId);

  // 팀 멤버들에게 해당 유저가 강퇴되었다는 메세지를 전송합니다.
  for (const member of teamMembers) {
    let response = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${targetUser.nickname} are kicked at team`,
    });
    member.socket.write(response);
  }
};
// 팀원 리스트 불러오기
export const sendTeamList = (sender) => {
  if (!sender.teamId) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] You don't have a team...`,
    });
    sender.socket.write(response);
    return;
  }

  const teamMembers = getAllUsersInTeam(sender.teamId);
  const memberList = teamMembers.map(member => member.nickname).join(', ');
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[System] Team members: ${memberList}`,
  });
  sender.socket.write(response);
};



