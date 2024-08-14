import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToMonsterAttackScene from './switchScene/monsterAttack.switch.js';
import switchToMonsterDeadScene from './switchScene/monsterDead.switch.js';
import { updateQuestProgressAfterBattle } from '../../town/chatCommands/quest/updateQuest.chat.js';

export default function monsterDeadScene(responseCode, dungeon, socket) {
  if (responseCode == 1) {
    const user = dungeon.player; // 현재 플레이어

    // 사용자에게 할당된 퀘스트 ID를 가져옴
    const questId = user.currentQuestId;

    if (dungeon.isMonstersAllDead()) {
      const progressIncrement = 3; // 모든 몬스터가 죽었을 때만 진행 상황 3 증가

      if (questId) {
        console.log(`Current Quest ID: ${questId}`);
        console.log(`Current Dungeon ID: ${dungeon.id}`);

        // 전투 후 퀘스트 진행 상황 업데이트
        updateQuestProgressAfterBattle(user, questId, progressIncrement);
      } else {
        console.error('유효한 퀘스트 ID가 없습니다.');
      }

      const btns = [{ msg: '다음', enable: true }];
      const battleLog = {
        msg: `몬스터를 모두 처치했습니다. 전투에서 승리했습니다!`,
        typingAnimation: false,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

      socket.write(responseBattleLog);

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
