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
]);

export default chatCommandMappings;
