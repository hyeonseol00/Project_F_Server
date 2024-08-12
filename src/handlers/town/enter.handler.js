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
import { addUser, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterTownHandler = async ({ socket, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const userExist = getUserBySocket(socket);

    // 게임세션을 가져온다.
    const gameSession = getGameSession(config.session.townId);

    let userInfo;
    if (!userExist) {
      // 첫 입장에서만 DB에서 정보 불러오기
      userInfo = await getUserInfoFromDB(socket, nickname, characterClass);
    } else {
      // 첫 접속이 아닌 town으로 다시 돌아온 경우 세션 불러오고, DB에 저장
      userInfo = await getUserInfoFromSession(userExist);
    }
    const curUser = userInfo.curUser;
    const statInfo = userInfo.statInfo;

    const items = [
      ...curUser.items.map((item) => ({
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
    // 새로운 유저가 접속 시 퀘스트 확인
    // const currentQuest = checkAndStartQuestHandler(curUser);

    // if (currentQuest) {
    //   const questResponse = createResponse('response', 'S_EnterQuest', {
    //     quest: currentQuest,
    //     message: '진행 중인 퀘스트가 있습니다.',
    //   });

    //   socket.write(questResponse);
    // }

    // ---------- enter 끝 -----------------

    const players = [];

    // 게임 세션에 저장된 모든 playerInfo를 가져옴
    for (const user of gameSession.users) {
      players.push(user.playerInfo);
    }

    // 각 유저에게 본인을 제외한 플레이어 데이터 전송
    for (const user of gameSession.users) {
      const filterdPlayers = players.filter((player) => player.playerId !== user.playerId);

      // console.log('filterdPlayers', filterdPlayers);

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

  // 디버깅 로그 추가: character 객체가 정의되지 않은 경우 확인
  console.log('Character data:', character);
  if (!character || !character.characterId) {
    throw new Error('Character data is not properly initialized.');
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
  const curUser = addUser(socket, nickname, characterClass, effect, userItems, character);

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

  return { curUser, statInfo };
};

const getUserInfoFromSession = async (userExist) => {
  const curUser = userExist;

  // user 세션의 items중 quantity 0인 item 삭제
  for (let i = curUser.items.length - 1; i >= 0; i--) {
    const item = curUser.items[i];
    if (item.quantity === 0) {
      curUser.item.splice(i, 1);
    }
  }

  return { curUser, statInfo: curUser.playerInfo.statInfo };
};

export default enterTownHandler;
