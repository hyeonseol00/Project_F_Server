import { config } from '../config/config.js';
import { getGameSession } from '../session/game.session.js';
import { getUserBySocket, removeUser } from '../session/user.session.js';
import leaveTownHandler from '../handlers/town/leave.handler.js';
import { removeDungeon } from '../session/dungeon.session.js';
import { updateCharacterStatus } from '../db/user/user.db.js';
import { updateCharacterMountingItems } from '../db/user/items/items.db.js';

export const onEnd = (socket) => async () => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(config.session.townId);
  const playerStatus = user.playerInfo.statInfo;

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
      playerStatus.speed,
      user.critical,
      user.criticalAttack,
      user.avoidAbility,
      user.gold,
      user.weapon,
      user.armor,
      user.gloves,
      user.shoes,
      user.accessory,
      user.nickname,
      user.characterClass,
    );

    await updateCharacterMountingItems(user.characterId, user.mountingItems);

    gameSession.removeUser(user.playerId);
  }
  removeDungeon(user.nickname);

  console.log('클라이언트 연결이 해제되었습니다: ', socket.remoteAddress, socket.remotePort);
  console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

  removeUser(socket);

  leaveTownHandler(socket, user);
};
