import {
  sendDirectMessage, 
  sendMyStat,
  sendMessageToTeam,
  createTeamHandler,
  joinTeamHandler,
  leaveTeamHandler,
  inviteTeamHandler,
  acceptTeamHandler,
  kickMemberHandler,
} from './town/chatCommand.handler.js';


const chatCommands = new Map([
  // ---------common cmd begin------------
  ['w', sendDirectMessage],
  ['myStat', sendMyStat],
  // ---------team begin------------
  ['t', sendMessageToTeam],
  ['createTeam', createTeamHandler],
  ['joinTeam', joinTeamHandler],
  ['leaveTeam', leaveTeamHandler],
  ['inviteTeam', inviteTeamHandler],
  ['acceptTeam', acceptTeamHandler],
  ['kickMember', kickMemberHandler],
  // ---------team end------------


]);

export default chatCommands;
