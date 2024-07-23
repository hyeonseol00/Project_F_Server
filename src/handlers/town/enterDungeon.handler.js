import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { findCharacterByUserIdAndClass, findUserByUsername } from '../../db/user/user.db.js';

const enterDungeonHandler = async ({ socket, userId, payload }) => {
  try {
    const { dungeonCode } = payload;
    const user = getUserBySocket(socket);
    const nickname = user.playerId;
    const characterClass = user.characterClass;

    let userInDB = await findUserByUsername(nickname);
    let character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
    const monsterStatus = [
      {
        monsterIdx: 0,
        monsterModel: 2001,
        monsterName: '몬스터',
        monsterHp: 100.0,
      },
      {
        monsterIdx: 1,
        monsterModel: 2004,
        monsterName: '몬스터2',
        monsterHp: 300.0,
      },
    ];

    const dungeonInfo = {
      dungeonCode: dungeonCode + 5000,
      monsters: monsterStatus,
    };
    console.log(character);
    const playerStatus = {
      playerClass: character.jobId,
      playerLevel: character.level,
      playerName: character.name,
      playerFullHp: character.MaxHp,
      playerFullMp: character.MaxMp,
      playerCurHp: character.hp,
      playerCurMp: character.mp,
    };

    const ScreenTextAlignment = {
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

    const ScreenText = {
      msg: 'aaa',
      typingAnimation: true,
      alignment: ScreenTextAlignment,
      textColor: textColor,
      screenColor: screenColor,
    };

    const BtnInfo = {
      msg: 'aa',
      enable: true,
    };

    const BattleLog = {
      msg: 'aa',
      typingAnimation: true,
      btns: BtnInfo,
    };

    const enterDungeonResponse = createResponse('response', 'S_EnterDungeon', {
      dungeonInfo: dungeonInfo,
      player: playerStatus,
      ScreenText: ScreenText,
      battleLog: BattleLog,
    });

    socket.write(enterDungeonResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterDungeonHandler;
