import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function playerAttackScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    const btns = [{ msg: '다음', enable: true }];
    const targetMonsterIdx = 0;

    const battleLog = {
      msg: `몬스터 ${dungeon.monsters[targetMonsterIdx].name}이(가) 플레이어를 공격합니다!`,
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
      actionMonsterIdx: targetMonsterIdx,
      actionSet,
    });
    socket.write(monsterAction);

    dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
  }
}
