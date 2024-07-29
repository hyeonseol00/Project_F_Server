import { getLevelTable } from '../../../db/game/game.db.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToGameOverWin from './switchScene/gameOverWin.switch.js';

export default async function getExpScene(responseCode, dungeon, socket) {
  if (responseCode === 1) {
    const player = dungeon.player;
    const level = player.level;
    const levelTable = await getLevelTable(level + 1);

    let monsterExp = 0;
    for (let i = 0; i < dungeon.monsters.length; i++) {
      const monster = dungeon.monsters[i];
      monsterExp += monster.exp;
    }

    const playerExp = monsterExp + player.experience;
    if (levelTable.required_exp < playerExp) {
      player.level++;
      player.experience = playerExp - levelTable.required_exp;

      const btns = [{ msg: '다음', enable: true }];
      const battleLog = {
        msg: `레벨 ${level}이 되었습니다!`,
        typingAnimation: true,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

      socket.write(responseBattleLog);

      switchToGameOverWin(dungeon, socket);
    } else {
      const btns = [{ msg: '다음', enable: true }];
      const battleLog = {
        msg: `경험치 ${monsterExp}를 획득했습니다!`,
        typingAnimation: true,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

      socket.write(responseBattleLog);

      switchToGameOverWin(dungeon, socket);
    }
  }
}
