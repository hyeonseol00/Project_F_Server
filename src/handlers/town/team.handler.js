import { createResponse } from '../../utils/response/createResponse.js';
import { getAllUsersInTeam, getUserByNickname } from '../../session/user.session.js';

const notFoundTeam = (sender) => {
  // 해당 유저가 팀이 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!sender.teamId) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] You don't have team...`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

const notFoundUser = (sender, targetUser) => {
  // 해당 유저가 없다면, 해당 사실을 해당 유저에게 전송합니다.
  if (!targetUser) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] This user is not exist...`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

const existTeam = (sender) => {
  // 해당 유저가 팀이 있으면, 해당 사실을 해당 유저에게 전송합니다.
  if (sender.teamId) {
    const rejectResponse = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] You have already team...`,
    });
    sender.socket.write(rejectResponse);

    return true;
  }

  return false;
};

export const sendMessageToTeam = (sender, message) => {
  // 팀 멤버들을 불러옵니다.
  const teamMembers = getAllUsersInTeam(sender.teamId);

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

  if (existTeam(sender)) {
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
  const user = getUserByNickname(nickname);

  // 예외처리: 1. 팀에 이미 들어간 경우, 2. 해당 유저가 없거나 팀이 없는 경우
  if (existTeam(sender) || !notFoundTeam(sender) || notFoundUser(sender, user)) {
    return;
  }

  const teamMembers = getAllUsersInTeam(user.teamId); // 팀 멤버들을 불러옵니다.

  // 본인을 팀에 넣습니다.
  sender.teamId = user.teamId;
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
  if (!existTeam(sender)) {
    return;
  }
  // ------------------------

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
  

  console.log(`targetUser: ${targetUser.nickname}`);

  // 예외처리: 찾는 유저가 없는 경우, 유저가 이미 초대를 받은 경우
  if (notFoundUser(sender, targetUser) || targetUser.invitedTeams?.includes(sender.teamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: `[System] This user has already been invited or doesn't exist.`,
    });
    sender.socket.write(response);
    return;
  }

  // 초대 목록이 없는 경우 초기화합니다.
  if (!targetUser.invitedTeams) {
    targetUser.invitedTeams = [];
  }
  targetUser.invitedTeams.push(sender.teamId);
  
  console.log(`invitedTeams: ${targetUser.invitedTeams}`);

  
  const response = createResponse('response', 'S_Chat', {
    playerId: targetUser.playerId,
    chatMsg: `${sender.nickname} invite you to team.`,
  });
  targetUser.socket.write(response);
}

export const acceptTeamHandler = (sender, message) => {
  const teamId = message;

  // 예외처리: 이미 팀에 속해 있는 경우, 초대받지 않은 경우
  if (sender.teamId || !sender.invitedTeams?.includes(teamId)) {
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      chatMsg: '[System] You either already have a team or were not invited to this team.',
    });
    sender.socket.write(response);
    return;
  }

  // 팀에 합류
  sender.teamId = teamId;
  sender.isOwner = false;
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: '[System] Team join successfully!',
  });
  sender.socket.write(response);

  // 초대 목록에서 제거합니다.
  sender.invitedTeams = sender.invitedTeams.filter(id => id !== teamId);

  // 팀 멤버들에게 본인이 들어왔다는 메시지를 전송합니다.
  const teamMembers = getAllUsersInTeam(teamId);
  for (const member of teamMembers) {
    const joinResponse = createResponse('response', 'S_Chat', {
      playerId: member.playerId,
      chatMsg: `[System] ${sender.nickname} joined your team!`,
    });
    member.socket.write(joinResponse);
  }
}
  //   const acceptTeamMessage = `Accept team: ${teamId}`;
//   sender.isOwner = false;
//   const response = createResponse('response', 'S_Chat', {
//     playerId: sender.playerId,
//     chatMsg: acceptTeamMessage,
//   }); 
//   sender.socket.write(response);
// }

export const kickMemberHandler = (sender, message) => {
  const nickname = message;
  const targetUser = getUserByNickname(nickname);

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
}
