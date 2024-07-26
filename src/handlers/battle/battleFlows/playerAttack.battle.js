import { config } from '../../../config/config.js';
import { getMonsterEffect } from '../../../db/game/game.db.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToMonsterAttackScene from './switchScene/monsterAttack.switch.js';

export default async function playerAttackScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    let index = dungeon.targetMonsterIdx;
    const monster = dungeon.monsters[index];
    const btns = [{ msg: '다음', enable: true }];

    const battleLog = {
      msg: `몬스터 ${monster.name}이(가) 플레이어를 공격합니다!`,
      typingAnimation: false,
      btns,
    };
    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
    socket.write(responseBattleLog);

    const effectCode = await getMonsterEffect(monster.id);
    const actionSet = {
      animCode: 0,
      effectCode,
    };
    const monsterAction = createResponse('response', 'S_MonsterAction', {
      actionMonsterIdx: index,
      actionSet,
    });
    socket.write(monsterAction);
    /* 광역 공격 시 검사
    while (monster.isDead) {
      index = dungeon.accTargetIdx();
      monster = dungeon.monsters[index];

      if (index > 2) {
        // 여기가 전부 죽어서 전투 끝나는 부분
        return;
      }
    }
 	*/

    if (monster.hp <= 0 && monster.isDead == false) {
      monster.isDead = true;

      const battleLog = {
        msg: `몬스터 ${monster.name}이(가) 사망했습니다!`,
        typingAnimation: false,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
      socket.write(responseBattleLog);

      dungeon.initTargetIdx();
      dungeon.battleSceneStatus = config.sceneStatus.monsterDead;
    } else {
      dungeon.initTargetIdx();
      switchToMonsterAttackScene(dungeon, socket);
    }
  }
}
