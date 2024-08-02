import {
  sendDirectMessage,
  sendMessageToTeam,
  createTeamHandler,
  joinTeamHandler,
  leaveTeamHandler,
  inviteTeamHandler,
  acceptTeamHandler,
  kickMemberHandler,
} from './town/chatCommand.handler.js';
import { equipHandler } from './town/equip.handler.js';
import { unquipHandler } from './town/unequip.handler.js';

const chatCommands = new Map([
  ['w', sendDirectMessage],
  // ---------team begin------------
  ['t', sendMessageToTeam],
  ['createTeam', createTeamHandler],
  ['joinTeam', joinTeamHandler],
  ['leaveTeam', leaveTeamHandler],
  ['inviteTeam', inviteTeamHandler],
  ['acceptTeam', acceptTeamHandler],
  ['kickMember', kickMemberHandler],
  // ---------team end------------
  ['equip', equipHandler],
  ['eq', equipHandler],
  ['unequip', unquipHandler],
  ['ueq', unquipHandler],
]);

export default chatCommands;
