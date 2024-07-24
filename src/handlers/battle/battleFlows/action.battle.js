import { config } from '../../../config/config.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default function chooseActionScene(responseCode, dungeon, socket) {
  const btns = [];

  switch (responseCode) {
    case config.actionButton.attack:
      for (let i = 0; i < dungeon.monsters.length; i++) {
        const monster = dungeon.monsters[i];
        btns.push({ msg: `${monster.name}`, enable: true });
      }
      const attackBattleLog = {
        msg: '공격할 몬스터를 선택하세요!',
        typingAnimation: true,
        btns,
      };

      const attackResponse = createResponse('response', 'S_BattleLog', { attackBattleLog });
      socket.write(attackResponse);

      dungeon.battleSceneStatus = config.sceneStatus.target;
      break;
    case config.actionButton.skill:
      break;
    case config.actionButton.runaway:
      btns.push({ msg: '확인', enable: true });
      const runawayBattleLog = {
        msg: '전투에서 도망칩니다!',
        typingAnimation: true,
        btns,
      };

      const runawayResponse = createResponse('response', 'S_BattleLog', { runawayBattleLog });
      socket.write(runawayResponse);

      dungeon.battleSceneStatus = config.sceneStatus.confirm;
      break;
  }
}
