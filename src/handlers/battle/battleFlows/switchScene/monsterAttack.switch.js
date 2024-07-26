import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import switchToActionScene from './action.switch.js';

export default function switchToMonsterAttackScene(dungeon, socket) {
  const player = dungeon.player;
  const playerStatInfo = player.playerInfo.statInfo;

  let index = dungeon.targetMonsterIdx;
  let monster = dungeon.monsters[index];

  if (playerStatInfo.hp <= 0) {
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
    const btns = [{ msg: '다음', enable: true }];
    const battleLog = {
      msg: `몬스터 ${monster.name}이(가) 플레이어를 공격합니다!`,
      typingAnimation: false,
      btns,
    };
    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
    socket.write(responseBattleLog);

    const effectCode = monster.effectCode;
    const actionSet = {
      animCode: 0,
      effectCode,
    };
    const monsterAction = createResponse('response', 'S_MonsterAction', {
      actionMonsterIdx: index,
      actionSet,
    });
    socket.write(monsterAction);

    // ------------- 플레이어 피격 코드 -------------
    const finalDamage = monster.power / (1 + playerStatInfo.def * 0.01); // LOL 피해량 공식
    playerStatInfo.hp -= playerStatInfo.hp > finalDamage ? finalDamage : playerStatInfo.hp;

    const playerHp = createResponse('response', 'S_SetPlayerHp', {
      hp: playerStatInfo.hp,
    });
    socket.write(playerHp);

    // console.log('playerHp', player_statInfo.hp);

    dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
    dungeon.accTargetIdx();
  }
}
