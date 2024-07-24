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

const enterTownHandler = async ({ socket, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const gameSession = getGameSession(config.session.id);

    const curUser = addUser(socket, nickname, characterClass);
    gameSession.addUser(curUser);

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
      posX: Math.random()*18-9,   // -9 ~ 9
      posY: 1.0,
      posZ: Math.random()*16-8,   // -8 ~ 8
      rot: Math.random()*360,     // 0 ~ 360
    };
    const statInfo = {
      level: character.level,
      hp: parseFloat(character.hp),
      maxHp: parseFloat(character.hp),
      mp: parseFloat(character.mp),
      maxMp: parseFloat(character.mp),
      atk: parseFloat(character.attack),
      def: parseFloat(character.defense),
      magic: parseFloat(character.magic),
      speed: parseFloat(character.speed),
    };
    const playerInfo = {
      playerId: curUser.id,
      nickname,
      class: characterClass,
      transform: transformInfo,
      statInfo,
    };
    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });

    // 디버그 출력문
    console.log("transformInfo", transformInfo);

    // 플레이어 정보를 user에 추가하고 게임세션에 해당 유저를 추가한다.
    curUser.setPlayerInfo(playerInfo);

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

    console.log("user.playerInfo", playerInfo);

    // 각 유저에게 본인을 제외한 플레이어 데이터 전송
    for (const user of gameSessions[0].users) {  
      const filterdPlayers = players.filter((player) => player.playerId !== user.id)
      
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
