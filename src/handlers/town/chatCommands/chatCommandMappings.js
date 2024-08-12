import { sendDirectMessage } from './general/sendDirectMessage.chat.js';
import { sendMessageToTeam } from './team/sendMessageToTeam.chat.js';
import { createTeam } from './team/createTeam.chat.js';
import { joinTeam } from './team/joinTeam.chat.js';
import { leaveTeam } from './team/leaveTeam.chat.js';
import { inviteToTeam } from './team/inviteToTeam.chat.js';
import { acceptTeam } from './team/acceptTeam.chat.js';
import { kickMember } from './team/kickMember.chat.js';
import { sendTeamList } from './team/sendTeamList.chat.js';
import { buyItem } from './item/buyItem.chat.js';
import { sellItem } from './item/sellItem.chat.js';
import { equipItem } from './item/equipItem.chat.js';
import { unequipItem } from './item/unequipItem.chat.js';
import { useItem } from './item/useItem.chat.js';
import questRewardHandler from '../questReward.handler.js';
import {
  acceptQuestHandler,
  getQuestsHandler,
  questProgressHandler,
  completeQuestHandler,
} from '../quest.handler.js'; // 퀘스트 관련 핸들러들
const chatCommandMappings = new Map([
  // -------general cmd begin--------
  ['/w', sendDirectMessage],
  // ---------team begin------------
  ['/t', sendMessageToTeam],
  ['/createTeam', createTeam],
  ['/joinTeam', joinTeam],
  ['/leaveTeam', leaveTeam],
  ['/inviteTeam', inviteToTeam],
  ['/acceptTeam', acceptTeam],
  ['/kickMember', kickMember],
  ['/memlist', sendTeamList],
  // ---------Item begin------------
  ['/buyItem', buyItem],
  ['/buy', buyItem],
  ['/sellItem', sellItem],
  ['/sell', sellItem],
  ['/equip', equipItem],
  ['/eq', equipItem],
  ['/unequip', unequipItem],
  ['/ueq', unequipItem],
  ['/useItem', useItem],
  ['/use', useItem],
  // ---------퀘스트------------
  ['/questList', getQuestsHandler], // 퀘스트 목록 조회
  ['/acceptQuest', acceptQuestHandler], // 퀘스트 수락
  ['/completeQuest', completeQuestHandler], // 퀘스트 완료
  ['/questReward', questRewardHandler], // 퀘스트 보상 수령
  ['/questProgress', questProgressHandler], // 퀘스트 진행 상황
  // ---------퀘스트 끝-----------
  //['upAbility', skillPointHandler],
]);

export default chatCommandMappings;
