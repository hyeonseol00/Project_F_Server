import { config } from '../../config/config.js';
import {
  findCharacterByUserIdAndClass,
  findUserByUsername,
  insertCharacter,
  insertUserByUsername,
} from '../../db/user/user.db.js';
import { getGameSession } from '../../session/game.session.js';
import { addUser, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterTownHandler = async ({ socket, userId, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const gameSession = getGameSession(config.session.townId);

    const userExist = getUserBySocket(socket);
    const user = userExist ? userExist : addUser(socket, nickname, characterClass);
    if (!userExist) gameSession.addUser(user);

    // DB
    let userInDB = await findUserByUsername(nickname);
    if (!userInDB) {
      await insertUserByUsername(nickname);
      userInDB = await findUserByUsername(nickname);
    }

    let character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
    if (!character) {
      await insertCharacter(userInDB, characterClass);
      character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
    }

    const transformInfo = {
      posX: character.x,
      posY: 1,
      posZ: character.z,
      rot: character.rot,
    };
    const statInfo = {
      level: character.level,
      hp: character.hp,
      maxHp: character.hp,
      mp: character.mp,
      maxMp: character.mp,
      atk: character.attack,
      def: character.defense,
      magic: character.magic,
      speed: character.speed,
    };
    const playerInfo = {
      playerId: user.playerId,
      nickname,
      class: characterClass,
      transform: transformInfo,
      statInfo,
    };
    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });

    console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

    socket.write(enterTownResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterTownHandler;
