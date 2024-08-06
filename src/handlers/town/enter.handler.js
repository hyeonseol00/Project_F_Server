import Item from '../../classes/models/item.class.js';
import { config } from '../../config/config.js';
import { getItem } from '../../db/game/game.db.js';
import { getUserItemsByCharacterId, updateCharacterItems } from '../../db/user/items/items.db.js';
import {
  findCharacterByUserIdAndClass,
  findUserByUsername,
  getJobInfo,
  insertCharacter,
  insertUserByUsername,
  updateCharacterStatus,
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
    let curUser, statInfo;

    // 게임세션을 가져온다.
    const gameSession = getGameSession(config.session.townId);

    // 첫 입장에서만 DB에서 정보 불러오기
    if (!userExist) {
      // DB에서 user, character 정보 가져오기
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

      const {
        experience,
        critical,
        criticalAttack,
        avoidAbility,
        gold,
        worldLevel,
        skillPoint,
        weapon,
        armor,
        gloves,
        shoes,
        accessory,
      } = character;
      const { baseEffect, singleEffect, wideEffect } = await getJobInfo(character.jobId);

      const userItems = await getUserItemsByCharacterId(character.characterId);
      const userPotions = [];
      const userMountingItems = [];
      for (const userItem of userItems) {
        const itemInfo = await getItem(userItem.itemId);
        const item = new Item(
          itemInfo.itemId,
          itemInfo.itemType,
          itemInfo.itemName,
          itemInfo.itemHp,
          itemInfo.itemMp,
          itemInfo.requireLevel,
          userItem.quantity,
          itemInfo,
        );
        if (itemInfo.itemType === 'potion') {
          // 소비 아이템
          userPotions.push(item);
        } else {
          // 장착 아이템
          userMountingItems.push(item);
        }
      }

      // 유저세션에 해당 유저가 존재하면 유저 데이터를 가져오고,
      // 그렇지 않으면 유저세션, 게임세션에 추가한다.
      curUser = addUser(
        socket,
        nickname,
        characterClass,
        character.characterId,
        experience,
        baseEffect,
        singleEffect,
        wideEffect,
        userPotions,
        userMountingItems,
        critical,
        criticalAttack,
        avoidAbility,
        gold,
        worldLevel,
        skillPoint,
        weapon,
        armor,
        gloves,
        shoes,
        accessory,
      );
      if (!userExist) gameSession.addUser(curUser);

      statInfo = {
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
    } else {
      // 첫 접속이 아닌 town으로 다시 돌아온 경우 (session이 있음) DB에 저장
      curUser = userExist;
      const playerStatus = curUser.playerInfo.statInfo;
      // user 현재 상태 DB에 저장
      await updateCharacterStatus(
        playerStatus.level,
        curUser.experience,
        playerStatus.hp,
        playerStatus.maxHp,
        playerStatus.mp,
        playerStatus.maxMp,
        playerStatus.atk,
        playerStatus.def,
        playerStatus.magic,
        playerStatus.speed,
        curUser.critical,
        curUser.criticalAttack,
        curUser.avoidAbility,
        curUser.gold,
        curUser.skillPoint,
        curUser.weapon,
        curUser.armor,
        curUser.gloves,
        curUser.shoes,
        curUser.accessory,
        curUser.nickname,
        curUser.characterClass,
      );

      // user items 저장
      const sessionItems = [...curUser.potions, ...curUser.mountingItems];
      await updateCharacterItems(curUser.characterId, sessionItems);

      // user 세션의 potions중 quantity 0인 potion 삭제
      for (let i = curUser.potions.length - 1; i >= 0; i--) {
        const potion = curUser.potions[i];
        if (potion.quantity === 0) {
          curUser.potions.splice(i, 1);
        }
      }

      // user 세션의 mountingItems중 quantity 0인 item 삭제
      for (let i = curUser.mountingItems.length - 1; i >= 0; i--) {
        const item = curUser.mountingItems[i];
        if (item.quantity === 0) {
          curUser.mountingItems.splice(i, 1);
        }
      }

      statInfo = {
        level: curUser.playerInfo.statInfo.level,
        hp: curUser.playerInfo.statInfo.hp,
        maxHp: curUser.playerInfo.statInfo.maxHp,
        mp: curUser.playerInfo.statInfo.mp,
        maxMp: curUser.playerInfo.statInfo.maxMp,
        atk: curUser.playerInfo.statInfo.atk,
        def: curUser.playerInfo.statInfo.def,
        magic: curUser.playerInfo.statInfo.magic,
        speed: curUser.playerInfo.statInfo.speed,
        critRate: curUser.critical,
        critDmg: curUser.criticalAttack,
        avoidRate: curUser.avoidAbility,
        exp: curUser.experience,
      };
    }

    const items = curUser.mountingItems.map((item) => ({
      id: item.itemId,
      quantity: item.quantity,
    }));

    const inven = {
      items,
    };

    const transformInfo = {
      posX: Math.random() * 18 - 9, // -9 ~ 9
      posY: 1.0,
      posZ: Math.random() * 16 - 8, // -8 ~ 8
      rot: Math.random() * 360, // 0 ~ 360
    };

    const playerInfo = {
      playerId: curUser.playerId,
      nickname,
      class: characterClass,
      gold: curUser.gold,
      transform: transformInfo,
      statInfo,
      inven,
    };

    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });

    // 플레이어 정보를 user에 추가한다.
    curUser.setPlayerInfo(playerInfo);

    console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

    // 현재 유저에게 응답을 보냄
    socket.write(enterTownResponse);

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

export default enterTownHandler;
