import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import switchToActionScene from './action.switch.js';

export default function switchToMonsterAttackScene(dungeon, socket) {
  let index = dungeon.targetMonsterIdx;
  let monster = dungeon.monsters[index];

  if (monster) {
    while (monster.isDead) {
      index = dungeon.accTargetIdx();
      monster = dungeon.monsters[index];

      if (index > 2) {
        break;
      }
    }
  }

  if (index > 2) {
    switchToActionScene(dungeon, socket);
    dungeon.initTargetIdx();
  } else {
    const btns = [{ msg: '다음', enable: true }];
    const battleLog = {
      msg: `몬스터 ${monster.name}이(가) 플레이어를 공격합니다!`,
      typingAnimation: false,
      btns,
    };
    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
    socket.write(responseBattleLog);

    const actionSet = {
      animCode: 0,
      effectCode: 3002,
    };
    const monsterAction = createResponse('response', 'S_MonsterAction', {
      actionMonsterIdx: index,
      actionSet,
    });
    socket.write(monsterAction);

    dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
    dungeon.accTargetIdx();
  }
}
