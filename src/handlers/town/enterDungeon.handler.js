import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse, createResponseAsync } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { addDungeon } from '../../session/dungeon.session.js';
import { findCharacterByUserIdAndClass, findUserByUsername } from '../../db/user/user.db.js';
import { findMonsterByMonsters, findMonstersByDungeonMonsters } from '../../db/game/game.db.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';

const enterDungeonHandler = async ({ socket, payload }) => {
  try {
    const { dungeonCode } = payload;
    const user = getUserBySocket(socket);
    const { nickname } = user;

    const gameSession = getGameSession(config.session.townId);
    const player = gameSession.getUser(user.playerId);
    const dungeon = addDungeon(nickname, player);
    const characterClass = user.characterClass;

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

    const message = `${nickname}님이 던전에 진입합니다.\n야생의 ${monsterStatus[0].monsterName},\n${monsterStatus[1].monsterName},\n${monsterStatus[2].monsterName}이(가) 등장했습니다!.\n전투를 준비하세요.`;

    const screenText = {
      msg: message,
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

    const enterDungeonResponse = await createResponseAsync('response', 'S_EnterDungeon', {
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
