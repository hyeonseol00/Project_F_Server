import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToActionScene from './switchScene/action.switch.js';

export default function playerAttackScene(responseCode, dungeon, socket, index) {
  if (responseCode == 1) {
    const btns = [{ msg: '다음', enable: true }];

    const battleLog = {
      msg: `몬스터 ${dungeon.monsters[index].name}이(가) 플레이어를 공격합니다!`,
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

    if (index === 2) {
      dungeon.battleSceneStatus = switchToActionScene(dungeon, socket);
    } else {
      dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
    }
  }
}
