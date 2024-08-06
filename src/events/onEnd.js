import { config } from '../config/config.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import leaveTownHandler from '../handlers/town/leave.handler.js';
import { removeDungeon } from '../session/dungeon.session.js';
import { updateCharacterStatus } from '../db/user/user.db.js';
import { updateCharacterItems } from '../db/user/items/items.db.js';
import { getHatcherySession } from '../session/hatchery.session.js';

export const onEnd = (socket) => async () => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(config.session.townId);
  const playerStatus = user.playerInfo.statInfo;
  const hatcherySession = getHatcherySession();

  if (user) {
    await updateCharacterStatus(
      playerStatus.level,
      user.experience,
      playerStatus.hp,
      playerStatus.maxHp,
      playerStatus.mp,
      playerStatus.maxMp,
      playerStatus.atk,
      playerStatus.def,
      playerStatus.magic,
      // user.speed,
      playerStatus.speed,
      user.critical,
      user.criticalAttack,
      user.avoidAbility,
      user.gold,
      user.skillPoint,
      user.weapon,
      user.armor,
      user.gloves,
      user.shoes,
      user.accessory,
      user.nickname,
      user.characterClass,
    );

    const sessionItems = [...user.potions, ...user.mountingItems];
    await updateCharacterItems(user.characterId, sessionItems);

    gameSession.removeUser(user.playerId);
    hatcherySession.removePlayer(user.nickname);
  }
  removeDungeon(user.nickname);

  console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
  console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

  removeUser(socket);

  leaveTownHandler(socket, user);
};
