import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';
import switchToActionScene from './action.switch.js';

export default function switchToMonsterAttackScene(dungeon, socket) {
  let index = dungeon.targetMonsterIdx;
  let monster = dungeon.monsters[index];

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
    const player = dungeon.player;
    const player_statInfo = player.playerInfo.statInfo;
    player_statInfo.hp -= player_statInfo.hp > monster.power ? monster.power : player_statInfo.hp;

    const playerHp = createResponse('response', 'S_SetPlayerHp', {
      hp: player_statInfo.hp,
    });
    socket.write(playerHp);

    // console.log('playerHp', player_statInfo.hp);

    if (player_statInfo.hp > 0) {
      dungeon.battleSceneStatus = config.sceneStatus.enemyAtk;
      dungeon.accTargetIdx();
    } else {
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
    }
  }
}
