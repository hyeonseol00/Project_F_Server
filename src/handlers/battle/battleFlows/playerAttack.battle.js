import { config } from '../../../config/config.js';
import { getMonsterEffect } from '../../../db/game/game.db.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToActionScene from './switchScene/action.switch.js';

export default async function playerAttackScene(responseCode, dungeon, socket, index) {
  if (responseCode == 1) {
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

    if (index === 2) {
      dungeon.battleSceneStatus = switchToActionScene(dungeon, socket);
    } else {
      dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
    }
  }
}
