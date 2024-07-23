import { config } from '../../config/config.js';
import {
  findCharacterByUserIdAndClass,
  findUserByUsername,
  insertCharacter,
  insertUserByUsername,
} from '../../db/user/user.db.js';
import { getGameSession } from '../../session/game.session.js';
import { gameSessions } from '../../session/sessions.js';
import { addUser } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterTownHandler = async ({ socket, userId, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const gameSession = getGameSession(config.session.id);

    const user = addUser(socket, nickname, characterClass);
    gameSession.addUser(user);

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

    console.log("character", character);

    const transformInfo = {
      posX: character.x,
      posY: 1,
      posZ: character.z,
      rot: character.rot,
    };

    console.log("transformInfo", transformInfo);
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
      playerId: curUser.playerId,
      nickname,
      class: characterClass,
      transform: transformInfo,
      statInfo,
    };
    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });

    // // 플레이어 정보를 user에 추가하고 게임세션에 해당 유저를 추가한다.
    curUser.setPlayerInfo(playerInfo);
    gameSession.addUser(curUser);

    console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());
    console.log("curUser.playerId", curUser.playerId);

    // 현재 유저에게 응답을 보냄
    socket.write(enterTownResponse);

    // ---------- enter 끝 -----------------

    const players = [];

    // 게임 세션에 저장된 모든 플레이어의 정보를 가져옴
    for(const user of gameSessions[0].users){
      players.push(user.playerInfo);
    }

    // 각 유저에게 본인을 제외한 플레이어 데이터 전송
    for (const user of gameSessions[0].users) {  
      const filterdPlayers = players.filter((player) => player.playerId !== user.playerId)
      
      console.log("filterdPlayers", filterdPlayers);

      // 해당 유저에게 다른 유저들을 스폰(해당 유저 제외)
      const spawnTownResponse = createResponse('response', 'S_Spawn', {
        players: filterdPlayers
      });

      user.socket.write(spawnTownResponse);
    }

    // ---------- spawn 끝 -----------------

  } catch (err) {
    handleError(socket, err);
  }
};

export default enterTownHandler;
