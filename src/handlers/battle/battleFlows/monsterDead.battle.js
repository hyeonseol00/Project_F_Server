import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToMonsterAttackScene from './switchScene/monsterAttack.switch.js';
import switchToMonsterDeadScene from './switchScene/monsterDead.switch.js';

export default function monsterDeadScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    if (dungeon.isMonstersAllDead()) {
      const btns = [{ msg: '다음', enable: true }];
      const battleLog = {
        msg: `몬스터를 모두 처치했습니다. 전투에서 승리했습니다!`,
        typingAnimation: false,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

      socket.write(responseBattleLog);

      dungeon.battleSceneStatus = config.sceneStatus.getExp;
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
