import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import switchToMonsterAttackScene from './monsterAttack.switch.js';

export default function switchToMonsterDeadScene(dungeon, socket) {
  const index = dungeon.targetMonsterIdx;
  const monster = dungeon.monsters[index];

  if (monster.hp <= 0 && monster.isDead == false && index < 3) {
    const monster = dungeon.monsters[index];

    monster.isDead = true;

    const btns = [{ msg: '다음', enable: true }];
    const battleLog = {
      msg: `몬스터 ${monster.name}이(가) 사망했습니다!`,
      typingAnimation: false,
      btns,
    };
    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
    socket.write(responseBattleLog);

    if (dungeon.currentAttackType === config.attackType.wide) {
      dungeon.accTargetIdx();
    } else {
      dungeon.initTargetIdx();
    }
    dungeon.battleSceneStatus = config.sceneStatus.monsterDead;
  } else {
    dungeon.initTargetIdx();
    switchToMonsterAttackScene(dungeon, socket);
  }
}
