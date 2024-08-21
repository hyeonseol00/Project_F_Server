import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getPlayerInfo } from '../../classes/DBgateway/playerinfo.gateway.js';

const enterHatcheryHandler = async ({ socket, payload }) => {
  try {
    const gameSession = getGameSession(config.session.townId);
    const hatcherySession = getHatcherySession();
    const user = await getUserBySocket(socket);

    const { hp, maxHp, name, transform, speed } = hatcherySession.boss;
    const { posX, posY, posZ, rot } = transform;

    gameSession.removeUser(user.nickname);
    hatcherySession.addPlayer(user.nickname);

    /***** S_EnterHatchery *****/
    const transformInfo = {
      posX: Math.random() * 4 - 2 + config.hatchery.spawnAreaPos.x, // -2 ~ 2
      posY: 1.0 + config.hatchery.spawnAreaPos.y,
      posZ: Math.random() * 4 - 2 + config.hatchery.spawnAreaPos.z, // -2 ~ 2
      rot: 180,
    };
    hatcherySession.transforms[user.nickname] = transformInfo;

    const bossTransformInfo = { posX, posY, posZ, rot };
    const enterHatcheryResponse = createResponse('response', 'S_EnterHatchery', {
      player: await getPlayerInfo(socket),
      bossTransformInfo,
      bossMaxHp: maxHp,
      bossSpeed: speed,
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
    for (const nickname of hatcherySession.playerNicknames) {
      const user = getUserByNickname(nickname);
      playerInfos.push(await getPlayerInfo(user.socket));
    }

    for (const nickname of hatcherySession.playerNicknames) {
      const user = getUserByNickname(nickname);
      const filterdPlayerInfos = playerInfos.filter((playerInfo) => {
        playerInfo.transform = gameSession.transforms[playerInfo.nickname];
        return playerInfo.nickname !== nickname;
      });

      const spawnHatcheryResponse = createResponse('response', 'S_SpawnPlayerHatchery', {
        players: filterdPlayerInfos,
      });

      user.socket.write(spawnHatcheryResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterHatcheryHandler;
