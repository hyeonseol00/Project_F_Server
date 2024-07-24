import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function targetMonsterScene(responseCode, dungeon, socket) {
  const btns = [{ msg: '', enable: false }];
  const targetMonsterIdx = responseCode - 1;

  const battleLog = {
    msg: `몬스터 ${dungeon.monsters[targetMonsterIdx].name}을(를) 공격합니다!`,
    typingAnimation: false,
    btns,
  };

  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  const actionSet = {
    animCode: 0,
    effectCode: 3001,
  };
  // 플레이어 공격 모션은 안 나옴..

  const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
    targetMonsterIdx,
    actionSet,
  });
  socket.write(responsePlayerAction);

  dungeon.battleSceneStatus = config.sceneStatus.message;
}
