import { getPlayerInfo, setPlayerInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import Item from '../../classes/models/item.class.js';
import { config } from '../../config/config.js';
import { getUserItemsByCharacterId } from '../../db/user/items/items.db.js';
import {
  findCharacterByUserIdAndClass,
  findUserByUsername,
  getJobInfo,
  insertCharacter,
} from '../../db/user/user.db.js';
import { getGameSession } from '../../session/game.session.js';
import {
  addUser,
  getAllUserNicknames,
  getUserByNickname,
  getUserBySocket,
} from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { checkAndStartQuestHandler } from '../town/chatCommands/quest/checkAndStartQuest.chat.js';

const enterTownHandler = async ({ socket, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const userExist = await getUserBySocket(socket);

    // 게임세션을 가져온다.
    const gameSession = await getGameSession(config.session.townId);

    let curUser;

    if (!userExist) {
      // 첫 입장에서만 DB에서 정보 불러오기
      curUser = await getUserInfoFromDB(socket, nickname, characterClass);
    } else {
      // 첫 접속이 아닌 town으로 다시 돌아온 경우 세션 불러오고, DB에 저장
      curUser = await getUserInfoFromSession(socket, userExist);
    }
    const playerInfo = curUser.playerInfo;

    // 플레이어 정보를 user에 추가한다.
    await setPlayerInfo(socket, playerInfo);
    gameSession.addUser(nickname);

    console.log('현재 접속 중인 유저: ', getAllUserNicknames());

    // 현재 유저에게 응답을 보냄
    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });
    socket.write(enterTownResponse);

    // ---------- enter 끝 -----------------

    const playerInfos = [];

    // 게임 세션에 저장된 모든 playerInfo를 가져옴
    for (const nickname of gameSession.playerNicknames) {
      const player = getUserByNickname(nickname);
      const playerInfo = await getPlayerInfo(player.socket);
      playerInfos.push(playerInfo);
    }

    // 각 유저에게 본인을 제외한 플레이어 데이터 전송
    for (const nickname of gameSession.playerNicknames) {
      const filterdPlayers = playerInfos.filter((playerInfo) => playerInfo.nickname !== nickname);

      const user = await getUserByNickname(nickname);

      // 해당 유저에게 다른 유저들을 스폰(해당 유저 제외)
      const spawnTownResponse = createResponse('response', 'S_Spawn', {
        players: filterdPlayers,
      });

      user.socket.write(spawnTownResponse);
    }

    const channelNumberResponse = createResponse('response', 'S_Chat', {
      playerId: curUser.playerId,
      chatMsg: `[System] ${config.server.channel}번 채널에 입장했습니다.
[System] 마을에서는 마우스 왼쪽 클릭으로 이동, 오른쪽 클릭으로 카메라를 회전할 수 있습니다.
[System] 마을 호수 부분의 불타는 모양 포탈에 서서 E키를 누르면 보스가 등장하는 던전으로 진입할 수 있습니다.
[System] 보스 던전에서는 WASD와 마우스 왼쪽 클릭으로 캐릭터를 조작할 수 있습니다.`,
    });
    socket.write(channelNumberResponse);

    // ---------- spawn 끝 -----------------
    // 사용자가 마을에 입장할 때 퀘스트 알림 제공
    await checkAndStartQuestHandler(curUser); // curUser
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

  const jobInfo = await getJobInfo(character.jobId);
  const { baseEffect, singleEffect, wideEffect } = jobInfo;
  const effectCode = { baseEffect, singleEffect, wideEffect };
  if (!character || !character.characterId) {
    throw new Error('Character data is not properly initialized.');
  }

  const userItemInDB = await getUserItemsByCharacterId(character.characterId);
  const userItems = [];
  for (const userItem of userItemInDB) {
    const item = new Item(userItem.id, userItem.quantity);
    userItems.push(item);
  }
  const inven = {};
  inven.items = userItems;

  // 유저세션에 해당 유저가 존재하면 유저 데이터를 가져오고,
  // 그렇지 않으면 유저세션, 게임세션에 추가한다.
  const curUser = await addUser(socket, effectCode, character);

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

  const equipment = {
    weapon: character.weapon,
    armor: character.armor,
    gloves: character.gloves,
    shoes: character.shoes,
    accessory: character.accessory,
  };

  const transformInfo = {
    posX: Math.random() * 18 - 9 + config.town.spawnAreaPos.x, // -9 ~ 9
    posY: 1.0 + config.town.spawnAreaPos.y,
    posZ: Math.random() * 16 - 8 + config.town.spawnAreaPos.z, // -8 ~ 8
    rot: Math.random() * 360, // 0 ~ 360
  };

  const playerInfo = {
    playerId: curUser.playerId,
    nickname,
    class: characterClass,
    gold: character.gold,
    transform: transformInfo,
    statInfo,
    inven,
    equipment,
  };

  curUser.playerInfo = playerInfo;
  return curUser;
};

const getUserInfoFromSession = async (socket, userExist) => {
  const playerInfo = await getPlayerInfo(socket);
  // user 세션의 items중 quantity 0인 item 삭제
  for (let i = playerInfo.inven.items.length - 1; i >= 0; i--) {
    const item = playerInfo.inven.items[i];
    if (item.quantity === 0) {
      playerInfo.inven.items.splice(i, 1);
    }
  }

  userExist.playerInfo = playerInfo;

  return userExist;
};

export default enterTownHandler;
