import { config } from '../../../config/config.js';
import switchToGameOverWin from './switchScene/gameOverWin.switch.js';
import switchToMonsterAttackScene from './switchScene/monsterAttack.switch.js';
import switchToMonsterDeadScene from './switchScene/monsterDead.switch.js';

export default function monsterDeadScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    if (dungeon.isMonstersAllDead()) {
      switchToGameOverWin(dungeon, socket);
    } else {
      switch (dungeon.currentAttackType) {
        case config.attackType.normal:
        case config.attackType.single:
          switchToMonsterAttackScene(dungeon, socket);
          break;
        case config.attackType.wide:
          switchToMonsterDeadScene(dungeon, socket);
          break;
      }
    }
  }
}
