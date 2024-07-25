import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function targetMonsterScene(responseCode, dungeon, socket, skill = false) {
  const btns = [{ msg: '다음', enable: true }];
  const targetMonsterIdx = skill === 'wide' ? 1 : responseCode - 1;
  const player = dungeon.player;
  const monster = dungeon.monsters[targetMonsterIdx];

  console.log(
    `몬스터${targetMonsterIdx}${skill === 'wide' ? ' 광역 스킬 ' : skill ? ' 스킬 ' : ' '}공격!`,
  );

  const battleLog = {
    msg: `${skill === 'wide' ? '광역 스킬로' : skill ? '스킬로' : ''}몬스터 ${monster.name}을(를) 공격합니다!`,
    typingAnimation: true,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  player.mp -= skill === 'wide' ? 50 : skill ? 25 : 0;
  const responseSetPlayerMp = createResponse('response', 'S_SetPlayerMp', { mp: player.mp });
  socket.write(responseSetPlayerMp);

  const actionSet = {
    animCode: 0,
    effectCode: skill === 'wide' ? 3027 : skill ? 3017 : 3001,
  };

  const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
    targetMonsterIdx,
    actionSet,
  });
  socket.write(responsePlayerAction);

  monster.hp -= player.attack * skill ? 2 : 1;
  const responseSetMonsterHp = createResponse('response', 'S_SetMonsterHp', {
    monsterIdx: targetMonsterIdx,
    hp: monster.hp,
  });
  socket.write(responseSetMonsterHp);

  dungeon.battleSceneStatus = config.sceneStatus.playerAtk;
}
