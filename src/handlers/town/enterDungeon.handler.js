import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { addDungeon } from '../../session/dungeon.session.js';
import { findCharacterByUserIdAndClass, findUserByUsername } from '../../db/user/user.db.js';
import { findMonsterByMonsters, findMonstersByDungeonMonsters } from '../../db/game/game.db.js';
import { config } from '../../config/config.js';

const enterDungeonHandler = async ({ socket, payload }) => {
  try {
    const { dungeonCode } = payload;
    const user = getUserBySocket(socket);
    const { nickname } = user;

    const characterClass = user.characterClass;
    const dungeon = addDungeon(nickname);

    const userInDB = await findUserByUsername(nickname);
    const character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
    const monsters = await findMonstersByDungeonMonsters(dungeonCode + 5000);

    const monsterStatus = [];
    for (let i = 0; i < 3; i++) {
      const monsterDB = await findMonsterByMonsters(
        monsters[Math.floor(Math.random() * monsters.length)].monsterId,
      );
      const { monsterId, monsterHp, monsterAttack, monsterName } = monsterDB;

      const monster = {
        monsterIdx: i,
        monsterModel: monsterId,
        monsterName: monsterName,
        monsterHp: monsterHp,
      };
      monsterStatus.push(monster);

      dungeon.addMonster(i, monsterId, monsterHp, monsterAttack, monsterName);
    }

    const dungeonInfo = {
      dungeonCode: dungeonCode + 5000,
      monsters: monsterStatus,
    };

    const playerStatus = {
      playerClass: character.jobId,
      playerLevel: character.characterLevel,
      playerName: character.characterName,
      playerFullHp: character.maxHp,
      playerFullMp: character.maxMp,
      playerCurHp: character.curHp,
      playerCurMp: character.curMp,
    };

    const screenTextAlignment = {
      x: config.screenTextAlignment.x,
      y: config.screenTextAlignment.y,
    };

    const textColor = {
      r: config.textColor.r,
      g: config.textColor.g,
      b: config.textColor.b,
    };

    const screenColor = {
      r: config.screenColor.r,
      g: config.screenColor.g,
      b: config.screenColor.b,
    };

    const message = `${nickname} 가 ${monsterStatus[0].monsterName}, ${monsterStatus[1].monsterName}, ${monsterStatus[2].monsterName}와 전투를 시작합니다.`;

    const screenText = {
      msg: message,
      typingAnimation: true,
      alignment: screenTextAlignment,
      textColor: textColor,
      screenColor: screenColor,
    };

    const BtnInfo = {
      msg: 'btn_test',
      enable: true,
    };

    const BattleLog = {
      msg: 'battle_log_test',
      typingAnimation: true,
      btns: BtnInfo,
    };

    const enterDungeonResponse = createResponse('response', 'S_EnterDungeon', {
      dungeonInfo: dungeonInfo,
      player: playerStatus,
      screenText: screenText,
      battleLog: BattleLog,
    });

    socket.write(enterDungeonResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterDungeonHandler;
