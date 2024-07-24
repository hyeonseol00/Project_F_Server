import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function targetMonsterScene(responseCode, dungeon, socket) {
  const btns = [{ msg: '다음', enable: true }];
  const targetMonsterIdx = responseCode - 1;
  const player = dungeon.player;
  const monster = dungeon.monsters[targetMonsterIdx];

  const battleLog = {
    msg: `몬스터 ${monster.name}을(를) 공격합니다!`,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  const actionSet = {
    animCode: 0,
    effectCode: 3001,
  };
  const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
    targetMonsterIdx,
    actionSet,
  });
  socket.write(responsePlayerAction);

  monster.hp -= player.attack;
  const responseSetMonsterHp = createResponse('response', 'S_SetMonsterHp', {
    monsterIdx: targetMonsterIdx,
    hp: monster.hp,
  });
  socket.write(responseSetMonsterHp);

  dungeon.battleSceneStatus = config.sceneStatus.playerAtk;
}
