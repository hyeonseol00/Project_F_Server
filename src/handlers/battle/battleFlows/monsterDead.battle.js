import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToMonsterAttackScene from './switchScene/monsterAttack.switch.js';
import switchToMonsterDeadScene from './switchScene/monsterDead.switch.js';
import { questProgressHandler } from '../../town/quest.handler.js';

export default function monsterDeadScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    const monster = dungeon.monsters[dungeon.targetMonsterIdx]; // 현재 타겟 몬스터
    const user = dungeon.player; // 현재 플레이어

    if (!monster) {
      console.error('몬스터를 찾을 수 없습니다.');
      return;
    }

    const questId = user.currentQuestId;

    if (!questId) {
      console.error('유효한 퀘스트 ID가 없습니다.');
      return;
    }

    // 몬스터가 죽었을 때 퀘스트 진행 상황을 업데이트
    questProgressHandler({
      socket,
      payload: {
        questId: questId, // questId를 사용합니다.
        monsterId: monster.monsterId,
        progressIncrement: 1, // 진행상황 1 증가
      },
    });

    // 모든 몬스터가 죽었을 때
    if (dungeon.isMonstersAllDead()) {
      // 전투에서 승리했음을 플레이어에게 알림
      const btns = [{ msg: '다음', enable: true }];
      const battleLog = {
        msg: `몬스터를 모두 처치했습니다. 전투에서 승리했습니다!`,
        typingAnimation: false,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

      socket.write(responseBattleLog);

      // 퀘스트 진행 상황 업데이트
      questProgressHandler({
        socket,
        payload: {
          questId: user.currentQuestId,
          monsterId: monster.monsterId,
          progressIncrement: dungeon.monsters.length, // 진행상황 몬스터 수만큼 증가
        },
      });

      dungeon.battleSceneStatus = config.sceneStatus.getExp;
    } else {
      switch (dungeon.currentAttackType) {
        case config.attackType.normal:
        case config.attackType.single:
          switchToMonsterAttackScene(dungeon, socket);
          break;
        case config.attackType.wide:
          switchToMonsterDeadScene(dungeon, socket);
          break;
      }
    }
  }
}
