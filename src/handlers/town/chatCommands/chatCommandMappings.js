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
import { equipItem } from './equip/equipItem.chat.js';
import { unequipItem } from './equip/unequipItem.chat.js';
import { useItem } from './item/useItem.chat.js';
import { skillPointHandler } from './ability/skillPoint.handler.js';
import getQuestsHandler from './quest/getQuest.chat.js';
import acceptQuestHandler from './quest/acceptQuest.chat.js';
import completeQuestHandler from './quest/completeQuest.chat.js';
import questRewardHandler from './quest/questReward.chat.js';
import questProgressHandler from './quest/questProgress.chat.js';

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
  ['/upAbility', skillPointHandler],
  ['/ua', skillPointHandler],
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
