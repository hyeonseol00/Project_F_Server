import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import switchToActionScene from './action.switch.js';

export default function switchToMonsterAttackScene(dungeon, socket) {
  const player = dungeon.player;
  const playerStatInfo = player.playerInfo.statInfo;

  let index = dungeon.targetMonsterIdx;
  let monster = dungeon.monsters[index];

  if (playerStatInfo.hp <= 0) {
    const actionSet = {
      animCode: 3,
      effectCode: -1,
    };
    const monsterAction = createResponse('response', 'S_MonsterAction', {
      actionMonsterIdx: index - 1 < 0 ? 0 : index - 1,
      actionSet,
    });
    socket.write(monsterAction);

    const playerActionSet = {
      animCode: 1,
      effectCode: -1,
    };
    const playerAction = createResponse('response', 'S_PlayerAction', {
      targetMonsterIdx: -1,
      actionSet: playerActionSet,
    });
    socket.write(playerAction);

    const btns = [{ msg: '마을로 귀환', enable: true }];
    const deadBattleLog = {
      msg: `플레이어 ${player.nickname}이(가) 사망했습니다!`,
      typingAnimation: false,
      btns,
    };

    const responseDeadBattleLog = createResponse('response', 'S_BattleLog', {
      battleLog: deadBattleLog,
    });
    socket.write(responseDeadBattleLog);

    dungeon.battleSceneStatus = config.sceneStatus.gameOverLose;

    return;
  }

  if (monster) {
    while (monster.isDead) {
      index = dungeon.accTargetIdx();
      monster = dungeon.monsters[index];

      if (index > 2) {
        break;
      }
    }
  }

  if (index > 2) {
    switchToActionScene(dungeon, socket);
    dungeon.initTargetIdx();
  } else {
    // ------------- 플레이어 피격 코드 -------------
    const btns = [{ msg: '다음', enable: true }];

    let finalDamage = Math.floor(monster.power / (1 + playerStatInfo.def * 0.01)); // LOL 피해량 공식
    let message = `몬스터 ${monster.name}이(가) ${player.nickname}를 공격합니다!\n${player.nickname}은(는) ${finalDamage} 데미지를 입었습니다.`;
    let effectCode = monster.effectCode;

    const isCritical = Math.floor(Math.random() * 101);
    if (isCritical <= monster.critical) {
      finalDamage = finalDamage * (monster.criticalAttack / 100);
      message = `몬스터 ${monster.name}이(가) 강화된 공격으로 ${player.nickname}를 공격합니다!\n${player.nickname}은(는) ${finalDamage} 데미지를 입었습니다.`;
    }

    const isAvoid = Math.floor(Math.random() * 101);
    if (isAvoid <= playerStatInfo.avoidRate) {
      message = `몬스터 ${monster.name}이(가) ${player.nickname}를 공격합니다!\n${player.nickname}은(는) ${monster.name}의 공격을 회피했습니다!`;
      finalDamage = 0;
      effectCode = -1;
    }

    const battleLog = {
      msg: message,
      typingAnimation: false,
      btns,
    };
    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
    socket.write(responseBattleLog);

    const actionSet = {
      animCode: 0,
      effectCode,
    };
    const monsterAction = createResponse('response', 'S_MonsterAction', {
      actionMonsterIdx: index,
      actionSet,
    });
    socket.write(monsterAction);

    playerStatInfo.hp -= playerStatInfo.hp > finalDamage ? finalDamage : playerStatInfo.hp;

    const playerHp = createResponse('response', 'S_SetPlayerHp', {
      hp: playerStatInfo.hp,
    });
    socket.write(playerHp);

    dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
    dungeon.accTargetIdx();
  }
}
