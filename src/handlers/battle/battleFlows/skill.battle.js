import { config } from '../../../config/config.js';
import chooseActionScene from './action.battle.js';
import switchToActionScene from './switchScene/action.switch.js';
import targetMonsterScene from './target.battle.js';

export default async function chooseSkillType(responseCode, dungeon, socket) {
  switch (responseCode) {
    case config.skillButton.single:
      await chooseActionScene(responseCode, dungeon, socket, config.attackType.single);
      break;
    case config.skillButton.wide:
      await targetMonsterScene(responseCode, dungeon, socket, config.attackType.wide);
      break;
    case config.skillButton.cancel:
      await switchToActionScene(dungeon, socket);
      break;
  }
}
