import { config } from '../../../config/config.js';
import { createResponse, createResponseAsync } from '../../../utils/response/createResponse.js';

export default async function targetMonsterScene(responseCode, dungeon, socket) {
  const btns = [{ msg: '다음', enable: true }];
  const targetMonsterIdx = responseCode - 1;
  const player = dungeon.player;
  const monster = dungeon.monsters[targetMonsterIdx];

  const battleLog = {
    msg: `몬스터 ${monster.name}을(를) 공격합니다!`,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = await createResponseAsync('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  const actionSet = {
    animCode: 0,
    effectCode: 3001,
  };
  const responsePlayerAction = await createResponseAsync('response', 'S_PlayerAction', {
    targetMonsterIdx,
    actionSet,
  });
  socket.write(responsePlayerAction);

  monster.hp -= player.attack;
  const responseSetMonsterHp = await createResponseAsync('response', 'S_SetMonsterHp', {
    monsterIdx: targetMonsterIdx,
    hp: monster.hp,
  });
  socket.write(responseSetMonsterHp);

  dungeon.battleSceneStatus = config.sceneStatus.playerAtk;
}
