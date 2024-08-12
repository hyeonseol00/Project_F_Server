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
} from './town/chatCommands/chatCommand.handler.js';
import questRewardHandler from './town/questReward.handler.js';
import {
  acceptQuestHandler,
  getQuestsHandler,
  completeQuestHandler,
  questProgressHandler,
} from './town/quest.handler.js'; // 퀘스트 관련 핸들러들
import { equipHandler } from './town/equip.handler.js';
import buyItemHandler from './town/chatCommands/user.buyItem.js';
import sellItemHandler from './town/chatCommands/user.sellItem.js';
import { unequipHandler } from './town/unequip.handler.js';
import { skillPointHandler } from './town/skillPoint.handler.js';
import useHandler from './town/chatCommands/use.handler.js';

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
  ['buyItem', buyItemHandler],
  ['sellItem', sellItemHandler],
  ['equip', equipHandler],
  ['eq', equipHandler],
  ['unequip', unequipHandler],
  ['ueq', unequipHandler],
  ['upAbility', skillPointHandler],
  ['use', useHandler],
  // ---------퀘스트------------
  ['questList', getQuestsHandler], // 퀘스트 목록 조회
  ['acceptQuest', acceptQuestHandler], // 퀘스트 수락
  ['completeQuest', completeQuestHandler], // 퀘스트 완료
  ['questReward', questRewardHandler], // 퀘스트 보상 수령
  ['questProgress', questProgressHandler], // 퀘스트 진행 상황
  // ---------퀘스트 끝-----------
]);

export default chatCommands;
