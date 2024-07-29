import { getLevelTable } from '../../../db/game/game.db.js';
import { createResponse } from '../../../utils/response/createResponse.js';
import { updateCharacterCurStatus, updateCharacterStatus } from '../../../db/user/user.db.js';
import { config } from '../../../config/config.js';

export default async function getExpScene(responseCode, dungeon, socket) {
  if (responseCode === 1) {
    const btns = [{ msg: '다음', enable: true }];
    let battleLog = {};

    const player = dungeon.player; // user 클래스
    const playerStatus = player.playerInfo.statInfo; // user 클래스 내의 playerInfo -> statInfo
    const playerLevel = playerStatus.level; // 유저의 현재 레벨

    let levelTable;
    if (playerLevel > config.maxLevel) {
      levelTable = await getLevelTable(playerLevel + 1);
    } else {
      levelTable = await getLevelTable(1);
    }
    const { levelId, requiredExp, hp, mp, attack, defense, magic, speed, skillPoint } = levelTable;

    let monsterExp = 0;
    for (let i = 0; i < dungeon.monsters.length; i++) {
      const monster = dungeon.monsters[i];
      monsterExp += monster.exp;
    }

    const playerExp = monsterExp + player.experience;
    // 현재 경험치가 필요 경험치보다 높을 경우 와 현재 레벨이 최고 레벨보다 작을 경우
    if (requiredExp <= playerExp && playerLevel < config.maxLevel) {
      player.updateLevel(playerLevel + 1, playerExp - requiredExp);

      await updateCharacterStatus(
        levelId,
        playerExp - requiredExp,
        playerStatus.maxHp + hp,
        playerStatus.maxHp + hp,
        playerStatus.maxMp + mp,
        playerStatus.maxMp + mp,
        playerStatus.atk + attack,
        playerStatus.def + defense,
        playerStatus.magic + magic,
        playerStatus.speed + speed,
        player.nickname,
        player.characterClass,
      );
      playerStatus.hp = playerStatus.maxHp + hp;
      playerStatus.mp = playerStatus.maxMp + mp;

      const message = ` 경험치 ${monsterExp}를 획득했습니다!\n
      레벨 ${playerLevel + 1}이 되었습니다!\n
      최대체력 +${hp} , 최대마나 +${mp}가 증가되었습니다!\n
      공격력 +${attack} , 방어력 +${defense} , 마력 +${magic} , 스피드 +${speed}이 증가되었습니다!\n`;

      battleLog = {
        msg: message,
        typingAnimation: true,
        btns,
      };
    } else {
      player.experience += monsterExp;
      await updateCharacterCurStatus(
        player.experience,
        playerStatus.hp,
        playerStatus.mp,
        player.nickname,
        player.characterClass,
      );

      battleLog = {
        msg: `경험치 ${monsterExp}를 획득했습니다!`,
        typingAnimation: true,
        btns,
      };
    }

    const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

    socket.write(responseBattleLog);

    dungeon.battleSceneStatus = config.sceneStatus.goToTown;
  }
}
