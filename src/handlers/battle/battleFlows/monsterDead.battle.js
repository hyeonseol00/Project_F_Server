import switchToMonsterAttackScene from './switchScene/monsterAttack.switch.js';

export default function monsterDeadScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    switchToMonsterAttackScene(dungeon, socket);
  }
}
