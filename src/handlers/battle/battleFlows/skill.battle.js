import { config } from '../../../config/config.js';
import chooseActionScene from './action.battle.js';
import switchToActionScene from './switchScene/action.switch.js';
import targetMonsterScene from './target.battle.js';

export default function chooseSkillType(responseCode, dungeon, socket) {
  switch (responseCode) {
    case config.skillButton.single:
      chooseActionScene(responseCode, dungeon, socket, true);
      break;
    case config.skillButton.wide:
      targetMonsterScene(responseCode, dungeon, socket, 'wide');
      break;
    case config.skillButton.cancel:
      switchToActionScene(dungeon, socket);
      break;
  }
}
