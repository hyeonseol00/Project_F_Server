import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterHatcheryHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const hatcherySession = getHatcherySession();
    const user = getUserBySocket(socket);

    const { hp, maxHp, name } = hatcherySession.monster;

    gameSession.removeUser(user.playerId);
    hatcherySession.addPlayer(user);

    /***** S_EnterHatchery *****/
    const enterHatcheryResponse = createResponse('response', 'S_EnterHatchery', {
      player: user.getPlayerInfo(),
      bossMaxHp: maxHp,
      bossName: name,
    });

    socket.write(enterHatcheryResponse);

    /***** S_SetHatcheryBossHp *****/
    const setHatcheryBossHpResponse = createResponse('response', 'S_SetHatcheryBossHp', {
      bossCurHp: hp,
    });

    socket.write(setHatcheryBossHpResponse);

    /***** S_SpawnPlayerHatchery *****/
    const playerInfos = [];
    for (const player of hatcherySession.players) {
      playerInfos.push(player.playerInfo);
    }

    for (const player of hatcherySession.players) {
      const filterdPlayerInfos = playerInfos.filter(
        (playerInfo) => playerInfo.playerId !== player.playerId,
      );

      const spawnHatcheryResponse = createResponse('response', 'S_SpawnPlayerHatchery', {
        players: filterdPlayerInfos,
      });

      player.socket.write(spawnHatcheryResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterHatcheryHandler;
