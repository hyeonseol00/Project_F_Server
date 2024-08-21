import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { addDungeon } from '../../session/dungeon.session.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getMonsterByDungeonId } from '../../assets/monster.assets.js';
import { getMonsterById } from '../../assets/monster.assets.js';
import { getPlayerInfo } from '../../classes/DBgateway/playerinfo.gateway.js';

const enterDungeonHandler = async ({ socket, payload }) => {
  try {
    const { dungeonCode } = payload;
    const user = await getUserBySocket(socket);
    const userPlayerInfo = await getPlayerInfo(socket);

    const gameSession = getGameSession(config.session.townId);
    const dungeon = addDungeon(userPlayerInfo.nickname, dungeonCode);
    gameSession.removeUser(user.nickname);

    const monsters = await getMonsterByDungeonId(dungeonCode + 5000);

    const worldLevels = config.worldLevels;

    const {
      hpRating = 1,
      attackRating = 1,
      expRating = 1,
      goldRating = 1,
    } = worldLevels[user.worldLevel] || {};

    const monsterStatus = [];

    for (let i = 0; i < 3; i++) {
      const monsterDB = monsters[Math.floor(Math.random() * monsters.length)].monsterId;
      const {
        monsterId,
        monsterHp,
        monsterAttack,
        monsterName,
        monsterEffect,
        monsterExp,
        monsterGold,
        monsterCritical,
        monsterCriticalAttack,
      } = await getMonsterById(monsterDB);

      const monster = {
        monsterIdx: i,
        monsterModel: monsterId,
        monsterName: monsterName,
        monsterHp: monsterHp * hpRating,
      };
      monsterStatus.push(monster);

      dungeon.addMonster(
        i,
        monsterId,
        monsterHp * hpRating,
        monsterAttack * attackRating,
        monsterName,
        monsterEffect,
        monsterExp * expRating,
        monsterGold * goldRating,
        monsterCritical,
        monsterCriticalAttack,
      );
    }

    const dungeonInfo = {
      dungeonCode: dungeonCode + 5000,
      monsters: monsterStatus,
    };

    const playerStatus = {
      playerClass: userPlayerInfo.class,
      playerLevel: userPlayerInfo.statInfo.level,
      playerName: userPlayerInfo.nickname,
      playerFullHp: userPlayerInfo.statInfo.maxHp,
      playerFullMp: userPlayerInfo.statInfo.maxMp,
      playerCurHp: userPlayerInfo.statInfo.hp,
      playerCurMp: userPlayerInfo.statInfo.mp,
    };

    // // 던전 ID를 기반으로 퀘스트 ID 매핑
    // const questId = getQuestIdForDungeon(dungeonCode + 5000);
    // if (questId) {
    //   user.currentQuestId = questId; // 사용자의 currentQuestId에 퀘스트 ID 저장
    //   console.log(`Quest ID ${questId} assigned for Dungeon ID ${dungeonCode + 5000}`);
    // } else {
    //   console.log(`No Quest ID assigned for Dungeon ID ${dungeonCode + 5000}`);
    // }

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

    const message = `${userPlayerInfo.nickname}님이 던전에 진입합니다.\n야생의 ${monsterStatus[0].monsterName},\n${monsterStatus[1].monsterName},\n${monsterStatus[2].monsterName}이(가) 등장했습니다!.\n전투를 준비하세요.`;

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

    const enterDungeonResponse = createResponse('response', 'S_EnterDungeon', {
      dungeonInfo,
      player: playerStatus,
      screenText,
      battleLog,
    });

    socket.write(enterDungeonResponse);

    const despawnTownResponse = createResponse('response', 'S_Despawn', {
      playerIds: [user.playerId],
    });
    const townUserIds = gameSession.getAllUserIds();
    townUserIds.forEach((nickname) => {
      const user = getUserByNickname(nickname);
      user.socket.write(despawnTownResponse);
    });
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterDungeonHandler;
