import { config } from '../../../config/config.js';
import switchToMonsterDeadScene from './switchScene/monsterDead.switch.js';

export default async function playerAttackScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    let index = dungeon.targetMonsterIdx;
    let monster = dungeon.monsters[index];

    if (dungeon.currentAttackType == config.attackType.wide) {
      while (monster.isDead) {
        index = dungeon.accTargetIdx();
        monster = dungeon.monsters[index];
      }
    }

    switchToMonsterDeadScene(dungeon, socket);
  }
}
