import { getPlayerInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import Item from '../../classes/models/item.class.js';
import { config } from '../../config/config.js';
import { getUserItemsByCharacterId } from '../../db/user/items/items.db.js';
import {
  findCharacterByUserIdAndClass,
  findUserByUsername,
  getJobInfo,
  insertCharacter,
  insertUserByUsername,
} from '../../db/user/user.db.js';
import { getGameSession } from '../../session/game.session.js';
import { addUser, getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterTownHandler = async ({ socket, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const userExist = await getUserBySocket(socket);

    // 게임세션을 가져온다.
    const gameSession = await getGameSession(config.session.townId);

    let userInfo;

    if (!userExist) {
      // 첫 입장에서만 DB에서 정보 불러오기
      userInfo = await getUserInfoFromDB(socket, nickname, characterClass);
    } else {
      // 첫 접속이 아닌 town으로 다시 돌아온 경우 세션 불러오고, DB에 저장
      userInfo = await getUserInfoFromSession(socket, userExist);
    }
    const curUser = userInfo.playerInfo;
    const statInfo = userInfo.statInfo;

    const items = [
      ...curUser.inven.map((item) => ({
        id: item.itemId,
        quantity: item.quantity,
      })),
    ];

    const inven = {
      items,
    };

    const transformInfo = {
      posX: Math.random() * 18 - 9, // -9 ~ 9
      posY: 1.0,
      posZ: Math.random() * 16 - 8, // -8 ~ 8
      rot: Math.random() * 360, // 0 ~ 360
    };

    const equipment = {
      weapon: curUser.equipment.weapon,
      armor: curUser.equipment.armor,
      gloves: curUser.equipment.gloves,
      shoes: curUser.equipment.shoes,
      accessory: curUser.equipment.accessory,
    };

    const playerInfo = {
      playerId: curUser.playerId,
      nickname,
      class: characterClass,
      gold: curUser.gold,
      transform: transformInfo,
      statInfo,
      inven,
      equipment,
    };

    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });

    // 플레이어 정보를 user에 추가한다.
    curUser.setPlayerInfo(playerInfo);
    gameSession.addUser(curUser);

    console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

    // 현재 유저에게 응답을 보냄
    socket.write(enterTownResponse);

    // ---------- enter 끝 -----------------

    const players = [];

    // 게임 세션에 저장된 모든 playerInfo를 가져옴
    for (const nickname of gameSession.playerNicknames) {
      const player = getUserByNickname(nickname);
      players.push(await getPlayerInfo(player.socket));
    }

    // 각 유저에게 본인을 제외한 플레이어 데이터 전송
    for (const nickname of gameSession.playerNicknames) {
      const filterdPlayers = players.filter((player) => player.nickname !== nickname);

      // 해당 유저에게 다른 유저들을 스폰(해당 유저 제외)
      const spawnTownResponse = createResponse('response', 'S_Spawn', {
        players: filterdPlayers,
      });

      user.socket.write(spawnTownResponse);
    }

    // ---------- spawn 끝 -----------------
  } catch (err) {
    handleError(socket, err);
  }
};

const getUserInfoFromDB = async (socket, nickname, characterClass) => {
  // DB에서 user, character 정보 가져오기
  let userInDB = await findUserByUsername(nickname);

  // character 처음 생성하는 거면 character DB에 추가
  let character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
  if (!character) {
    await insertCharacter(userInDB, characterClass);
    character = await findCharacterByUserIdAndClass(userInDB.userId, characterClass);
  }

  const effect = await getJobInfo(character.jobId);

  const userItemInDB = await getUserItemsByCharacterId(character.characterId);
  const userItems = [];
  for (const userItem of userItemInDB) {
    const item = new Item(userItem.itemId, userItem.quantity);
    userItems.push(item);
  }

  // 유저세션에 해당 유저가 존재하면 유저 데이터를 가져오고,
  // 그렇지 않으면 유저세션, 게임세션에 추가한다.
  await addUser(socket, effect, character);
  const playerInfo = await getPlayerInfo(socket);

  const statInfo = {
    level: character.characterLevel,
    hp: character.curHp,
    maxHp: character.maxHp,
    mp: character.curMp,
    maxMp: character.maxMp,
    atk: character.attack,
    def: character.defense,
    magic: character.magic,
    speed: character.speed,
    critRate: character.critical,
    critDmg: character.criticalAttack,
    avoidRate: character.avoidAbility,
    exp: character.experience,
  };

  return { playerInfo, statInfo };
};

const getUserInfoFromSession = async (socket, userExist) => {
  const playerInfo = await getPlayerInfo(socket);
  // user 세션의 items중 quantity 0인 item 삭제
  for (let i = playerInfo.inven.length - 1; i >= 0; i--) {
    const item = playerInfo.inven[i];
    if (item.quantity === 0) {
      playerInfo.inven.splice(i, 1);
    }
  }

  return { playerInfo, statInfo: playerInfo.statInfo };
};

export default enterTownHandler;
