import { config } from '../../../config/config.js';
import chooseActionScene from './action.battle.js';
import switchToActionScene from './switchScene/action.switch.js';
import targetMonsterScene from './target.battle.js';

export default function chooseSkillTypeScene(responseCode, dungeon, socket) {
  switch (responseCode) {
    case config.skillButton.single:
      dungeon.currentAttackType = config.attackType.single;
      chooseActionScene(responseCode, dungeon, socket);
      break;
    case config.skillButton.wide:
      dungeon.currentAttackType = config.attackType.wide;
      targetMonsterScene(responseCode, dungeon, socket);
      break;
    case config.skillButton.cancel:
      switchToActionScene(dungeon, socket);
      break;
  }
}
