import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterDungeonHandler = async ({ socket, userId, payload }) => {
  try {
    const { dungeonCode } = payload;

    const monsterStatus = [
      {
        monsterIdx: 2001,
        monsterModel: 0,
        monsterName: '몬스터',
        monsterHp: 100.0,
      },
    ];

    const dungeonInfo = {
      dungeonCode: dungeonCode + 5000,
      monsters: monsterStatus,
    };

    const playerStatus = {
      playerClass: 1,
      playerLevel: 1,
      playerName: 'aa',
      playerFullHp: 100.0,
      playerFullMp: 100.0,
      playerCurHp: 100.0,
      playerCurMp: 100.0,
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
