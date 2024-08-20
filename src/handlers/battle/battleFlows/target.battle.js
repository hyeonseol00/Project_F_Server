import { getStatInfo, setStatInfo } from '../../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../../config/config.js';
import { getUserBySocket } from '../../../session/user.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default async function targetMonsterScene(responseCode, dungeon, socket) {
  const btns = [{ msg: '다음', enable: true }];

  const user = getUserBySocket(socket);
  const playerEffectCode = user.effectCode;
  const playerStatInfo = await getStatInfo(socket);
  const attackType = dungeon.currentAttackType;
  const targetMonsterIdx = [responseCode - 1, responseCode - 1, 0];
  const targetMonster = dungeon.monsters[targetMonsterIdx[attackType]];
  let msg = [
    `${targetMonster.name}을(를) 공격합니다!`,
    `단일 스킬로 ${targetMonster.name}을(를) 공격합니다!`,
    `광역 스킬로 몬스터들을 공격합니다!`,
  ];
  const effectCode = [
    playerEffectCode.baseEffect,
    playerEffectCode.singleEffect,
    playerEffectCode.wideEffect,
  ];
  let decreaseHp = [playerStatInfo.atk, playerStatInfo.magic, playerStatInfo.magic];
  const decreaseMp = [0, 25, 50];

  const isCritical = Math.floor(Math.random() * 101);
  if (isCritical <= playerStatInfo.critRate) {
    const criticalRate = playerStatInfo.critDmg / 100;
    decreaseHp = [
      Math.floor(playerStatInfo.atk * criticalRate),
      Math.floor(playerStatInfo.magic * criticalRate),
      Math.floor(playerStatInfo.magic * criticalRate),
    ];
    msg = [
      `크리티컬으로 강화되어 ${targetMonster.name}을(를) 공격합니다!`,
      `단일 스킬이 크리티컬 공격으로 강화되어 ${targetMonster.name}을(를) 공격합니다!`,
      `광역 스킬이 크리티컬 공격으로 강화되어 몬스터들을 공격합니다!`,
    ];
  }

  // S_BattleLog 패킷
  const battleLog = {
    msg: msg[attackType],
    typingAnimation: false,
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

  let changeEffect = 0;
  if (attackType === 2) {
    if (playerStatInfo.level > config.levelThresholds.high) {
      changeEffect = 3;
    } else if (playerStatInfo.level > config.levelThresholds.medium) {
      changeEffect = 2;
    } else if (playerStatInfo.level > config.levelThresholds.low) {
      changeEffect = 1;
    } else {
      changeEffect = 0;
    }
  } else {
    if (playerStatInfo.level > config.levelThresholds.medium) {
      changeEffect = 1;
    } else {
      changeEffect = 0;
    }
  }
  // S_PlayerAction 패킷
  const actionSet = {
    animCode: 0,
    effectCode: effectCode[attackType] + changeEffect,
  };

  if (dungeon.currentAttackType === config.attackType.wide) {
    for (let idx = 0; idx < 3; idx++) {
      if (dungeon.monsters[idx].isDead === false) {
        const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
          targetMonsterIdx: idx,
          actionSet,
        });
        socket.write(responsePlayerAction);
      }
    }
  } else {
    const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
      targetMonsterIdx: targetMonsterIdx[attackType],
      actionSet,
    });
    socket.write(responsePlayerAction);
  }
  // S_SetMonsterHp 패킷
  for (let monsterIdx in dungeon.monsters) {
    const monster = dungeon.monsters[monsterIdx];

    if (attackType === config.attackType.wide || monster === targetMonster) {
      monster.hp =
        monster.hp - decreaseHp[attackType] < 0 ? 0 : monster.hp - decreaseHp[attackType];

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
    dungeon.currentAttackType = config.attackType.normal;
  }

  await setStatInfo(socket, playerStatInfo);
  dungeon.battleSceneStatus = config.sceneStatus.playerAtk;
}
