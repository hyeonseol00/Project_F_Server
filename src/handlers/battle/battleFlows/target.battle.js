import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function targetMonsterScene(responseCode, dungeon, socket) {
  // 몬스터 공격 버튼 중 1택
  const btns = [];
  const targetMonsterIdx = responseCode - 1;

  console.log(`몬스터${targetMonsterIdx} 공격!`);

  const battleLog = {
    msg: `몬스터 ${dungeon.monsters[targetMonsterIdx]} 공격!`,
    typingAnimation: true,
    btns,
  };

  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

  const actionSet = {
    animCode: 1,
    effectCode: 3017,
  };
  // 플레이어 공격 모션은 안 나옴..

  const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
    targetMonsterIdx,
    actionSet,
  });

  socket.write(responseBattleLog);
  socket.write(responsePlayerAction);

  dungeon.battleSceneStatus = config.sceneStatus.message;
}
