import { getStatInfo, setStatInfo } from '../../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../../config/config.js';
import { removeDungeon } from '../../../session/dungeon.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

export default async function gameOverLoseScene(responseCode, dungeon, socket) {
  const nickname = dungeon.nickname;

  const playerStatus = await getStatInfo(socket);
  playerStatus.hp = config.battleScene.respawnHp; // 플레이어 사망 시 체력 50으로 마을로 귀한

  await setStatInfo(socket, playerStatus);

  if (responseCode == 1) {
    const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
    socket.write(responseLeaveDungeon);

    removeDungeon(nickname);
  }
}
