import { config } from '../../../config/config.js';
import {
  getCharacterBaseEffectCode,
  getCharacterSingleEffectCode,
  getCharacterWideEffectCode,
} from '../../../db/user/user.db.js';
import { createResponse, createResponseAsync } from '../../../utils/response/createResponse.js';

export default async function targetMonsterScene(
  responseCode,
  dungeon,
  socket,
  attackType = config.attackType.normal,
) {
  const btns = [{ msg: '다음', enable: true }];

  const player = dungeon.player;
  const targetMonsterIdx = [responseCode - 1, responseCode - 1, 1];
  const targetMonster = dungeon.monsters[targetMonsterIdx[attackType]];
  const msg = [
    `${targetMonster.name}을(를) 공격합니다!`,
    `단일 스킬로 ${targetMonster.name}을(를) 공격합니다!`,
    `광역 스킬로 몬스터들을 공격합니다!`,
  ];
  const effectCode = [
    await getCharacterBaseEffectCode(player.characterClass),
    await getCharacterSingleEffectCode(player.characterClass),
    await getCharacterWideEffectCode(player.characterClass),
  ];
  const decreaseHp = [player.attack, player.attack * 2, player.attack * 2];
  const decreaseMp = [0, 25, 50];

  const battleLog = {
    msg: msg[attackType],
    typingAnimation: true,
    btns,
  };
  const responseBattleLog = await createResponseAsync('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  player.mp -= decreaseMp[attackType];
  const responseSetPlayerMp = createResponse('response', 'S_SetPlayerMp', { mp: player.mp });
  socket.write(responseSetPlayerMp);

  const actionSet = {
    animCode: 0,
    effectCode: effectCode[attackType] + player.level - 1,
  };

  const responsePlayerAction = await createResponseAsync('response', 'S_PlayerAction', {
    targetMonsterIdx: targetMonsterIdx[attackType],
    actionSet,
  });
  socket.write(responsePlayerAction);

  for (let monsterIdx in dungeon.monsters) {
    const monster = dungeon.monsters[monsterIdx];
    if (attackType === config.attackType.wide || monster === targetMonster) {
      console.log(dungeon.monsters[monsterIdx], 'attack');
      monster.hp -= decreaseHp[attackType];
      const responseSetMonsterHp = await createResponseAsync('response', 'S_SetMonsterHp', {
        monsterIdx,
        hp: monster.hp,
      });
      socket.write(responseSetMonsterHp);
    }
  }

  dungeon.battleSceneStatus = config.sceneStatus.playerAtk;
}
