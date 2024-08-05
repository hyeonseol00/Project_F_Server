import {
  sendDirectMessage,
  sendMessageToTeam,
  createTeamHandler,
  joinTeamHandler,
  leaveTeamHandler,
  inviteTeamHandler,
  acceptTeamHandler,
  kickMemberHandler,
  sendTeamList,
  buyItemHandler,
  sellItemHandler
} from './town/chatCommand.handler.js';
import { equipHandler } from './town/equip.handler.js';
import buyItemHandler from './town/user.buyItem.js';
import sellItemHandler from './town/user.sellItem.js';
import { unquipHandler } from './town/unequip.handler.js';


const chatCommands = new Map([
  // ---------common cmd begin------------
  ['w', sendDirectMessage],
  // ---------team begin------------
  ['t', sendMessageToTeam],
  ['createTeam', createTeamHandler],
  ['joinTeam', joinTeamHandler],
  ['leaveTeam', leaveTeamHandler],
  ['inviteTeam', inviteTeamHandler],
  ['acceptTeam', acceptTeamHandler],
  ['kickMember', kickMemberHandler],
  ['memlist', sendTeamList],
  // ---------team end------------

  // ---------shop begin------------
  ['buyItem', buyItemHandler],
  ['sellItem', sellItemHandler],

  // ---------shop end------------
  ['equip', equipHandler],
  ['buyItem', buyItemHandler],
  ['sellItem', sellItemHandler],
  ['eq', equipHandler],
  ['unequip', unquipHandler],
  ['ueq', unquipHandler],
]);

export default chatCommands;
