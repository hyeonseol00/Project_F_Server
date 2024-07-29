import { getLevelTable } from '../../../db/game/game.db.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import switchToGameOverWin from './switchScene/gameOverWin.switch.js';
import { updateCharacterStatus } from '../../../db/user/user.db.js';

export default async function getExpScene(responseCode, dungeon, socket) {
  if (responseCode === 1) {
    const btns = [{ msg: '다음', enable: true }];
    const player = dungeon.player;
    const level = player.level;
    const levelTable = await getLevelTable(level + 1);
    const {levelId , requiredExp , hp , mp , attack , defense , magic , speed , skillPoint}  = levelTable;
    let monsterExp = 0;
    for (let i = 0; i < dungeon.monsters.length; i++) {
      const monster = dungeon.monsters[i];
      monsterExp += monster.exp;
    }

    const playerExp = monsterExp + player.experience;
    if (requiredExp < playerExp) {
      player.updateLevel(level + 1, playerExp - requiredExp);

      await updateCharacterStatus(
        level + 1,
        playerExp,
        player.curHp + hp,
        player.maxHp + hp,
        player.curMp + mp,
        player.attack + attack,
        player.defense + defense,
        player.magic + magic,
        player.speed + speed,
        player.userId,
        player.jobId,
      );
      player.curHp = player.maxHp + hp;
      player.curMp = player.maxMp + mp;
      
      const message = ` 경험치 ${monsterExp}를 획득했습니다!\n 
      공격력 +${attack} , 방어력 +${defense} , 마력 +${magic} , 스피드 +${speed}이 증가되었습니다!\n
      최대체력 +${hp} , 최대마나 +${mp}가 증가되었습니다!\n
      레벨 ${level}이 되었습니다!`;

      const battleLog = {
        msg: message,
        typingAnimation: true,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

      socket.write(responseBattleLog);

      switchToGameOverWin(dungeon, socket);
    } else {
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
