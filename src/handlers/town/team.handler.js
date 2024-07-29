import { createResponse } from '../../utils/response/createResponse.js';
import { getAllUsersInTeam } from '../../session/user.session.js';

export const sendMessageToTeam = (sender, message) => {
  const teamMembers = getAllUsersInTeam(sender.teamId);

  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: `[Team] ${sender.nickname}: ${message}`,
  });
  teamMembers.forEach(member => {
    member.socket.write(chatResponse);
  });
}

export const createTeamHandler = (sender, message) => {
 
  const teamId = 'TeamName ${Date.now()}';

  sender.isOwner = true;
  sender.teamId = teamId;


  const teamMsg = 'Team created: ${teamId}';

  const response = createResponse('response', 'S_Chat',{
    playerId: sender.playerId,
    message : teamMsg,
  });
  sender.socket.write(response);
}

export const joinTeamHandler = (sender, message) => {
    const nickname = message;

    const user = getUserByNickname(nickname);

    sender.teamId = user.teamId;
    message = `Joined team: ${teamId}`;
    sender.isOwner = false;
    
    const response = createResponse('response', 'S_Chat', {
      playerId: sender.playerId,
      message: message,
    });

    sender.socket.write(response);
}

export const leaveTeamHandler = (sender, message) => {
  message = `Leave team: ${sender.teamId}`;
  sender.teamId = undefined;
  sender.isOwner = undefined;
  
  const response = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    message: message,
  });

  sender.socket.write(response);
}
export const inviteTeamHandler = () => {
    
}

export const acceptTeamHandler = () => {
    
}

export const kickMemberHandler = () => {
    
}