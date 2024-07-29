import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function targetMonsterScene(responseCode, dungeon, socket) {
  const btns = [{ msg: '다음', enable: true }];

  const player = dungeon.player;
  const playerStatInfo = player.playerInfo.statInfo;
  const attackType = dungeon.currentAttackType;
  const targetMonsterIdx = [responseCode - 1, responseCode - 1, 1];
  const targetMonster = dungeon.monsters[targetMonsterIdx[attackType]];
  const msg = [
    `${targetMonster.name}을(를) 공격합니다!`,
    `단일 스킬로 ${targetMonster.name}을(를) 공격합니다!`,
    `광역 스킬로 몬스터들을 공격합니다!`,
  ];
  const effectCode = [player.effectCode.normal, player.effectCode.single, player.effectCode.wide];
  const decreaseHp = [playerStatInfo.atk, playerStatInfo.magic, playerStatInfo.magic];
  const decreaseMp = [0, 25, 50];

  // S_BattleLog 패킷
  const battleLog = {
    msg: msg[attackType],
    typingAnimation: true,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  // S_SetPlayerMp 패킷
  playerStatInfo.mp -= decreaseMp[attackType];
  const responseSetPlayerMp = createResponse('response', 'S_SetPlayerMp', {
    mp: playerStatInfo.mp,
  });
  socket.write(responseSetPlayerMp);

  // S_PlayerAction 패킷
  const actionSet = {
    animCode: 0,
    effectCode: effectCode[attackType],
  };
  const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
    targetMonsterIdx: targetMonsterIdx[attackType],
    actionSet,
  });
  socket.write(responsePlayerAction);

  // S_SetMonsterHp 패킷
  for (let monsterIdx in dungeon.monsters) {
    const monster = dungeon.monsters[monsterIdx];

    if (attackType === config.attackType.wide || monster === targetMonster) {
      monster.hp -= decreaseHp[attackType];

      const responseSetMonsterHp = createResponse('response', 'S_SetMonsterHp', {
        monsterIdx,
        hp: monster.hp,
      });

      socket.write(responseSetMonsterHp);
    }
  }

  if (dungeon.currentAttackType === config.attackType.wide) {
    dungeon.initTargetIdx();
  } else {
    dungeon.setTargetIdx(responseCode - 1);
  }
  dungeon.battleSceneStatus = config.sceneStatus.playerAtk;
  dungeon.currentAttackType = config.attackType.normal;
}
