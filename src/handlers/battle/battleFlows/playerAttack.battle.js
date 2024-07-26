import { config } from '../../../config/config.js';
import switchToMonsterDeadScene from './switchScene/monsterDead.switch.js';

export default function playerAttackScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    let index = dungeon.targetMonsterIdx;
    let monster = dungeon.monsters[index];

    if (dungeon.currentAttackType == config.attackType.wide) {
      while (monster.hp > 0 || monster.isDead === true) {
        index = dungeon.accTargetIdx();
        monster = dungeon.monsters[index];

        if (index > 2) {
          dungeon.initTargetIdx();
          break;
        }
      }
    }

    switchToMonsterDeadScene(dungeon, socket);
  }
}
