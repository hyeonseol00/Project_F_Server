import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function targetMonsterScene(responseCode, dungeon, socket, skill = false) {
  // 몬스터 공격 버튼 중 1택
  const btns = [];
  const targetMonsterIdx = skill === 'wide' ? 1 : responseCode - 1;

  console.log(
    `몬스터${targetMonsterIdx}${skill === 'wide' ? ' 광역 스킬 ' : skill ? ' 스킬 ' : ' '}공격!`,
  );

  const battleLog = {
    msg: `${dungeon.monsters[targetMonsterIdx]}${skill === 'wide' ? ' 광역 스킬 ' : skill ? ' 스킬 ' : ' '}공격!`,
    typingAnimation: true,
    btns,
  };

  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  const actionSet = {
    animCode: 1,
    effectCode: skill === 'wide' ? 3027 : skill ? 3017 : 3001,
  };

  const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
    targetMonsterIdx,
    actionSet,
  });
  socket.write(responsePlayerAction);

  dungeon.battleSceneStatus = config.sceneStatus.message;
}
