import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket } from '../../session/user.session.js';
import { addDungeon } from '../../session/dungeon.session.js';
import { findCharacterByUserIdAndClass, findUserByUsername } from '../../db/user/user.db.js';

const enterDungeonHandler = async ({ socket, payload }) => {
  try {
    const { dungeonCode } = payload;
    const user = getUserBySocket(socket);
    const nickname = user.playerId;

    const characterClass = user.characterClass;
    const dungeon = addDungeon(user.playerId);

    // 이 부분 지금 하드코딩임. 데이터베이스에서 받아와서 랜덤으로 뽑는 등 처리 요망
    dungeon.addMonster(0, 2001, 300, 60, '빨간버섯');
    dungeon.addMonster(1, 2002, 300, 60, '외눈슬라임');

    const userInDB = await findUserByUsername(nickname);
    const character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);

    const monsterStatus = [];
    for (let i = 0; i < dungeon.monsters.length; i++) {
      const monster = dungeon.monsters[i];
      monsterStatus.push({
        monsterIdx: monster.idx,
        monsterModel: monster.id,
        monsterName: monster.name,
        monsterHp: monster.hp,
      });
    }

    const dungeonInfo = {
      dungeonCode: dungeonCode + 5000,
      monsters: monsterStatus,
    };

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
      msg: 'screen_text_test',
      typingAnimation: true,
      alignment: ScreenTextAlignment,
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
      ScreenText: ScreenText,
      battleLog: BattleLog,
    });

    socket.write(enterDungeonResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterDungeonHandler;
