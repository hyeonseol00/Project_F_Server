import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { addDungeon } from '../../session/dungeon.session.js';
import { findCharacterByUserIdAndClass, findUserByUsername } from '../../db/user/user.db.js';
import { findMonsterByMonsters } from '../../db/user/user.db.js';
import { findMonstersByDungeonMonsters } from '../../db/user/user.db.js';

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
      const { monsterId, hp, attack, name } = monsterDB;

      const monster = {
        monsterIdx: i,
        monsterModel: monsterId,
        monsterName: name,
        monsterHp: hp,
      };
      monsterStatus.push(monster);

      dungeon.addMonster(i, monsterId, hp, attack, name);
    }

    const dungeonInfo = {
      dungeonCode: dungeonCode + 5000,
      monsters: monsterStatus,
    };

    const playerStatus = {
      playerClass: character.jobId,
      playerLevel: character.level,
      playerName: character.name,
      playerFullHp: character.maxHp,
      playerFullMp: character.maxMp,
      playerCurHp: character.hp,
      playerCurMp: character.mp,
    };

    const screenTextAlignment = {
      x: 0,
      y: 0,
    };

    const textColor = {
      r: 255,
      g: 255,
      b: 255,
    };

    const screenColor = {
      r: 0,
      g: 0,
      b: 0,
    };

    const screenText = {
      msg: '던전에 진입합니다. 전투를 준비하세요!',
      typingAnimation: false,
      alignment: screenTextAlignment,
      textColor: textColor,
      screenColor: screenColor,
    };

    const btns = [
      {
        msg: 'btn_test',
        enable: false,
      },
    ];

    const battleLog = {
      msg: 'battle_log_test',
      typingAnimation: false,
      btns,
    };

    const enterDungeonResponse = createResponse('response', 'S_EnterDungeon', {
      dungeonInfo,
      player: playerStatus,
      screenText,
      battleLog,
    });

    socket.write(enterDungeonResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterDungeonHandler;
